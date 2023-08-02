import Protocol from 'devtools-protocol';
import PLUGIN_CONFIG from '../config/plugin';

/**
 * @description 防抖
 * @param callback
 * @param delay
 * @returns
 */
function debounce<T extends (...args: any) => any>(callback: T, delay: number) {
  let timer = -1;
  return function (this: any, ...args: Parameters<T>) {
    if (timer !== -1) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}

/**
 * @description 等待时间
 * @param time
 * @returns
 */
function sleep(time: number) {
  // 延时
  let timeDelay = Number(time);
  if (!Number.isInteger(timeDelay)) {
    timeDelay = 1000;
  }
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeDelay);
  });
}

/**
 * @description 倒计时
 * @param duration
 * @param callback
 * @returns
 */
function createCountDown(
  duration: number = 0,
  callback?: (count: number) => void
) {
  // 总时长
  let count = duration;
  // 定时器
  let timer = -1;
  // 撤销状态
  let revoked = false;
  return {
    wait() {
      return new Promise((resolve) => {
        // 定时器
        timer = setInterval(async () => {
          // 撤销定时
          if (revoked) {
            // 清除定时器
            clearInterval(timer);
            resolve(undefined);
            return;
          }
          // 设置回调
          callback && (await callback(count));
          if (count <= 0) {
            // 清除定时器
            clearInterval(timer);
            resolve(undefined);
            return;
          }
          count--;
        }, 1000);
      });
    },
    cancel() {
      if (count <= 0) {
        return;
      }
      revoked = true;
    },
  };
}

/**
 * @description 等待条件成立
 * @param callback
 * @param timeout
 * @returns
 */
function waitCondition(
  callback: () => Promise<boolean> | boolean,
  timeout?: number
) {
  return new Promise<boolean>((resolve) => {
    // 定时器
    const timer = setInterval(async () => {
      const res = await callback();
      if (res) {
        timeout && clearTimeout(timeoutTimer);
        clearInterval(timer);
        resolve(true);
      }
    }, 500);
    // 不存在超时
    if (!timeout) {
      return;
    }
    // 超时
    const timeoutTimer = setTimeout(() => {
      clearInterval(timer);
      resolve(false);
    }, timeout);
  });
}

/**
 * @description 盒子模型转换为范围
 * @param model
 * @returns
 */
function boxModelToBounds(model: Protocol.DOM.BoxModel) {
  return {
    x: model.border[0],
    y: model.border[1],
    width: model.width,
    height: model.height,
  };
}

/**
 * @description 初始化logo
 */
function initLogo() {
  console.log(
    `%c ${PLUGIN_CONFIG.name} %c v${PLUGIN_CONFIG.version} `,
    'background:dodgerblue;color:white;font-size:15px;border-radius:4px 0 0 4px;padding:2px 0;',
    'background:black;color:gold;font-size:15px;border-radius:0 4px 4px 0;padding:2px 0;'
  );
}

export {
  boxModelToBounds,
  createCountDown,
  debounce,
  initLogo,
  sleep,
  waitCondition,
};
