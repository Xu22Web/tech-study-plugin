import Protocal from 'devtools-protocol';

/**
 * @description 鼠标事件初始化
 */
interface MouseEventInit extends Protocal.Input.DispatchMouseEventRequest {}

/**
 * @description 鼠标自定义事件初始化
 */
interface MouseCustomizedEventInit extends Omit<MouseEventInit, 'type'> {}

/**
 * @description 鼠标点击事件初始化
 */
interface MouseClickEventInit extends MouseCustomizedEventInit {}

/**
 * @description 鼠标滚轮事件初始化
 */
interface MouseWheelEventInit extends MouseCustomizedEventInit {
  direction: 'up' | 'down';
}

/**
 * @description 鼠标移动事件初始化
 */
interface MouseMoveEventInit extends MouseCustomizedEventInit {}

/**
 * @description 鼠标事件
 * @param tabId
 * @param init
 */
async function dispatchMouseEvent(tabId: number, init: MouseEventInit) {
  // 鼠标事件
  await chrome.debugger.sendCommand(
    { tabId },
    'Input.dispatchMouseEvent',
    init
  );
}

/**
 * @description 鼠标点击事件
 * @param tabId
 * @param init
 */
async function dispatchMouseClickEvent(
  tabId: number,
  init: MouseClickEventInit
) {
  // 鼠标点击
  await dispatchMouseEvent(tabId, {
    type: 'mousePressed',
    ...init,
  });
  // 鼠标释放
  await dispatchMouseEvent(tabId, {
    type: 'mouseReleased',
    ...init,
  });
}

/**
 * @description 鼠标滚动事件
 * @param tabId
 * @param init
 */
async function dispatchMouseWheelEvent(
  tabId: number,
  init: MouseWheelEventInit
) {
  // 鼠标向下滚动
  if (init.direction === 'up') {
    await dispatchMouseEvent(tabId, {
      type: 'mouseWheel',
      deltaX: -0,
      deltaY: -100,
      ...init,
    });
    return;
  }
  // 鼠标向上滚动
  if (init.direction === 'down') {
    await dispatchMouseEvent(tabId, {
      type: 'mouseWheel',
      deltaX: -0,
      deltaY: 100,
      ...init,
    });
    return;
  }
}

/**
 * @description 鼠标滑动事件
 * @param tabId
 * @param init
 */
async function dispatchMouseSlideEvent(
  tabId: number,
  inits: MouseCustomizedEventInit[]
) {
  // 鼠标按下
  await dispatchMouseEvent(tabId, {
    type: 'mousePressed',
    ...inits[0],
  });
  // 鼠标移动
  for (const init of inits) {
    await dispatchMouseEvent(tabId, { type: 'mouseMoved', ...init });
  }
  // 鼠标释放
  await dispatchMouseEvent(tabId, {
    type: 'mouseReleased',
    ...inits[inits.length - 1],
  });
}

/**
 * @description 鼠标滑动事件
 * @param tabId
 * @param init
 */
async function dispatchMouseMoveEvent(tabId: number, init: MouseMoveEventInit) {
  // 鼠标移动
  await dispatchMouseEvent(tabId, {
    type: 'mouseMoved',
    ...init,
  });
}

/**
 * @description 键盘事件初始化
 */
interface KeyEventInit extends Protocal.Input.DispatchKeyEventRequest {}

/**
 * @description 键盘自定义事件初始化
 */
interface KeyCustomizedEventInit extends Omit<KeyEventInit, 'type'> {}

/**
 * @description 键盘点击事件初始化
 */
interface KeyPressEventInit extends KeyCustomizedEventInit {}

/**
 * @description 键盘输入事件初始化
 */
interface KeyInputEventInit extends KeyCustomizedEventInit {}

/**
 * @description 键盘事件初始化
 * @param tabId
 * @param init
 */
async function dispatchKeyEvent(tabId: number, init: KeyEventInit) {
  // 键盘事件
  await chrome.debugger.sendCommand({ tabId }, 'Input.dispatchKeyEvent', init);
}

/**
 * @description 键盘点击事件初始化
 * @param tabId
 * @param init
 */
async function dispatchKeyPressEvent(tabId: number, init: KeyPressEventInit) {
  // 键盘事件
  await dispatchKeyEvent(tabId, {
    type: 'keyDown',
    ...init,
  });
  await dispatchKeyEvent(tabId, {
    type: 'keyUp',
    ...init,
  });
}

