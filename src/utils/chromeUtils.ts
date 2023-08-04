import { debounce } from './utils';

/**
 * @description 通知
 * @param message
 * @returns
 */
const notification = (
  message: string,
  options?: Omit<
    chrome.notifications.NotificationOptions<true>,
    'iconUrl' | 'title' | 'message' | 'type'
  >
) => {
  return chrome.notifications.create({
    iconUrl: '../assets/icon.jpg',
    title: '提示',
    type: 'basic',
    message,
    ...options,
  });
};

interface NotifyOptions {
  id?: string | number;
  title: string;
  message: string;
}

/**
 * @description 创建通知
 * @returns
 */
const createNotification = () => {
  // 消息列表
  let list: NotifyOptions[] = [];
  // 处理消息
  const handler = debounce(() => {
    // 消息
    const messageList = list;
    // 通知
    chrome.notifications.create({
      iconUrl: '../assets/icon.jpg',
      title: '提示',
      message: '',
      items: messageList.map(({ message, title }) => ({ message, title })),
      type: 'list',
    });
    list = [];
  }, 500);
  return {
    notify(options: NotifyOptions) {
      if (options.id !== undefined) {
        // 存在相同 id 消息
        const index = list.findIndex(
          (i) => i.id !== undefined && i.id === options.id
        );
        if (index + 1) {
          list.splice(index, 1);
        }
      }
      list.push(options);
      handler();
    },
  };
};

/**
 * @description 标签页移除
 * @param tabId
 * @param callback
 * @param options
 */
const onTabRemoved = (
  tabId: number,
  callback: (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => void,
  options?: {
    once: boolean;
  }
) => {
  // 配置
  const { once } = options || {};
  // 事件监听处理
  const handler = (id: number, removeInfo: chrome.tabs.TabRemoveInfo) => {
    if (tabId === id) {
      callback(id, removeInfo);
      once && cancel();
      return;
    }
  };
  // 取消监听
  const cancel = () => {
    chrome.tabs.onRemoved.removeListener(handler);
  };
  // 创建监听
  chrome.tabs.onRemoved.addListener(handler);
  // 移除监听
  return cancel;
};

/**
 * @description 校验支持
 * @param permission
 * @returns
 */
const checkPermissiomSupport = (permission: keyof typeof chrome) => {
  // 支持
  const isSupport = permission in chrome;
  return isSupport;
};

export {
  checkPermissiomSupport,
  createNotification,
  notification,
  onTabRemoved,
};

export type { NotifyOptions };
