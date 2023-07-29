import { log } from '../utils/log';
import { debounce } from '../utils/utils';

chrome.runtime.onInstalled.addListener(() => {
  log('安装成功!');
});
// 窗口单例
let win: chrome.windows.Window | null = null;
// 清除窗口
chrome.windows.onRemoved.addListener((winId) => {
  if (win?.id === winId) {
    win = null;
    return;
  }
});
// 监听点击
chrome.action.onClicked.addListener(
  debounce(async () => {
    if (win?.id) {
      // 窗口显示
      await chrome.windows.update(win.id, {
        focused: true,
        drawAttention: true,
      });
      return;
    }
    // 创建窗口
    win = await chrome.windows.create({
      type: 'popup',
      width: 250,
      height: 700,
      url: '/dist/popup/index.html',
      focused: true,
    });
    if (!win.tabs) {
      return;
    }
    // 设置标签页状态
    await chrome.tabs.update(win.tabs[0].id!, {
      active: true,
      autoDiscardable: false,
    });
  }, 300)
);
