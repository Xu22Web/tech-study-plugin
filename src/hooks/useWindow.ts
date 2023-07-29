import { ref, watch } from '../utils/composition';

async function useCurrentWindow() {
  // 获取当前窗口
  const win = await chrome.windows.getCurrent();
  // 窗口id
  const id = win.id!;
  // 高
  const height = ref(win.height!);
  // 宽
  const width = ref(win.width!);
  // 左边距
  const left = ref(win.left!);
  // 上边距
  const top = ref(win.top!);
  // 聚焦
  const focused = ref(win.focused!);
  // 状态
  const state = ref(win.state!);
  watch(height, () => {
    chrome.windows.update(id, { height: height.value });
  });
  watch(width, () => {
    chrome.windows.update(id, { width: width.value });
  });
  watch(left, () => {
    chrome.windows.update(id, {
      left: left.value,
    });
  });
  watch(top, () => {
    chrome.windows.update(id, {
      top: top.value,
    });
  });
  watch(focused, () => {
    chrome.windows.update(id, {
      focused: focused.value,
    });
  });
  watch(state, () => {
    chrome.windows.update(id, {
      state: state.value,
    });
  });
  return {
    height,
    width,
    left,
    top,
    focused,
    state,
  };
}

export default useCurrentWindow;
