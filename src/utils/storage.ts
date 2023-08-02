/**
 * @description 创建存储
 * @returns
 */
const createStorage = () => {
  return chrome.storage.local;
};

/**
 * @description 保存数据
 * @param name
 * @param value
 * @returns
 */
const setValue = (name: string, value: any) => {
  // 格式化值
  const formattedValue =
    typeof value === 'object' ? JSON.parse(JSON.stringify(value)) : value;
  return createStorage().set({ [name]: formattedValue });
};

/**
 * @description 保存数据
 * @param name
 * @param value
 * @returns
 */
const setValues = (value: object) => {
  // 格式化值
  const formattedValue = Object.fromEntries(
    Object.entries(value).map(([key, value]) => [
      key,
      typeof value === 'object' ? JSON.parse(JSON.stringify(value)) : value,
    ])
  );
  return createStorage().set(formattedValue);
};

/**
 * @description 删除数据
 * @param name
 * @returns
 */
const removeValue = (name: string | string[]) => {
  return createStorage().remove(name);
};

/**
 * @description 获取数据
 * @param name
 * @returns
 */
const getValue = async <T = any>(name: string): Promise<T | undefined> => {
  const data = await createStorage().get(name);
  return data[name];
};

/**
 * @description 获取数据
 * @param name
 * @returns
 */
const getValues = (name: string[]) => {
  return createStorage().get(name);
};

/**
 * @description 清除本地缓存
 * @returns
 */
const removeAllValues = () => {
  return createStorage().clear();
};

/**
 * @description 监听数据
 * @param name
 * @param callback
 * @param options
 * @returns
 */
const addValueListener = <T = any>(
  name: string,
  callback: (newValue: T | undefined, oldValue: T | undefined) => void,
  options?: { once: boolean }
) => {
  // 配置
  const { once } = options || {};
  const storage = createStorage();
  // 取消
  let cancelled = false;
  // 处理
  const handler = (changes) => {
    if (name in changes) {
      const { newValue, oldValue } = changes[name];
      callback(newValue, oldValue);
      once && cancel();
    }
  };
  // 取消
  const cancel = () => {
    // 已取消
    if (cancelled) {
      return;
    }
    cancelled = true;
    storage.onChanged.removeListener(handler);
  };
  storage.onChanged.addListener(handler);
  return cancel;
};

export {
  addValueListener,
  getValue,
  getValues,
  removeAllValues,
  removeValue,
  setValue,
  setValues,
};
