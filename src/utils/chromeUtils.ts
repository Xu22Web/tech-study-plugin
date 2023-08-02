/**
 * @description 通知
 * @param message
 * @returns
 */
async function notification(
  message: string,
  options?: Omit<
    chrome.notifications.NotificationOptions<true>,
    'iconUrl' | 'title' | 'message'
  >
) {
  return await chrome.notifications.create({
    iconUrl: '../assets/icon.jpg',
    title: '提示',
    type: 'basic',
    message,
    ...options,
  });
}

/**
 * @description 标签页移除
 * @param tabId
 * @param callback
 * @param options
 */
function onTabRemoved(
  tabId: number,
  callback: (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => void,
  options?: {
    once: boolean;
  }
) {
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
}

/**
 * @description 校验支持
 * @param permission
 * @returns
 */
const checkPermissiomSupport = (permission: keyof typeof chrome) => {
  // 支持
  const isSupport = !!chrome[permission];
  return isSupport;
};

export { checkPermissiomSupport, notification, onTabRemoved };
