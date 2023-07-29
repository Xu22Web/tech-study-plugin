/**
 * @description 设置cookie
 * @param name
 * @param value
 * @param expires
 */
function setCookie(
  name: string,
  value: string,
  expires: number,
  domain: string
) {
  // 当前日期
  const date = new Date();
  // 过期日期
  date.setTime(date.getTime() + expires);
  // 设置cookie
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;domain=${domain}`;
}

/**
 * @description 获取cookie
 * @param name
 * @returns
 */
function getCookie(name: string) {
  // 获取当前所有cookie
  const strCookies = document.cookie;
  // 截取变成cookie数组
  const cookieText = strCookies.split(';');
  // 循环每个cookie
  for (const i in cookieText) {
    // 将cookie截取成两部分
    const item = cookieText[i].split('=');
    // 判断cookie的name 是否相等
    if (item[0].trim() === name) {
      return item[1].trim();
    }
  }
  return null;
}

/**
 * @description 删除cookie
 * @param name
 */
function delCookie(name: string, domain: string) {
  // 存在cookie
  const value = getCookie(name);
  if (value !== null) {
    setCookie(name, '', -1, domain);
  }
}

export { setCookie, getCookie, delCookie };
