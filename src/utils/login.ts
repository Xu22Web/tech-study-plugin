import {
  generateQRCode,
  getSign,
  loginWithQRCode,
  secureCheck,
} from '../api/login';
import API_CONFIG from '../config/api';
import { log } from './log';

/**
 * @description 生成二维码
 */
async function getQRCode() {
  log('正在生成登录二维码...');
  const qrCode = await generateQRCode();
  if (qrCode) {
    log('生成登录二维码成功!');
    // 链接
    const url = `https://login.xuexi.cn/login/qrcommit?showmenu=false&code=${qrCode}&appId=dingoankubyrfkttorhpou`;
    return {
      code: qrCode,
      src: `${API_CONFIG.qrcode}?data=${encodeURIComponent(url)}`,
      url,
    };
  }
  log('生成登录二维码失败!');
}

/**
 * @description 验证登录二维码
 * @param code
 * @returns
 */
async function checkQRCode(
  code: string,
  options: { timer: number; count: number }
): Promise<
  | { status: 'success'; data: string }
  | { status: 'revoked' }
  | { status: 'timeout' }
> {
  log('尝试用二维码登录...');
  // 请求次数
  options.count--;
  // 二维码登录
  const res = await loginWithQRCode(code);
  if (res) {
    const { data, code, success } = res;
    // 临时登录验证码
    if (success && data) {
      return { data, status: 'success' };
    }
    // 二维码失效
    if (code === '11019') {
      return { status: 'revoked' };
    }
  }
  return new Promise((resolve) => {
    // 清除之前的定时器
    clearTimeout(options.timer);
    // 最大登录次数
    if (!options.count) {
      resolve({ status: 'timeout' });
      return;
    }
    // 设置取消定时
    options.timer = setTimeout(() => {
      resolve(checkQRCode(code, options));
    }, 1000);
  });
}

/**
 * @description 尝试二维码登录
 */
async function tryLogin(checkCode: string) {
  log('正在获取签名...');
  // 获取签名
  const sign = await getSign();
  if (sign) {
    // 生成uuid
    const uuid = crypto.randomUUID();
    const [, code] = checkCode.split('=');
    const state = `${sign}${uuid}`;
    // 安全检查
    const res = await secureCheck({ code, state });
    return res;
  }
  return false;
}

export { checkQRCode, getQRCode, tryLogin };
