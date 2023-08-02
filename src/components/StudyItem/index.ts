import { UserInfo } from '../../api/user';
import URL_CONFIG from '../../config/url';
import {
  ReadAndWatch,
  SettingType,
  StudyStatusType,
  TaskType,
} from '../../enum';
import useCurrentWindow from '../../hooks/useWindow';
import store from '../../store';
import { NewsVideoList, TaskConfig } from '../../types';
import { notification, onTabRemoved } from '../../utils/chromeUtils';
import {
  ref,
  watch,
  watchEffect,
  watchEffectRef,
  watchRef,
} from '../../utils/composition';
import { createDispatchEvent } from '../../utils/dispatchEvent';
import { createDocumentHandler } from '../../utils/domHandler';
import { createElementNode, createTextNode } from '../../utils/element';
import { error, log } from '../../utils/log';
import { fetchMessageData, onMessage, sendMessage } from '../../utils/message';
import {
  createHighlightHTML,
  createProgressHTML,
  pushModal,
} from '../../utils/push';
import { createRandomPath, createRandomPoint } from '../../utils/random';
import {
  boxModelToBounds,
  createCountDown,
  debounce,
  sleep,
  waitCondition,
} from '../../utils/utils';
import './index.less';

function StudyItem() {
  // 存储
  const {
    taskConfig,
    todayScore,
    totalScore,
    tabId,
    maxRead,
    maxWatch,
    settings,
    isBlack,
    userInfo,
    pushToken,
  } = store;
  // 学习状态
  const studyStatus = ref<StudyStatusType>(StudyStatusType.LOADING);
  // 暂停
  const paused = ref(false);
  // 任务完成
  const isFinished = () =>
    taskConfig.every((task) => !task.active || (task.active && task.status));
  // 获取用户信息
  const getUserInfo = async () => {
    log('获取用户信息...');
    try {
      const data = await fetchMessageData<UserInfo | undefined>('getUserInfo', {
        type: 'tab',
        id: tabId.value,
      });
      if (data) {
        userInfo.value = data;
        log('获取用户信息成功!');
        return;
      }
    } catch (e) {}
    error('获取用户信息失败!');
  };
  // 刷新任务
  const refreshTaskConfig = async () => {
    log('获取任务进度...');
    try {
      // 获取任务进度
      const data = await fetchMessageData<
        { taskProgress: TaskConfig; inBlackList: boolean } | undefined
      >('getTaskProgress', {
        type: 'tab',
        id: tabId.value,
        data: null,
      });
      if (data) {
        // 数据
        const { taskProgress, inBlackList } = data;
        taskProgress.forEach((task, i) => {
          taskConfig[i].currentScore = task.currentScore;
          taskConfig[i].dayMaxScore = task.dayMaxScore;
          taskConfig[i].status = task.status;
          taskConfig[i].need = task.need;
        });
        isBlack.value = inBlackList;
        log('获取任务进度成功!');
        return;
      }
    } catch (e) {}
    error('获取任务进度失败!');
  };
  // 刷新总分
  const refreshTotalScore = async () => {
    log('获取总分...');
    try {
      // 获取总分
      const data = await fetchMessageData<number | undefined>('getTotalScore', {
        type: 'tab',
        id: tabId.value,
        data: null,
      });
      if (data) {
        totalScore.value = data;
        log('获取总分成功!');
        return;
      }
    } catch (e) {}
    error('获取总分失败!');
  };
  // 刷新当天分数
  const refreshTodayScore = async () => {
    log('获取当天分数...');
    try {
      // 获取当天分数
      const data = await fetchMessageData<number | undefined>('getTodayScore', {
        type: 'tab',
        id: tabId.value,
        data: null,
      });
      if (data) {
        todayScore.value = data;
        log('获取当天分数成功!');
        return;
      }
    } catch (e) {}
    error('获取当天分数失败!');
  };
  // 刷新数据
  const refreshData = () => {
    // 减少阻塞
    return Promise.all([
      // 刷新任务
      refreshTaskConfig(),
      // 刷新当天分数
      refreshTodayScore(),
      // 刷新总分
      refreshTotalScore(),
    ]);
  };
  // 文章选读
  const handleRead = async () => {
    // 等待
    await waitCondition(() => {
      if (paused.value) {
        log('等待中...');
      }
      return !paused.value;
    });
    try {
      // 获取任务进度
      const news = await fetchMessageData<NewsVideoList>('getNews', {
        type: 'tab',
        id: tabId.value,
        data: taskConfig[TaskType.READ].need,
      });
      // 窗口
      const win = await useCurrentWindow();
      for (const i in news) {
        log(`阅读第${Number(i) + 1}篇文章`);
        // 等待
        await waitCondition(() => {
          if (paused.value) {
            log('等待中...');
          }
          return !paused.value;
        });
        // 创建页面
        const tab = await chrome.tabs.create({
          url: news[i].url,
          active: true,
        });
        // 标签id
        const id = tab.id!;
        // 阻止休眠
        await chrome.tabs.update(id, {
          autoDiscardable: false,
        });
        // 标签页关闭
        let tabRemoved = false;
        // 设置窗口高度
        win.height.value = 720;
        // 调试
        await chrome.debugger.attach({ tabId: id }, '1.3');
        // 事件派发
        const { dispatchMouseWheelEvent } = createDispatchEvent(id);
        // 等待加载完毕
        const load = await waitCondition(async () => {
          try {
            // 题目加载完成
            return await fetchMessageData<boolean>('load', {
              type: 'tab',
              id,
            });
          } catch (e) {
            return false;
          }
        }, 6000);
        if (!load) {
          error('页面加载失败!');
          continue;
        }
        log('页面加载成功!');
        try {
          // 获取数据
          const data = await fetchMessageData<{
            duration: number;
            width: number;
            height: number;
            innerWidth: number;
            innerHeight: number;
          } | null>('getData', {
            type: 'tab',
            data: { max: maxRead.value, type: ReadAndWatch.READ },
            id: tab.id!,
          });
          if (!data) {
            error('获取页面信息失败!');
            continue;
          }
          // 数据
          const { height, duration, innerWidth, innerHeight } = data;
          // 生成随机点
          const point = createRandomPoint({
            x: 0,
            y: 0,
            width: innerWidth,
            height: innerHeight,
          });
          // 滚动鼠标次数
          const totalTimes = ~~((height * 12) / (duration * 120));
          // 倒计时
          const { wait, cancel } = createCountDown(duration, async (count) => {
            // 等待
            await waitCondition(() => {
              if (paused.value) {
                log('等待中...');
              }
              return !paused.value;
            });
            log(`剩余${count}s`);
            if (count && count % 12 === 0) {
              // 滚动次数
              let times = totalTimes;
              // 鼠标滚动
              while (times--) {
                await dispatchMouseWheelEvent({
                  direction: 'down',
                  ...point,
                });
              }
            }
          });
          // 页面卸载
          onMessage(
            'unload',
            async () => {
              if (tabRemoved) {
                return;
              }
              // 取消倒计时
              cancel();
              log('刷新标签页, 取消倒计时');
            },
            { once: true }
          );
          // 页面关闭
          onTabRemoved(
            id,
            () => {
              // 关闭状态
              tabRemoved = true;
              // 取消倒计时
              cancel();
              log('关闭标签页, 取消倒计时');
            },
            { once: true }
          );
          // 等待倒计时结束
          await wait();
        } catch (e) {
          error(e);
        }
        // 关闭页面
        if (!tabRemoved) {
          // 关闭调试
          await chrome.debugger.detach({ tabId: id });
          // 设置窗口高度
          win.height.value = 700;
          // 关闭状态
          tabRemoved = true;
          // 关闭页面
          await chrome.tabs.remove(id);
        }
        // 刷新数据
        await refreshData();
        // 完成任务
        if (
          !taskConfig[TaskType.READ].active ||
          (taskConfig[TaskType.READ].active && taskConfig[TaskType.READ].status)
        ) {
          break;
        }
      }
    } catch (e) {
      error('获取新闻失败!', e);
    }
    // 等待
    await waitCondition(() => {
      if (paused.value) {
        log('等待中...');
      }
      return !paused.value;
    });
    // 未完成任务
    if (taskConfig[TaskType.READ].active && !taskConfig[TaskType.READ].status) {
      await handleRead();
    }
  };
  // 视听学习
  const handleWatch = async () => {
    // 等待
    await waitCondition(() => {
      if (paused.value) {
        log('等待中...');
      }
      return !paused.value;
    });
    try {
      // 获取任务进度
      const videos = await fetchMessageData<NewsVideoList>('getVideos', {
        type: 'tab',
        id: tabId.value,
        data: taskConfig[TaskType.WATCH].need,
      });
      // 窗口
      const win = await useCurrentWindow();
      for (const i in videos) {
        log(`观看第${Number(i) + 1}个视频`);
        // 等待
        await waitCondition(() => {
          if (paused.value) {
            log('等待中...');
          }
          return !paused.value;
        });
        // 创建页面
        const tab = await chrome.tabs.create({
          url: videos[i].url,
          active: true,
        });
        // 标签id
        const id = tab.id!;
        // 阻止休眠
        await chrome.tabs.update(id, {
          autoDiscardable: false,
        });
        // 标签页被关闭
        let tabRemoved = false;
        // 设置窗口高度
        win.height.value = 720;
        // 调试
        await chrome.debugger.attach({ tabId: id }, '1.3');
        // 事件派发
        const { dispatchMouseWheelEvent, dispatchMouseClickEvent } =
          createDispatchEvent(id);
        // 等待加载完毕
        const load = await waitCondition(async () => {
          try {
            // 题目加载完成
            return await fetchMessageData<boolean>('load', {
              type: 'tab',
              id,
            });
          } catch (e) {
            return false;
          }
        }, 6000);
        if (!load) {
          error('页面加载失败!');
          continue;
        }
        log('页面加载成功!');
        try {
          // 获取数据
          const data = await fetchMessageData<{
            duration: number;
            width: number;
            height: number;
            innerWidth: number;
            innerHeight: number;
          } | null>('getData', {
            type: 'tab',
            data: { max: maxWatch.value, type: ReadAndWatch.WATCH },
            id,
          });
          if (!data) {
            error('获取页面信息失败!');
            continue;
          }
          // 设置标签页状态
          watchEffect(() => {
            !tabRemoved &&
              sendMessage('muted', {
                type: 'tab',
                id,
                data: settings[SettingType.VIDEO_MUTED],
              });
          });
          // 设置标签页状态
          watchEffect(() => {
            !tabRemoved &&
              sendMessage('pause', {
                type: 'tab',
                id,
                data: paused.value,
              });
          });
          // 数据
          const { duration, innerWidth, innerHeight } = data;
          // 生成随机点
          const point = createRandomPoint({
            x: 0,
            y: 0,
            width: innerWidth,
            height: innerHeight,
          });
          // 滚动次数
          let times = 3;
          while (times--) {
            // 滚动
            await dispatchMouseWheelEvent({
              direction: 'down',
              ...point,
            });
          }
          // 点击
          await dispatchMouseClickEvent({
            button: 'left',
            clickCount: 1,
            ...point,
          });
          // 等待播放完毕
          const play = await waitCondition(async () => {
            try {
              // 题目加载完成
              return await fetchMessageData<boolean>('play', {
                type: 'tab',
                id,
              });
            } catch (e) {
              return false;
            }
          }, 10000);
          if (!play) {
            error('视频播放失败!');
            continue;
          }
          log('视频播放成功!');
          // 创建倒计时
          const { wait, cancel } = createCountDown(duration, async (count) => {
            // 等待
            await waitCondition(() => {
              if (paused.value) {
                log('等待中...');
              }
              return !paused.value;
            });
            log(`剩余${count}s`);
          });
          // 页面卸载
          onMessage(
            'unload',
            async () => {
              if (tabRemoved) {
                return;
              }
              // 取消倒计时
              cancel();
              log('刷新标签页, 取消倒计时');
            },
            { once: true }
          );
          // 页面关闭
          onTabRemoved(
            id,
            () => {
              // 关闭状态
              tabRemoved = true;
              // 取消倒计时
              cancel();
              log('关闭标签页, 取消倒计时');
            },
            { once: true }
          );
          // 等待倒计时结束
          await wait();
        } catch (e) {
          error(e);
        }
        // 关闭页面
        if (!tabRemoved) {
          // 关闭调试
          await chrome.debugger.detach({ tabId: id });
          // 设置窗口高度
          win.height.value = 700;
          // 关闭状态
          tabRemoved = true;
          // 关闭页面
          await chrome.tabs.remove(id!);
        }
        // 刷新数据
        await refreshData();
        // 完成任务
        if (
          !taskConfig[TaskType.WATCH].active ||
          (taskConfig[TaskType.WATCH].active &&
            taskConfig[TaskType.WATCH].status)
        ) {
          break;
        }
      }
    } catch (e) {
      error('获取视频失败!', e);
    }
    // 等待
    await waitCondition(() => {
      if (paused.value) {
        log('等待中...');
      }
      return !paused.value;
    });
    // 未完成任务
    if (
      taskConfig[TaskType.WATCH].active &&
      !taskConfig[TaskType.WATCH].status
    ) {
      await handleWatch();
    }
  };
  // 处理滑动验证
  const handleSlideVerify = async (id: number) => {
    // 文档节点
    const doc = await createDocumentHandler(id);
    // 派发事件
    const { dispatchMouseSlideEvent } = createDispatchEvent(id);
    // 轨道
    const track = await doc.querySelector('.nc_scale');
    // 滑块
    const slide = await doc.querySelector('.btn_slide');
    // 轨道盒子模型
    const { model: trackModel } = await doc.getBoxModel(track.nodeId);
    // 滑块盒子模型
    const { model: slideModel } = await doc.getBoxModel(slide.nodeId);
    // 轨道范围
    const trackBounds = boxModelToBounds(trackModel);
    // 滑块范围
    const slideBounds = boxModelToBounds(slideModel);
    // 范围内随机起点
    const start = createRandomPoint(slideBounds);
    // 终点
    const end = {
      x: trackBounds.x + trackBounds.width,
      y: trackBounds.y + trackBounds.height / 2,
    };
    // 路径
    const path = createRandomPath(start, end, 10);
    // 滑动
    await dispatchMouseSlideEvent(
      path.map((pointer) => ({ button: 'left', clickCount: 1, ...pointer }))
    );
  };
  // 处理提示
  const handleTips = async ({
    doc,
    dispatchMouseClickEvent,
  }: {
    doc: Awaited<ReturnType<typeof createDocumentHandler>>;
    dispatchMouseClickEvent: Awaited<
      ReturnType<typeof createDispatchEvent>
    >['dispatchMouseClickEvent'];
  }) => {
    // 获取提示节点
    const tips = await doc.querySelector('.tips');
    // 提示
    const { model: tipsModel } = await doc.getBoxModel(tips.nodeId);
    // 范围
    const tipsBounds = boxModelToBounds(tipsModel);
    // 等待提示出现
    await waitCondition(async () => {
      // 点击位置
      const tipsPointer = createRandomPoint(tipsBounds);
      // 点击
      await dispatchMouseClickEvent({
        button: 'left',
        clickCount: 1,
        ...tipsPointer,
      });
      // 获取提示节点
      const tips = await doc.querySelector('.tips.ant-popover-open');
      return !!tips.nodeId;
    });
    // 关闭提示
    await waitCondition(async () => {
      // 点击位置
      const tipsPointer = createRandomPoint(tipsBounds);
      // 点击
      await dispatchMouseClickEvent({
        button: 'left',
        clickCount: 1,
        ...tipsPointer,
      });
      // 获取提示
      const tips = await doc.querySelector('.tips.ant-popover-open');
      return !tips.nodeId;
    });
  };
  // 处理答案
  const handleAnswers = async ({
    id,
    type,
    doc,
    dispatchMouseClickEvent,
    dispatchKeyInputEvent,
  }: {
    id: number;
    type: string;
    doc: Awaited<ReturnType<typeof createDocumentHandler>>;
    dispatchMouseClickEvent: Awaited<
      ReturnType<typeof createDispatchEvent>
    >['dispatchMouseClickEvent'];
    dispatchKeyInputEvent: Awaited<
      ReturnType<typeof createDispatchEvent>
    >['dispatchKeyInputEvent'];
  }) => {
    // 获取答案
    const answers = await fetchMessageData<number[] | string[] | undefined>(
      'answers',
      {
        type: 'tab',
        id,
      }
    );
    log('答案', answers);
    if (!answers) {
      return;
    }
    // 等待
    await sleep(2000);
    // 等待
    await waitCondition(() => {
      if (paused.value) {
        log('等待中...');
      }
      return !paused.value;
    });
    if (type === '多选题') {
      // 索引
      const indexs = <number[]>answers;
      // 选项
      const { nodeIds: allBtnNodeIds } = await doc.querySelectorAll(
        '.q-answer'
      );
      // 需要被选id
      const needChosenNodeIds = indexs.map((i) => allBtnNodeIds[i]);
      // 盒子模型
      const boxModels = await Promise.all(
        needChosenNodeIds.map((nodeId) => doc.getBoxModel(nodeId))
      );
      // 范围
      const pointers = boxModels.map(({ model }) =>
        createRandomPoint(boxModelToBounds(model))
      );
      // 等待点击
      for (const pointer of pointers) {
        // 点击
        await dispatchMouseClickEvent({
          button: 'left',
          clickCount: 1,
          ...pointer,
        });
        // 等待
        await sleep(500);
      }
    }
    if (type === '单选题') {
      // 索引
      const [index] = <number[]>answers;
      // 选项
      const { nodeIds: allBtnNodeIds } = await doc.querySelectorAll(
        '.q-answer'
      );
      // 盒子模型
      const { model } = await doc.getBoxModel(allBtnNodeIds[index]);
      // 范围
      const pointer = createRandomPoint(boxModelToBounds(model));
      // 点击
      await dispatchMouseClickEvent({
        button: 'left',
        clickCount: 1,
        ...pointer,
      });
      // 等待
      await sleep(300);
    }
    if (type === '填空题') {
      // 答案
      const answerTexts = <string[]>answers;
      // 填空
      const { nodeIds: blankNodeIds } = await doc.querySelectorAll('.blank');
      // 输入
      for (const i in blankNodeIds) {
        // 节点id
        const nodeId = blankNodeIds[i];
        // 答案
        const answer = answerTexts[i];
        // 盒子模型
        const { model } = await doc.getBoxModel(nodeId);
        // 范围
        const pointer = createRandomPoint(boxModelToBounds(model));
        // 点击
        await dispatchMouseClickEvent({
          button: 'left',
          clickCount: 1,
          ...pointer,
        });
        // 等待
        await sleep(300);
        // 当前答案
        const currentAnswerChars = answer.split('');
        // 输入
        await dispatchKeyInputEvent(
          currentAnswerChars.map((char) => ({
            text: char,
          }))
        );
        // 等待
        await sleep(300);
      }
    }
  };
  // 处理每日答题
  const handlePracticeExam = async () => {
    // 等待
    await waitCondition(() => {
      if (paused.value) {
        log('等待中...');
      }
      return !paused.value;
    });
    // 窗口
    const win = await useCurrentWindow();
    // 新建标签页
    const tab = await chrome.tabs.create({
      url: URL_CONFIG.examPractice,
      active: true,
    });
    // 标签id
    const id = tab.id!;
    // 阻止休眠
    await chrome.tabs.update(id, {
      autoDiscardable: false,
    });
    // 标签页被关闭
    let tabRemoved = false;
    // 改变窗口高度
    win.height.value = 720;
    // 页面关闭
    onTabRemoved(
      id,
      () => {
        // 关闭状态
        tabRemoved = true;
        log('关闭标签页');
      },
      { once: true }
    );
    // 等待加载完毕
    const load = await waitCondition(async () => {
      try {
        // 题目加载完成
        return await fetchMessageData<boolean>('load', {
          type: 'tab',
          id,
        });
      } catch (e) {
        return false;
      }
    }, 10000);
    if (!load) {
      error('题目加载失败!');
      return;
    }
    log('题目加载成功!');
    // 调试
    await chrome.debugger.attach({ tabId: id }, '1.3');
    // 事件派发
    const {
      dispatchMouseWheelEvent,
      dispatchMouseClickEvent,
      dispatchKeyInputEvent,
    } = createDispatchEvent(id);
    try {
      // 滚动次数
      let times = 4;
      while (times--) {
        // 滚动
        await dispatchMouseWheelEvent({
          direction: 'down',
          x: 120,
          y: 120,
        });
      }
      // 滚动结束
      await fetchMessageData<DOMRect>('wheel', {
        type: 'tab',
        id,
      });
      // 文档
      const doc = await createDocumentHandler(id);
      // 答题
      while (!tabRemoved) {
        // 等待
        await waitCondition(() => {
          if (paused.value) {
            log('等待中...');
          }
          return !paused.value;
        });
        // 下一步文本
        let nextText = await fetchMessageData<string>('next', {
          type: 'tab',
          id,
        });
        // 结束
        const finish = ['再练一次', '再来一组', '查看解析'];
        if (finish.includes(nextText)) {
          break;
        }
        // 题型 总题数 当前题号
        const { type, total, current } = await fetchMessageData<{
          type: '单选题' | '多选题' | '填空题';
          total: string;
          current: string;
        }>('questionData', {
          type: 'tab',
          id,
        });
        log(`${current}/${total} 题型: ${type}`);
        // 处理提示
        await handleTips({ doc, dispatchMouseClickEvent });
        // 处理答案
        await handleAnswers({
          id,
          doc,
          type,
          dispatchMouseClickEvent,
          dispatchKeyInputEvent,
        });
        // 下一步文本
        nextText = await fetchMessageData<string>('next', {
          type: 'tab',
          id,
        });
        if (nextText === '确定') {
          // 下一步按钮
          const { nodeId } = await doc.querySelector('.next-btn');
          // 盒子模型
          const { model } = await doc.getBoxModel(nodeId);
          // 范围
          const pointer = createRandomPoint(boxModelToBounds(model));
          // 点击
          await dispatchMouseClickEvent({
            button: 'left',
            clickCount: 1,
            ...pointer,
          });
        }
        // 下一步文本
        nextText = await fetchMessageData<string>('next', {
          type: 'tab',
          id,
        });
        if (
          nextText === '下一题' ||
          nextText === '完成' ||
          nextText === '交卷'
        ) {
          // 等待一段时间
          await sleep(2500);
          // 下一步按钮
          const { nodeId } = await doc.querySelector('.next-btn');
          // 盒子模型
          const { model } = await doc.getBoxModel(nodeId);
          // 范围
          const pointer = createRandomPoint(boxModelToBounds(model));
          // 点击
          await dispatchMouseClickEvent({
            button: 'left',
            clickCount: 1,
            ...pointer,
          });
        }
        // 结束验证
        if (current === total) {
          // 滑动验证
          const status = await fetchMessageData('slideVerify', {
            type: 'tab',
            id,
          });
          if (status) {
            log('处理滑动验证...');
            // 等待
            await sleep(2000);
            // 处理滑动验证
            await handleSlideVerify(id);
            // 等待
            await sleep(2000);
            // 滑动验证
            const status = await fetchMessageData('slideVerify', {
              type: 'tab',
              id,
            });
            log(`滑动验证${status ? '成功' : '失败'}`);
          }
        }
      }
      log('答题结束!');
    } catch (e) {
      error(e);
    }
    // 关闭页面
    if (!tabRemoved) {
      // 关闭调试
      await chrome.debugger.detach({ tabId: id });
      // 设置窗口高度
      win.height.value = 700;
      // 关闭状态
      tabRemoved = true;
      // 关闭页面
      await chrome.tabs.remove(id!);
    }
    // 等待
    await waitCondition(() => {
      if (paused.value) {
        log('等待中...');
      }
      return !paused.value;
    });
    // 刷新数据
    await refreshData();
    // 完成任务
    if (
      taskConfig[TaskType.PRACTICE].active &&
      !taskConfig[TaskType.PRACTICE].status
    ) {
      return await handlePracticeExam();
    }
  };
  // 开始学习
  const startStudy = async () => {
    // 设置状态
    studyStatus.value = StudyStatusType.PROGRESS;
    // 文章选读
    if (taskConfig[TaskType.READ].active && !taskConfig[TaskType.READ].status) {
      await handleRead();
    }
    // 视听学习
    if (
      taskConfig[TaskType.WATCH].active &&
      !taskConfig[TaskType.WATCH].status
    ) {
      await handleWatch();
    }
    // 每日答题
    if (
      taskConfig[TaskType.PRACTICE].active &&
      !taskConfig[TaskType.PRACTICE].status
    ) {
      await handlePracticeExam();
    }
    // 完成
    if (isFinished()) {
      studyStatus.value = StudyStatusType.FINISH;
      // 远程推送
      if (settings[SettingType.REMOTE_PUSH]) {
        if (!userInfo.value) {
          notification('用户信息不存在!');
          return;
        }
        if (!pushToken.value) {
          notification('推送 token 不存在!');
          return;
        }
        const res = await pushModal(
          {
            title: '学习推送',
            to: userInfo.value.nick,
            content: [
              '学习强国, 学习完成!',
              `当天积分:  ${createHighlightHTML(todayScore.value)} 分`,
              `总积分: ${createHighlightHTML(totalScore.value)} 分`,
              ...taskConfig.map((task) =>
                createProgressHTML(
                  task.title,
                  task.currentScore,
                  task.dayMaxScore
                )
              ),
            ],
            type: 'success',
          },
          pushToken.value
        );
        notification(`推送${res ? '成功' : '失败'}!`);
      }
    }
  };
  // 暂停学习
  const pauseStudy = () => {
    // 设置状态
    studyStatus.value = StudyStatusType.PAUSE;
    paused.value = true;
  };
  // 继续学习
  const continueStudy = () => {
    // 设置状态
    studyStatus.value = StudyStatusType.PROGRESS;
    paused.value = false;
  };
  return createElementNode(
    'div',
    undefined,
    { class: 'egg_study_item' },
    createElementNode(
      'button',
      undefined,
      {
        class: watchEffectRef(
          () =>
            `egg_study_btn${
              studyStatus.value === StudyStatusType.PROGRESS ? ' loading' : ''
            }`
        ),
        type: 'button',
        disabled: watchRef(
          studyStatus,
          () =>
            studyStatus.value === StudyStatusType.LOADING ||
            studyStatus.value === StudyStatusType.FINISH
        ),
        onclick: watchEffectRef(() =>
          studyStatus.value === StudyStatusType.START
            ? debounce(startStudy, 300)
            : studyStatus.value === StudyStatusType.PROGRESS
            ? debounce(pauseStudy, 300)
            : studyStatus.value === StudyStatusType.PAUSE
            ? debounce(continueStudy, 300)
            : undefined
        ),
      },
      createTextNode(
        watchEffectRef(
          () =>
            `${
              studyStatus.value === StudyStatusType.LOADING
                ? '等待中'
                : studyStatus.value === StudyStatusType.START
                ? '开始学习'
                : studyStatus.value === StudyStatusType.PROGRESS
                ? '正在学习, 点击暂停'
                : studyStatus.value === StudyStatusType.PAUSE
                ? '继续学习'
                : studyStatus.value === StudyStatusType.FINISH
                ? '已完成'
                : ''
            }`
        )
      )
    ),
    {
      async onMounted() {
        // 获取用户信息
        await getUserInfo();
        // 刷新数据
        await refreshData();
        // 设置学习状态
        watch(
          () => taskConfig.map((task) => task.active),
          async () => {
            if (
              studyStatus.value === StudyStatusType.LOADING ||
              studyStatus.value === StudyStatusType.FINISH
            ) {
              // 学习完成
              if (isFinished()) {
                studyStatus.value = StudyStatusType.FINISH;
                return;
              }
              // 加载完成
              studyStatus.value = StudyStatusType.START;
            }
          },
          true
        );
        // 远程推送
        if (settings[SettingType.REMOTE_PUSH]) {
          if (!userInfo.value) {
            notification('用户信息不存在!');
            return;
          }
          if (!pushToken.value) {
            notification('推送 token 不存在!');
            return;
          }
          // 学习完成
          const finished = isFinished();
          // 推送
          const res = await pushModal(
            {
              title: '学习推送',
              to: userInfo.value.nick,
              content: [
                `学习强国, 学习${createHighlightHTML(
                  finished ? '完成' : '未完成'
                )}!`,
                `当天积分:  ${createHighlightHTML(todayScore.value)} 分`,
                `总积分: ${createHighlightHTML(totalScore.value)} 分`,
                ...taskConfig.map((task) =>
                  createProgressHTML(
                    task.title,
                    task.currentScore,
                    task.dayMaxScore
                  )
                ),
              ],
              type: 'success',
            },
            pushToken.value
          );
          notification(`推送${res ? '成功' : '失败'}!`);
        }
      },
    }
  );
}

export default StudyItem;
