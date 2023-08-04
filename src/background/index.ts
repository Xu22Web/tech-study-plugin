import { checkPermissiomSupport, notification } from '../utils/chromeUtils';
import { error, log } from '../utils/log';
import { debounce } from '../utils/utils';

// 窗口单例
let winId: number | null = null;

/**
 * @description 检验权限
 */
const checkAllPermissions = () => {
  // 所有权限
  const permisstions: (keyof typeof chrome)[] = [
    'storage',
    'scripting',
    'notifications',
    'cookies',
    'debugger',
    'contextMenus',
  ];
  permisstions.filter((permission) => {
    // 是否支持
    const isSupport = checkPermissiomSupport(permission);
    if (!isSupport) {
      // 提示
      error(`权限: ${permission} 不支持!`);
      // 通知
      notification(`权限: ${permission} 不支持!`);
    }
    return isSupport;
  });
};

/**
 * @description 打开面板
 * @returns
 */
const openPanel = async () => {
  if (!checkPermissiomSupport('windows')) {
    return;
  }
  if (!checkPermissiomSupport('tabs')) {
    return;
  }
  if (winId === null) {
    // 链接
    const url = chrome.runtime.getURL('/dist/popup/index.html');
    // 标签
    const [tab] = await chrome.tabs.query({
      url,
    });
    console.log('url', url, tab);
    if (tab) {
      log('已存在任务面板!');
      winId = tab.windowId;
    }
  }
  if (winId !== null) {
    // 窗口显示
    await chrome.windows.update(winId, {
      focused: true,
      drawAttention: true,
    });
    return;
  }
  // 创建窗口
  const win = await chrome.windows.create({
    type: 'popup',
    width: 250,
    height: 700,
    url: '/dist/popup/index.html',
    focused: true,
  });
  winId = win.id!;
  if (!win.tabs) {
    return;
  }
  // 设置标签页状态
  await chrome.tabs.update(win.tabs[0].id!, {
    active: true,
    autoDiscardable: false,
  });
};

/**
 * @description 清除panel
 * @param winId
 * @returns
 */
const clearPanel = (id: number) => {
  if (winId === null || id !== winId) {
    return;
  }
  log('关闭面板');
  // 清除id
  winId = null;
};

/**
 * @description 添加菜单
 * @returns
 */
const createContextMenu = () => {
  // 权限校验
  if (!checkPermissiomSupport('contextMenus')) {
    return;
  }
  // 菜单 id
  const id = 'taskPanel';
  chrome.contextMenus.create({
    title: '任务面板',
    id,
  });
  // 匹配链接
  const matchURL = ['https://www.xuexi.cn/', 'https://www.xuexi.cn/index.html'];
  chrome.contextMenus.onClicked.addListener((info) => {
    // 菜单项信息
    const { menuItemId, pageUrl } = info;
    if (menuItemId === id && matchURL.includes(pageUrl)) {
      // 打开面板
      openPanel();
      return;
    }
  });
};

// 安装
chrome.runtime.onInstalled.addListener(() => {
  log('安装成功!');
  // 权限检测
  checkAllPermissions();
  // 创建菜单
  createContextMenu();
});

// 清除窗口
chrome.windows.onRemoved.addListener(clearPanel);

// 监听点击
chrome.action.onClicked.addListener(debounce(openPanel, 300));
