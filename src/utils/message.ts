/**
 * @description 发送消息
 * @param action
 * @param options
 */
async function sendMessage(
  action: string,
  options: { data?: any } & ({ type: 'tab'; id: number } | { type: 'runtime' })
) {
  const { data, type } = options;
  if (type === 'tab') {
    return await chrome.tabs.sendMessage(options.id, {
      data,
      action,
    });
  }
  if (type === 'runtime') {
    return await chrome.runtime.sendMessage({
      data,
      action,
    });
  }
}

/**
 * @description 接收消息
 * @param action
 * @param callback
 * @param options
 */
function onMessage<T>(
  action: string,
  callback: (
    data: T,
    sender: chrome.runtime.MessageSender,
    send: (response?: any) => void
  ) => void,
  options?: {
    once: boolean;
  }
) {
  // 配置
  const { once } = options || {};
  // 事件监听处理
  const handler = (
    message: { action: string; data: T },
    sender: chrome.runtime.MessageSender,
    send: (response?: any) => void
  ) => {
    const { action: actionType, data } = message;
    if (actionType && action === actionType) {
      callback(data, sender, send);
      once && cancel();
      return;
    }
  };
  // 取消监听
  const cancel = () => {
    chrome.runtime.onMessage.removeListener(handler);
  };
  // 创建监听
  chrome.runtime.onMessage.addListener(handler);
  // 移除监听
  return cancel;
}

/**
 * @description 创建监听器
 * @returns
 */
function createMessageListeners() {
  // 监听
  const listeners: {
    id: string;
    cancel: () => void;
    callback: (...args: any[]) => void;
    action: string;
  }[] = [];
  return {
    listeners,
    addListener<T>(
      action: string,
      callback: (
        data: T,
        sender: chrome.runtime.MessageSender,
        send: (response?: any) => void
      ) => void,
      options?: {
        once: boolean;
      }
    ) {
      // 生成id
      const id = Math.random().toString(16).substring(2);
      listeners.push({
        id,
        action,
        callback,
        cancel: onMessage(action, callback, options),
      });
    },
    removeAllListeners() {
      while (true) {
        // 监听
        const listener = listeners.pop();
        if (!listener) {
          break;
        }
        listener.cancel();
      }
    },
    removeListener(id: string) {
      const index = listeners.findIndex((l) => l.id === id);
      if (index !== -1) {
        // 取消监听
        listeners[index].cancel();
        // 删除监听
        listeners.splice(index, 1);
      }
    },
  };
}

/**
 * @description 获取消息数据
 * @param action
 * @param options
 * @returns
 */
function fetchMessageData<T>(
  action: string,
  options: { data?: any; timeout?: number } & (
    | { type: 'tab'; id: number }
    | { type: 'runtime' }
  )
) {
  return new Promise<T>(async (resolve, reject) => {
    // 超时定时器
    const timeoutTimer = setTimeout(() => {
      // 取消监听
      cancel();
      reject('请求超时!');
    }, options.timeout || 6000);
    // 设置监听
    const cancel = onMessage<T>(action, (res) => {
      clearTimeout(timeoutTimer);
      // 取消监听
      cancel();
      resolve(res);
    });
    try {
      // 发送消息
      await sendMessage(action, options);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * @description 等待消息数据
 * @param action
 * @returns
 */
function waitMessageData<T>(action: string, time?: number) {
  return new Promise<T>((resolve, reject) => {
    // 超时定时器
    const timeoutTimer = setTimeout(() => {
      // 取消监听
      cancel();
      reject('等待超时!');
    }, time || 6000);
    // 设置监听
    const cancel = onMessage<T>(action, (res) => {
      clearTimeout(timeoutTimer);
      // 取消监听
      cancel();
      resolve(res);
    });
  });
}

export {
  onMessage,
  sendMessage,
  fetchMessageData,
  waitMessageData,
  createMessageListeners,
};
