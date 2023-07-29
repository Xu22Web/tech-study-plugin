import { ReadAndWatch } from '../../enum';
import { $$, $_ } from '../../utils/element';
import { log } from '../../utils/log';
import { onMessage, sendMessage } from '../../utils/message';
import { installMouseHelper } from '../../utils/tools';

log('文章选读、视听学习 脚本注入成功');

/**
 * @description 初始化监听
 */
function initListener() {
  // 加载状态
  onMessage('load', () => {
    sendMessage('load', { data: true, type: 'runtime' });
  });
  onMessage<{ type: ReadAndWatch; max: number }>(
    'getData',
    async ({ type, max }) => {
      // 文章选读
      if (type === ReadAndWatch.READ) {
        // 章节
        const section = (
          await $_<HTMLElement>('.main-view > section', undefined, 5000)
        )[0];
        // 检测页面显示
        if (!section || section.innerText.includes('系统正在维护中')) {
          sendMessage('getData', {
            type: 'runtime',
            data: null,
          });
          // 提示
          log('未找到文章!');
          return;
        }
        // 最大字数
        const maxTextCount = Math.max(section.innerText.length, 200);
        // 预计时间
        const predictTime = (60 * maxTextCount) / 1000;
        // min(predictTime,  max) 秒后关闭页面
        const duration = ~~(
          Math.min(predictTime, max) +
          Math.random() * 10 -
          5
        );
        // body宽高
        const { offsetHeight: height, offsetWidth: width } = $$('body')[0];
        // 视口宽高
        const { innerHeight, innerWidth } = window;
        sendMessage('getData', {
          type: 'runtime',
          data: {
            duration,
            height,
            width,
            innerWidth,
            innerHeight,
          },
        });
        return;
      }
      // 视听学习
      if (type === ReadAndWatch.WATCH) {
        // 视频元素
        const video = (
          await $_<HTMLVideoElement>('video', undefined, 10000)
        )[0];
        // 播放按键
        const playBtn = (
          await $_<HTMLButtonElement>('.prism-play-btn', undefined, 5000)
        )[0];
        if (!video || !playBtn) {
          // 发送数据
          sendMessage('getData', {
            type: 'runtime',
            data: null,
          });
          return;
        }
        // 设置静音
        onMessage<boolean>('muted', (muted) => {
          video.muted = muted;
        });
        log('等待视频加载...');
        // 播放超时
        const timeout = setTimeout(() => {
          log('视频加载超时!');
          // 发送数据
          sendMessage('getData', { type: 'runtime', data: null });
        }, 10000);
        // 能播放
        video.addEventListener('canplay', async () => {
          // 清除倒计时
          clearTimeout(timeout);
          // body宽高
          const { offsetHeight: height, offsetWidth: width } = $$('body')[0];
          // 视口宽高
          const { innerHeight, innerWidth } = window;
          // 预计时间
          const predictTime = video.duration;
          // min(predictTime,  max) 秒后关闭页面
          const duration = ~~(
            Math.min(predictTime, max) +
            Math.random() * 10 -
            5
          );
          // 播放状态
          let play = false;
          // 监听视频播放
          video.addEventListener('playing', () => {
            play = true;
            log('视频播放中...');
          });
          // 监听视频播放
          onMessage('play', () => {
            // 播放状态
            sendMessage('play', { type: 'runtime', data: play });
            // 定时器
            const timer = setInterval(() => {
              if (play) {
                clearInterval(timer);
                // 设置暂停
                onMessage<boolean>('pause', (pause) => {
                  pause ? video.pause() : video.play();
                });
                return;
              }
              // 播放视频
              video.play();
            }, 1000);
          });
          // 发送数据
          sendMessage('getData', {
            type: 'runtime',
            data: {
              duration,
              height,
              width,
              innerWidth,
              innerHeight,
            },
          });
        });
        return;
      }
    }
  );
}

window.addEventListener('load', async () => {
  // 初始化监听
  initListener();
  // 显示鼠标轨迹
  installMouseHelper();
  // 页面关闭
  window.addEventListener('beforeunload', () => {
    sendMessage('unload', { type: 'runtime', data: null });
  });
});
