import {
  getTaskList,
  getTodayScore,
  getTotalScore,
  getUserInfo,
} from '../../api/user';
import { TaskType } from '../../enum';
import { delCookie } from '../../utils/cookie';
import { error, log } from '../../utils/log';
import { checkQRCode, getQRCode, tryLogin } from '../../utils/login';
import { onMessage, sendMessage } from '../../utils/message';
import { getNews, getVideos } from '../../utils/readAndWatch';
import { initLogo } from '../../utils/utils';

log('主页 脚本注入成功');

// 初始化logo
initLogo();

/**
 * @description 初始化连接
 */
function initConnectionListener() {
  // 定时器
  const timer = setInterval(async () => {
    log('尝试连接扩展...');
    try {
      // 初始化连接
      await sendMessage('connect', { data: null, type: 'runtime' });
    } catch (e) {
      error('无法连接扩展!');
    }
  }, 1000);
  // 连接成功
  onMessage('connecting', async () => {
    log('获取连接成功!');
    clearInterval(timer);
    // 建立连接
    await sendMessage('connected', { data: null, type: 'runtime' });
    // 页面卸载
    window.addEventListener('beforeunload', () => {
      // 断开连接
      sendMessage('disconnect', {
        data: null,
        type: 'runtime',
      });
    });
    // 设置用户数据监听
    initUserDataListener();
    // 设置登录监听
    initLoginListener();
  });
  // 连接被占用
  onMessage('occupied', () => {
    log('连接被占用!');
    clearInterval(timer);
  });
}

/**
 * @description 初始化用户数据
 */
function initUserDataListener() {
  // 用户信息
  onMessage('getUserInfo', async () => {
    log('获取用户信息...');
    const res = await getUserInfo();
    sendMessage('getUserInfo', { data: res, type: 'runtime' });
    return;
  });
  // 当天分数
  onMessage('getTodayScore', async () => {
    log('获取当天分数...');
    const res = await getTodayScore();
    sendMessage('getTodayScore', { data: res, type: 'runtime' });
    return;
  });
  // 当前总分
  onMessage('getTotalScore', async () => {
    log('获取总分...');
    const res = await getTotalScore();
    sendMessage('getTotalScore', { data: res, type: 'runtime' });
    return;
  });
  // 任务进度
  onMessage('getTaskProgress', async () => {
    log('获取任务进度...');
    const data = await getTaskList();
    if (data) {
      // 数据
      const { taskProgress, inBlackList } = data;
      // 任务
      const tasks:
        | {
            currentScore: number;
            dayMaxScore: number;
            need: number;
            status: boolean;
          }[] = [];
      // 登录
      tasks[TaskType.LOGIN] = {
        currentScore: taskProgress[2].currentScore,
        dayMaxScore: taskProgress[2].dayMaxScore,
        need: 0,
        status: false,
      };
      // 文章选读
      tasks[TaskType.READ] = {
        currentScore: taskProgress[0].currentScore,
        dayMaxScore: taskProgress[0].dayMaxScore,
        need: 0,
        status: false,
      };
      // 视听学习
      tasks[TaskType.WATCH] = {
        currentScore: taskProgress[1].currentScore,
        dayMaxScore: taskProgress[1].dayMaxScore,
        need: 0,
        status: false,
      };
      // 每日答题
      tasks[TaskType.PRACTICE] = {
        currentScore: taskProgress[3].currentScore,
        dayMaxScore: taskProgress[3].dayMaxScore,
        need: 0,
        status: false,
      };
      // 更新数据
      for (const i in tasks) {
        // 分数状况
        const { currentScore, dayMaxScore } = tasks[i];
        // 进度
        const rate = Number(((100 * currentScore) / dayMaxScore).toFixed(1));
        // 完成状态
        tasks[i].status = rate === 100;
        // 需要完成数
        tasks[i].need = dayMaxScore - currentScore;
      }
      sendMessage('getTaskProgress', {
        data: { taskProgress: tasks, inBlackList },
        type: 'runtime',
      });
    }
    sendMessage('getTaskProgress', {
      data: undefined,
      type: 'runtime',
    });
  });
  // 文章
  onMessage<number>('getNews', async (need) => {
    const news = await getNews(need);
    sendMessage('getNews', {
      data: news,
      type: 'runtime',
    });
  });
  // 视频
  onMessage<number>('getVideos', async (need) => {
    const videos = await getVideos(need);
    sendMessage('getVideos', {
      data: videos,
      type: 'runtime',
    });
  });
}

/**
 * @description 登录监听
 */
function initLoginListener() {
  // 取消状态
  const cancel = { timer: -1 };
  // 登录
  onMessage('login', async () => {
    // 取消之前的登录请求
    clearTimeout(cancel.timer);
    // 提示
    log('刷新登录二维码!');
    // 获取二维码
    const qrCode = await getQRCode();
    if (qrCode) {
      // 获取二维码
      const { src, code, url } = qrCode;
      // 发送二维码
      sendMessage('qrcode', { data: src, type: 'runtime' });
      // 获取验证码
      const checkCode = await checkQRCode(code, cancel);
      // 验证成功
      if (checkCode) {
        // 尝试登录
        const loginRes = await tryLogin(checkCode);
        if (loginRes) {
          // 提示
          log('登录成功!');
          // 登录成功
          sendMessage('loginSuccess', { data: null, type: 'runtime' });
          return;
        }
        // 提示
        log('登录失败!');
        // 登录成功
        sendMessage('loginFail', { data: null, type: 'runtime' });
        return;
      }
      // 提示
      log('登录二维码失效!');
      // 二维码失效刷新
      sendMessage('qrcodeRevoked', { data: src, type: 'runtime' });
    }
    return;
  });
  // 登出
  onMessage('logout', async () => {
    // 删除token
    delCookie('token', '.xuexi.cn');
    // 提示
    log('退出登录!');
  });
}

window.addEventListener('load', () => {
  // 初始化连接监听
  initConnectionListener();
});
