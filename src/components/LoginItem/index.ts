import { SettingType } from '../../enum';
import useCurrentWindow from '../../hooks/useWindow';
import store from '../../store';
import { notification } from '../../utils/chromeUtils';
import { ref, watchEffectRef } from '../../utils/composition';
import { createElementNode, createTextNode } from '../../utils/element';
import { createMessageListeners, sendMessage } from '../../utils/message';
import { createAHTML, createImgHTML, pushModal } from '../../utils/push';
import { debounce } from '../../utils/utils';
import './index.less';

/**
 * @description 登录
 */
function LoginItem() {
  // 存储
  const { login, tabId, settings, pushToken } = store;
  // 二维码显示
  const loginQRCodeShow = ref(false);
  // 二维码
  const qrCodeSrc = ref('');
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
          src: qrCodeSrc,
        })
      ),
    ],
    {
      onMounted() {
        // 二维码生成
        addListener<{ src: string; url: string; revoked: boolean }>(
          'qrcode',
          async (data) => {
            // 数据
            const { src, url, revoked } = data;
            // 二维码失效
            if (revoked) {
              // 重新登录
              sendMessage('login', {
                type: 'tab',
                id: tabId.value,
                data: null,
              });
              return;
            }
            // 获取当前窗口
            const win = await useCurrentWindow();
            // 设置窗口高度
            win.height.value = 810;
            // 设置图片
            qrCodeSrc.value = src;
            // 显示二维码
            loginQRCodeShow.value = true;
            // 远程推送
            if (settings[SettingType.REMOTE_PUSH]) {
              // 检查 token
              if (!pushToken.value) {
                notification('推送 token 不存在!');
                return;
              }
              // 链接
              const a = createAHTML(url);
              // 图片
              const img = createImgHTML(src);
              // 推送
              const res = await pushModal(
                {
                  title: '登录推送',
                  content: ['扫一扫, 登录学习强国!', a, img],
                  type: 'info',
                },
                pushToken.value
              );
              notification(`推送${res ? '成功' : '失败'}!`);
            }
          }
        );
        // 登录成功
        addListener<boolean>('login', async (data) => {
          // 关闭二维码
          loginQRCodeShow.value = false;
          // 重置二维码
          qrCodeSrc.value = '';
          // 设置登录状态
          login.value = data;
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
