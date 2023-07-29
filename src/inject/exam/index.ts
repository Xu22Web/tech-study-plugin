import { $$ } from '../../utils/element';
import {
  getNext,
  getQuestionBody,
  getQuestionPage,
  getSlideVerifyStatus,
  getType,
  handleBlanks,
  handleMutiplyChoices,
  handleSingleChoice,
} from '../../utils/exam';
import { log } from '../../utils/log';
import { onMessage, sendMessage } from '../../utils/message';
import { installMouseHelper } from '../../utils/tools';
import { debounce } from '../../utils/utils';

log('答题 脚本注入成功');

// 初始化监听
const initListener = () => {
  // 加载状态
  onMessage('load', () => {
    // 题目加载状态
    const load = !!getQuestionBody();
    if (load) {
      // 清除默认样式
      const header = $$(
        '#app > div > div.layout-body > div > div.header-row'
      )[0];
      const body = $$(
        '#app > div > div.layout-body > div > div.detail-body'
      )[0];
      header.style.width = 'auto';
      header.style.margin = '0';
      body.style.width = 'auto';
    }
    sendMessage('load', { data: load, type: 'runtime' });
  });
  onMessage('wheel', () => {
    // 处理鼠标滚动
    const handleWheel = debounce(() => {
      clearTimeout(timer);
      sendMessage('wheel', {
        type: 'runtime',
      });
    }, 300);
    // 是否滚动
    let status = false;
    window.addEventListener('wheel', () => {
      status = true;
      handleWheel();
    });
    // 超时
    const timer = setTimeout(() => {
      if (!status) {
        sendMessage('wheel', {
          type: 'runtime',
        });
        return;
      }
    }, 3000);
  });
  onMessage('questionData', () => {
    // 题目类型
    const type = getType();
    // 当前题号 总题数
    const { current, total } = getQuestionPage();
    sendMessage('questionData', {
      type: 'runtime',
      data: {
        type,
        total,
        current,
      },
    });
  });
  onMessage('next', async () => {
    // 下一步
    const next = await getNext();
    sendMessage('next', {
      type: 'runtime',
      data: next,
    });
  });
  onMessage('answers', async () => {
    // 题型
    const type = getType();
    if (type === '单选题') {
      // 选项索引
      const indexs = await handleSingleChoice();
      sendMessage('answers', { type: 'runtime', data: indexs });
      return;
    }
    if (type === '多选题') {
      // 选项索引
      const indexs = await handleMutiplyChoices();
      sendMessage('answers', { type: 'runtime', data: indexs });
      return;
    }
    if (type === '填空题') {
      // 选项索引
      const answers = await handleBlanks();
      sendMessage('answers', { type: 'runtime', data: answers });
      return;
    }
  });
  onMessage('slideVerify', async () => {
    // 滑动验证
    const status = await getSlideVerifyStatus();
    sendMessage('slideVerify', {
      type: 'runtime',
      data: status,
    });
  });
};

window.addEventListener('load', () => {
  // 初始化监听
  initListener();
  // 显示鼠标轨迹
  installMouseHelper();
  // 页面关闭
  window.addEventListener('beforeunload', () => {
    sendMessage('unload', { type: 'runtime', data: null });
  });
});
