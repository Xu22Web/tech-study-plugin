import { UserInfo } from '../api/user';
import { TaskType } from '../enum';
import { Settings, TaskConfig } from '../types';
import { NotifyOptions, createNotification } from '../utils/chromeUtils';
import { Reactive, Ref, reactive, ref } from '../utils/composition';

interface Store {
  /**
   * @description 主页标签页id
   */
  tabId: Ref<number>;
  /**
   * @description 登录状态
   */
  login: Ref<boolean>;
  /**
   * @description 主题色
   */
  themeColor: Ref<string>;
  /**
   * @description 任务配置
   */
  taskConfig: Reactive<TaskConfig>;
  /**
   * @description 封禁
   */
  isBlack: Ref<boolean>;
  /**
   * @description 设置
   */
  settings: Reactive<Settings>;
  /**
   * @description 总分
   */
  totalScore: Ref<number>;
  /**
   * @description 当天分数
   */
  todayScore: Ref<number>;
  /**
   * @description 最大阅读时间
   */
  maxRead: Ref<number>;
  /**
   * @description 最大视频时间
   */
  maxWatch: Ref<number>;
  /**
   * @description 消息
   */
  message: Ref<string>;
  /**
   * @description 推送 token
   */
  pushToken: Ref<string>;
  /**
   * @description 用户信息
   */
  userInfo: Ref<UserInfo | null>;
  /**
   * @description 通知
   */
  notify: (options: NotifyOptions) => void;
}
// 通知
const { notify } = createNotification();

/**
 * @description 存储
 */
const store: Store = {
  tabId: ref(0),
  login: ref(false),
  themeColor: ref('#fa3333'),
  settings: reactive<Settings>([false, false, false, false]),
  taskConfig: reactive<TaskConfig>([
    {
      title: '登录',
      currentScore: 0,
      dayMaxScore: 0,
      need: 0,
      status: false,
      tip: '每日首次登录积1分。',
      active: true,
      disabled: true,
      type: TaskType.LOGIN,
    },
    {
      title: '文章选读',
      currentScore: 0,
      dayMaxScore: 0,
      need: 0,
      status: false,
      tip: '每有效阅读一篇文章积1分，上限6分。有效阅读文章累计1分钟积1分，上限6分。每日上限积12分。',
      active: true,
      disabled: false,
      type: TaskType.READ,
    },
    {
      title: '视听学习',
      currentScore: 0,
      dayMaxScore: 0,
      need: 0,
      status: false,
      tip: '每有效一个音频或观看一个视频积1分，上限6分。有效收听音频或观看视频累计1分钟积1分，上限6分。每日上限积12分。',
      active: true,
      disabled: false,
      type: TaskType.WATCH,
    },
    {
      title: '每日答题',
      currentScore: 0,
      dayMaxScore: 0,
      need: 0,
      status: false,
      tip: '每组答题每答对1道积1分。每日上限积5分。',
      active: true,
      disabled: false,
      type: TaskType.PRACTICE,
    },
  ]),
  isBlack: ref(false),
  todayScore: ref(0),
  totalScore: ref(0),
  maxRead: ref(80),
  maxWatch: ref(100),
  message: ref(''),
  pushToken: ref(''),
  userInfo: ref(null),
  notify,
};

export default store;
