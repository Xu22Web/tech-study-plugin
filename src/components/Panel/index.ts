import URL_CONFIG from '../../config/url';
import { SettingType } from '../../enum';
import useCurrentWindow from '../../hooks/useWindow';
import store from '../../store';
import { Settings, TaskConfig } from '../../types';
import { notification, onTabRemoved } from '../../utils/chromeUtils';
import { ref, watchEffectRef, watchRef } from '../../utils/composition';
import { createElementNode, createTextNode } from '../../utils/element';
import { log } from '../../utils/log';
import { onMessage, sendMessage } from '../../utils/message';
import {
  addValueListener,
  getValue,
  removeAllValues,
  setValue,
} from '../../utils/storage';
import { debounce } from '../../utils/utils';
import Hr from '../Hr';
import Icon from '../Icon';
import LoginItem from '../LoginItem';
import MessageItem from '../MessageItem';
import NormalItem from '../Normalltem';
import ScoreItem from '../ScoreItem';
import SettingsPanel from '../SettingsPanel';
import StudyItem from '../StudyItem';
import TaskList from '../TaskList';
import UserItem from '../UserItem';
import './index.less';

/**
 * @description 面板
 */
async function Panel() {
  // 存储
  const {
    tabId,
    login,
    themeColor,
    settings,
    taskConfig,
    maxRead,
    maxWatch,
    pushToken,
  } = store;
  // 运行设置标签
  const runLabels = [
    {
      title: '自动开始',
      tip: '启动时, 自动开始任务, 在倒计时结束前自动开始可随时取消; 如果在自动开始前手动开始任务, 此次自动开始将取消',
      type: SettingType.AUTO_START,
    },
    {
      title: '定时刷新',
      tip: '定时刷新页面，重新进行任务，此功能需要长时间占用浏览器',
      type: SettingType.SCHEDULE_RUN,
    },
    {
      title: '视频静音',
      tip: '视听学习时，静音播放视频',
      type: SettingType.VIDEO_MUTED,
    },
  ];
  // 运行设置标签
  const examLabels = [
    {
      title: '随机作答',
      tip: '无答案时, 随机选择或者填入答案, 不保证正确',
      type: SettingType.RANDOM_EXAM,
    },
    {
      title: '自动答题',
      tip: '进入答题页面时，自动答题并提交答案',
      type: SettingType.AUTO_ANSWER,
    },
  ];
  // 推送设置标签
  const pushLabels = [
    {
      title: '远程推送',
      tip: '利用 pushplus 推送, 将登录二维码直接推送到微信公众号',
      type: SettingType.REMOTE_PUSH,
    },
  ];
  // 设置显示
  const settingsShow = ref(false);
  // 处理设置变化
  const handleSettingsChange = (e: Event, type: SettingType, title: string) => {
    // 开关
    const { checked } = <HTMLInputElement>e.target;
    if (settings[type] !== checked) {
      settings[type] = checked;
      // 本地存储
      setValue('settings', settings);
      // 通知
      notification(`${title} ${checked ? '打开' : '关闭'}`);
    }
  };
  // 初始化任务配置
  const initTaskConfig = async () => {
    // 任务配置
    const taskConfigTemp = await getValue<TaskConfig>('taskConfig');
    try {
      if (taskConfigTemp && taskConfig.length === taskConfigTemp.length) {
        taskConfig.forEach((task, i) => {
          task.active = taskConfigTemp[i].active;
        });
      }
    } catch (e) {
      taskConfig.forEach((task) => {
        task.active = true;
      });
    }
  };
  // 初始化设置
  const initSettings = async () => {
    // 设置信息
    const settingsTemp = await getValue<Settings>('settings');
    try {
      if (settingsTemp && settings.length === settingsTemp.length) {
        settings.forEach((_, i) => (settings[i] = settingsTemp[i]));
      }
    } catch (e) {
      settings.fill(false);
    }
  };
  // 初始化最大阅读
  const initMaxRead = async () => {
    // 最大阅读时间
    const maxReadTemp = await getValue<number>('maxRead');
    maxReadTemp && (maxRead.value = maxReadTemp);
    // 监听变化
    addValueListener<number>('maxRead', (newValue) => {
      newValue && (maxRead.value = newValue);
    });
  };
  // 初始化最大观看
  const initMaxWatch = async () => {
    // 最大观看时间
    const maxWatchTemp = await getValue<number>('maxWatch');
    maxWatchTemp && (maxWatch.value = maxWatchTemp);
    // 监听变化
    addValueListener<number>('newWatch', (newValue) => {
      newValue && (maxWatch.value = newValue);
    });
  };
  // 初始化推送
  const initPushToken = async () => {
    // 推送 token
    const pushTokenTemp = await getValue<string>('pushToken');
    pushTokenTemp && (pushToken.value = pushTokenTemp);
  };
  // 初始化主题色
  const initThemeColor = async () => {
    // 获取颜色
    const themeColorTemp = await getValue<string>('themeColor');
    // 设置主题色
    themeColorTemp && (themeColor.value = themeColorTemp);
    // 监听颜色变化
    addValueListener<string>('themeColor', (newValue) => {
      newValue && (themeColor.value = newValue);
    });
  };
  // 初始化配置数据
  const initConfigData = () => {
    return Promise.all([
      initThemeColor(),
      initTaskConfig(),
      initSettings(),
      initMaxRead(),
      initMaxWatch(),
      initPushToken(),
    ]);
  };
  // 初始化监听
  const initConnectionListener = () => {
    // 锁
    let locked = false;
    // 超时
    let timer = -1;
    // 临时tabId
    let tempTabId = -1;
    // 检测存在链接
    onMessage('connect', (_, sender) => {
      if (!sender.tab?.id) {
        return;
      }
      if (locked) {
        sendMessage('occupied', {
          type: 'tab',
          id: sender.tab.id,
          data: null,
        });
        return;
      }
      if (!locked) {
        // 加锁
        locked = true;
        tempTabId = sender.tab.id;
        timer = setTimeout(() => {
          // 超时解锁
          locked = false;
          // 重置临时tabId
          tempTabId = -1;
        }, 3000);
      }
      log('正在连接...');
      // 尝试连接
      sendMessage('connecting', {
        type: 'tab',
        id: sender.tab.id,
        data: null,
      });
    });
    // 确认连接
    onMessage('connected', async (_, sender) => {
      if (!sender.tab?.id) {
        return;
      }
      // 两次id不一致
      if (sender.tab.id !== tempTabId) {
        return;
      }
      // 清除超时
      clearTimeout(timer);
      // 重置临时tabId
      tempTabId = -1;

      log('已连接!');
      // 通知
      notification('已连接!');
      // tabId
      const { id } = sender.tab;
      // 设置tabId
      tabId.value = id;
      // 设置标签页状态
      await chrome.tabs.update(id, { autoDiscardable: false });
      // 刷新登录状态
      refreshLoginStatus();
      // 设置失去连接事件监听
      onTabRemoved(
        id,
        () => {
          locked = false;
          handleDisconnect();
        },
        { once: true }
      );
      onMessage(
        'disconnect',
        (_, sender) => {
          if (!sender.tab?.id) {
            return;
          }
          if (id !== sender.tab.id) {
            return;
          }
          locked = false;
          handleDisconnect();
        },
        { once: true }
      );
    });
  };
  // 处理连接断开
  const handleDisconnect = async () => {
    log('被动断开连接!');
    // 通知
    notification('已断开连接!');
    // 重置
    tabId.value = 0;
    // 重置登录状态
    login.value = false;
    // 获取当前窗口
    const win = await useCurrentWindow();
    // 设置窗口高度
    win.height.value = 700;
  };
  // 刷新登录状态
  const refreshLoginStatus = async () => {
    // 检测登录状态
    const { value } =
      (await chrome.cookies.get({ url: URL_CONFIG.home, name: 'token' })) || {};
    // 未登录
    if (!value) {
      return;
    }
    // 登录成功
    login.value = true;
  };
  // 初始化配置数据
  await initConfigData();
  // 初始化连接监听
  initConnectionListener();
  return createElementNode(
    'div',
    undefined,
    {
      class: 'egg_panel',
      style: watchEffectRef(() => `--themeColor: ${themeColor.value}`),
    },
    [
      createElementNode(
        'div',
        undefined,
        {
          class: 'egg_tool_bar_wrap',
        },
        [
          createElementNode('div', undefined, { class: 'egg_indicator_wrap' }, [
            createElementNode('div', undefined, {
              class: watchEffectRef(
                () => `egg_indicator${tabId.value ? ' active' : ''}`
              ),
            }),
            createElementNode(
              'div',
              undefined,
              {
                class: 'egg_indicator_status',
              },
              createTextNode(
                watchEffectRef(() => (tabId.value ? ' 已连接' : '未连接'))
              )
            ),
          ]),
          createElementNode('div', undefined, { class: 'egg_feature_wrap' }, [
            createElementNode(
              'button',
              undefined,
              {
                class: 'egg_btn',
                title: '重置',
                type: 'button',
                onclick: debounce(() => {
                  // 重置任务配置
                  taskConfig.forEach((task) => {
                    !task.disabled && (task.active = true);
                  });
                  // 重置设置
                  settings.fill(false);
                  // 重置阅读
                  maxRead.value = 80;
                  // 重置观看
                  maxWatch.value = 100;
                  // 重置主题
                  themeColor.value = '#fa3333';
                  // 重置推送 token
                  pushToken.value = '';
                  // 任务配置
                  removeAllValues();
                }, 300),
              },
              Icon({
                paths: [
                  'M930.816609 339.889816V379.21591H90.455424v-39.326094h840.361185m9.363355-65.543491H81.092069c-31.016116 0-56.180135 28.558235-56.180135 63.787862v42.837353C24.911934 416.201166 50.075953 444.759401 81.092069 444.759401h859.087895c31.016116 0 56.180135-28.558235 56.180135-63.787861v-42.837353c0-35.229626-25.164019-63.787861-56.180135-63.787862z',
                  'M966.280319 1024h-0.234084l-906.255801-6.554349a33.122871 33.122871 0 0 1-24.929935-11.821237 32.771745 32.771745 0 0 1-7.139558-26.685564l98.549319-563.205852a32.771745 32.771745 0 1 1 64.490114 11.236027L98.999487 952.136244l827.954737 5.969139-95.974397-530.902274a32.771745 32.771745 0 0 1 64.490113-11.704195l103.113956 569.877243a32.888787 32.888787 0 0 1-32.303577 38.623843z',
                  'M283.69168 1001.996114a29.962739 29.962739 0 0 1-4.564636-0.351126 28.090067 28.090067 0 0 1-23.291347-32.186536l61.798148-380.854497a28.090067 28.090067 0 1 1 55.360841 9.01223L311.31358 978.470682a27.973025 27.973025 0 0 1-27.6219 23.525432zM566.1139 333.218425h-114.935193a32.771745 32.771745 0 0 1-32.771745-32.771745V90.239342a90.239342 90.239342 0 1 1 180.478683 0v210.207338a32.771745 32.771745 0 0 1-32.771745 32.771745z m-82.163448-65.543491h49.391702V90.239342a24.695851 24.695851 0 1 0-49.391702 0z',
                ],
              })
            ),
            createElementNode(
              'button',
              undefined,
              {
                class: 'egg_btn',
                title: '设置',
                type: 'button',
                onclick: debounce(() => {
                  settingsShow.value = true;
                }, 300),
              },
              Icon({
                paths: [
                  'M7.25325 705.466473a503.508932 503.508932 0 0 0 75.26742 121.391295 95.499302 95.499302 0 0 0 93.211173 31.07039 168.59902 168.59902 0 0 1 114.527206 16.257763 148.487566 148.487566 0 0 1 71.052444 83.456515 91.163899 91.163899 0 0 0 75.989987 61.538643 578.053784 578.053784 0 0 0 148.969278 0A91.163899 91.163899 0 0 0 662.380873 957.642436a148.487566 148.487566 0 0 1 72.256723-83.456515 168.59902 168.59902 0 0 1 114.406478-16.257763 95.61973 95.61973 0 0 0 93.331601-31.07039 503.508932 503.508932 0 0 0 75.267419-121.391295 84.29951 84.29951 0 0 0-18.545892-94.897163 138.251197 138.251197 0 0 1 0-197.140426 84.29951 84.29951 0 0 0 18.545892-94.897163 503.508932 503.508932 0 0 0-75.869559-121.391295 95.499302 95.499302 0 0 0-93.211173-31.070391A168.59902 168.59902 0 0 1 734.637596 149.812272a148.848849 148.848849 0 0 1-72.256723-83.456515A91.163899 91.163899 0 0 0 586.631741 4.817115a581.907476 581.907476 0 0 0-148.969277 0A91.163899 91.163899 0 0 0 361.311193 66.355757a148.848849 148.848849 0 0 1-71.413728 83.456515 168.59902 168.59902 0 0 1-114.406478 16.257763 95.378874 95.378874 0 0 0-93.3316 31.070391A503.508932 503.508932 0 0 0 7.25325 318.531721a84.29951 84.29951 0 0 0 18.545893 94.897163 140.057615 140.057615 0 0 1 41.30676 98.509999 140.057615 140.057615 0 0 1-41.30676 98.630427A84.29951 84.29951 0 0 0 7.25325 705.466473z m929.462315-349.240828a219.901294 219.901294 0 0 0 0 312.028615c0.842995 0.842995 2.649413 3.010697 1.806418 5.057971a427.398517 427.398517 0 0 1-63.104205 101.520696 9.513802 9.513802 0 0 1-9.032091 2.167702 255.547944 255.547944 0 0 0-173.777418 24.928569 231.823653 231.823653 0 0 0-111.275354 130.302957 6.984817 6.984817 0 0 1-6.021394 4.937543 492.790851 492.790851 0 0 1-126.328837 0 6.984817 6.984817 0 0 1-6.021394-4.937543 231.823653 231.823653 0 0 0-111.275353-130.302957 255.668372 255.668372 0 0 0-120.427872-30.468252 258.919924 258.919924 0 0 0-52.747408 5.539683 9.513802 9.513802 0 0 1-9.03209-2.167702 427.398517 427.398517 0 0 1-63.104205-101.520696c-0.842995-2.047274 0.963423-4.214976 1.806418-5.057971a221.82814 221.82814 0 0 0 64.910623-156.556233 221.707712 221.707712 0 0 0-65.512762-155.713238c-0.842995-0.842995-2.649413-3.010697-1.806418-5.057971a427.398517 427.398517 0 0 1 63.104205-101.520696 9.393374 9.393374 0 0 1 8.911662-2.167701 255.7888 255.7888 0 0 0 173.897847-24.92857 231.823653 231.823653 0 0 0 111.275353-130.302957 6.984817 6.984817 0 0 1 6.021394-4.937543 492.790851 492.790851 0 0 1 126.328837 0 6.984817 6.984817 0 0 1 6.021394 4.937543 231.823653 231.823653 0 0 0 111.275354 130.302957 255.547944 255.547944 0 0 0 173.777418 24.92857 9.513802 9.513802 0 0 1 9.032091 2.167701 423.063113 423.063113 0 0 1 62.983777 101.520696c0.963423 2.047274-0.842995 4.214976-1.68599 5.057971z',
                  'M512.086889 305.766366a206.292944 206.292944 0 1 0 206.172516 206.172517 206.413372 206.413372 0 0 0-206.172516-206.172517z m123.197713 206.172517a123.197713 123.197713 0 1 1-123.197713-123.077285 123.318141 123.318141 0 0 1 123.197713 123.077285z',
                ],
              })
            ),
          ]),
        ]
      ),
      watchRef(
        () => [tabId.value, login.value],
        () => (tabId.value && !login.value ? LoginItem() : undefined)
      ),
      watchRef(
        () => [tabId.value, login.value],
        () => (tabId.value && login.value ? UserItem() : undefined)
      ),
      ScoreItem(),
      // 任务部分
      Hr({ text: '任务' }),
      TaskList(),
      // 运行部分
      Hr({ text: '运行' }),
      createElementNode(
        'div',
        undefined,
        { class: 'egg_run_list' },
        runLabels.map((label) => {
          return NormalItem({
            title: label.title,
            tip: label.tip,
            checked: watchEffectRef(() => settings[label.type]),
            onchange: debounce((e) => {
              handleSettingsChange(e, label.type, label.title);
            }, 300),
          });
        })
      ),
      // 答题部分
      Hr({ text: '答题' }),
      createElementNode(
        'div',
        undefined,
        { class: 'egg_exam_list' },
        examLabels.map((label) => {
          return NormalItem({
            title: label.title,
            tip: label.tip,
            checked: watchEffectRef(() => settings[label.type]),
            onchange: debounce((e) => {
              handleSettingsChange(e, label.type, label.title);
            }, 300),
          });
        })
      ),
      // 推送部分
      Hr({ text: '推送' }),
      createElementNode(
        'div',
        undefined,
        { class: 'egg_push_list' },
        pushLabels.map((label) => {
          return NormalItem({
            title: label.title,
            tip: label.tip,
            checked: watchEffectRef(() => settings[label.type]),
            onchange: debounce((e) => {
              handleSettingsChange(e, label.type, label.title);
            }, 300),
          });
        })
      ),
      watchRef(
        () => [tabId.value, login.value],
        () => (tabId.value && login.value ? StudyItem() : undefined)
      ),
      // 消息
      MessageItem(),
      // 设置面板
      SettingsPanel({ settingsShow, settings, themeColor }),
      createElementNode(
        'div',
        undefined,
        { class: 'egg_back_item' },
        Icon({
          viewBox: '0 0 762 52.917',
          paths: [
            'M0 0c22.863 0 40.637 25.93 63.5 25.93S104.137 0 127 0s40.637 25.93 63.5 25.93S231.137 0 254 0s40.637 25.93 63.5 25.93S358.137 0 381 0s40.637 25.93 63.5 25.93S485.137 0 508 0s40.637 25.93 63.5 25.93S612.137 0 635 0s40.637 25.93 63.5 25.93S739.137 0 762 0v52.917H0z',
          ],
        })
      ),
    ]
  );
}

export default Panel;