/**
 * @description 键盘点击事件初始化
 * @param tabId
 * @param init
 */
async function dispatchKeyInputEvent(
  tabId: number,
  inits: KeyInputEventInit[]
) {
  for (const init of inits) {
    // 键盘事件
    await dispatchKeyEvent(tabId, {
      type: 'char',
      ...init,
    });
  }
}

/**
 * @description 触摸事件初始化
 */
interface TouchEventInit extends Protocal.Input.DispatchTouchEventRequest {}

/**
 * @description 触摸自定义事件初始化
 */
interface TouchCustomizedEventInit extends Omit<TouchEventInit, 'type'> {}

/**
 * @description 触摸点击事件初始化
 */
interface TouchTapEventInit extends TouchCustomizedEventInit {}

/**
 * @description 触摸滑动事件初始化
 */
interface TouchSlideEventInit extends TouchCustomizedEventInit {}

/**
 * @description 触摸事件
 * @param tabId
 * @param init
 */
async function dispatchTouchEvent(tabId: number, init: TouchEventInit) {
  // 键盘事件
  await chrome.debugger.sendCommand(
    { tabId },
    'Input.dispatchTouchEvent',
    init
  );
}

/**
 * @description 触摸点击事件
 * @param tabId
 * @param init
 */
async function dispatchTouchTapEvent(tabId: number, init: TouchTapEventInit) {
  // 触摸开始
  await dispatchTouchEvent(tabId, {
    type: 'touchStart',
    ...init,
  });
  // 触摸结束
  await dispatchTouchEvent(tabId, {
    type: 'touchEnd',
    ...init,
  });
}

/**
 * @description 触摸滑动事件
 * @param tabId
 * @param init
 */
async function dispatchTouchSlideEvent(
  tabId: number,
  inits: TouchSlideEventInit[]
) {
  // 触摸开始
  await dispatchTouchEvent(tabId, {
    type: 'touchStart',
    ...inits[0],
  });
  // 触摸移动
  for (const init of inits) {
    await dispatchTouchEvent(tabId, { type: 'touchMove', ...init });
  }
  // 触摸结束
  await dispatchTouchEvent(tabId, {
    type: 'touchEnd',
    ...inits[inits.length - 1],
  });
}

/**
 * @description 创建事件派发
 * @param tabId
 * @returns
 */
function createDispatchEvent(tabId: number) {
  return {
    dispatchKeyEvent(init: KeyEventInit) {
      return dispatchKeyEvent(tabId, init);
    },
    dispatchKeyPressEvent(init: KeyPressEventInit) {
      return dispatchKeyPressEvent(tabId, init);
    },
    dispatchKeyInputEvent(inits: KeyInputEventInit[]) {
      return dispatchKeyInputEvent(tabId, inits);
    },
    dispatchMouseClickEvent(init: MouseClickEventInit) {
      return dispatchMouseClickEvent(tabId, init);
    },
    dispatchMouseEvent(init: MouseEventInit) {
      return dispatchMouseEvent(tabId, init);
    },
    dispatchMouseMoveEvent(init: MouseEventInit) {
      return dispatchMouseMoveEvent(tabId, init);
    },
    dispatchMouseWheelEvent(init: MouseWheelEventInit) {
      return dispatchMouseWheelEvent(tabId, init);
    },
    dispatchMouseSlideEvent(inits: MouseCustomizedEventInit[]) {
      return dispatchMouseSlideEvent(tabId, inits);
    },
    dispatchTouchSlideEvent(inits: TouchSlideEventInit[]) {
      return dispatchTouchSlideEvent(tabId, inits);
    },
    dispatchTouchTapEvent(init: TouchTapEventInit) {
      return dispatchTouchTapEvent(tabId, init);
    },
    dispatchTouchEvent(init: TouchEventInit) {
      return dispatchTouchEvent(tabId, init);
    },
  };
}

export {
  createDispatchEvent,
  dispatchKeyEvent,
  dispatchKeyInputEvent,
  dispatchKeyPressEvent,
  dispatchMouseClickEvent,
  dispatchMouseEvent,
  dispatchMouseMoveEvent,
  dispatchMouseSlideEvent,
  dispatchMouseWheelEvent,
  dispatchTouchEvent,
  dispatchTouchSlideEvent,
  dispatchTouchTapEvent,
};
