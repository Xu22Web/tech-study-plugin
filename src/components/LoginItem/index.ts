import useCurrentWindow from '../../hooks/useWindow';
import store from '../../store';
import { ref, watchEffectRef } from '../../utils/composition';
import { createElementNode, createTextNode } from '../../utils/element';
import { createMessageListeners, sendMessage } from '../../utils/message';
import { debounce } from '../../utils/utils';
import './index.less';

/**
 * @description 登录
 */
function LoginItem() {
  // 存储
  const { login, tabId } = store;
  // 二维码显示
  const loginQRCodeShow = ref(false);
  // 二维码
  const src = ref('');
  // 消息事件监听
  const { addListener, removeAllListeners } = createMessageListeners();
  return createElementNode(
    'div',
    undefined,
    {
      class: 'egg_login_item',
    },
    [
      // 登录按钮
      createElementNode(
        'button',
        undefined,
        {
          type: 'button',
          class: 'egg_login_btn',
          onclick: debounce(() => {
            // 获取用户信息
            sendMessage('login', {
              type: 'tab',
              id: tabId.value,
              data: null,
            });
          }, 300),
        },
        createTextNode(
          watchEffectRef(() =>
            loginQRCodeShow.value ? '刷新二维码' : '扫码登录'
          )
        )
      ),
      // 窗口
      createElementNode(
        'div',
        undefined,
        {
          class: watchEffectRef(
            () => `egg_login_img_wrap${loginQRCodeShow.value ? ' active' : ''}`
          ),
        },
        createElementNode('img', undefined, {
          class: 'egg_login_img',
          src,
        })
      ),
    ],
    {
      onMounted() {
        // 二维码生成
        addListener<string>('qrcode', async (res) => {
          // 获取当前窗口
          const win = await useCurrentWindow();
          // 设置窗口高度
          win.height.value = 810;
          src.value = res;
          loginQRCodeShow.value = true;
        });
        // 二维码失效
        addListener<string>('qrcodeRevoked', () => {
          // 获取用户信息
          sendMessage('login', {
            type: 'tab',
            id: tabId.value,
            data: null,
          });
        });
        // 登录成功
        addListener<string>('loginSuccess', async () => {
          // 关闭二维码
          loginQRCodeShow.value = false;
          src.value = '';
          // 登录成功
          login.value = true;
          // 获取当前窗口
          const win = await useCurrentWindow();
          // 设置窗口高度
          win.height.value = 700;
        });
        // 登录成功
        addListener<string>('loginFail', async () => {
          // 关闭二维码
          loginQRCodeShow.value = false;
          src.value = '';
          // 重置登录状态
          login.value = false;
          // 获取当前窗口
          const win = await useCurrentWindow();
          // 设置窗口高度
          win.height.value = 700;
        });
      },
      beforeDestroy() {
        // 清除所有监听
        removeAllListeners();
      },
    }
  );
}

export default LoginItem;
