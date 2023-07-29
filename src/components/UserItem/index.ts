import { UserInfo } from '../../api/user';
import store from '../../store';
import { ref, watchEffect, watchEffectRef } from '../../utils/composition';
import { createElementNode, createTextNode } from '../../utils/element';
import { createMessageListeners, sendMessage } from '../../utils/message';
import { debounce } from '../../utils/utils';
import './index.less';

function UserItem() {
  // 存储
  const { login, tabId, isBlack } = store;
  // 事件监听
  const { addListener, removeAllListeners } = createMessageListeners();
  // 用户信息
  const userInfo = ref<UserInfo | null>(null);
  return createElementNode(
    'div',
    undefined,
    { class: 'egg_user_item' },
    watchEffectRef(() =>
      userInfo.value
        ? [
            // 用户信息
            createElementNode('div', undefined, { class: 'egg_userinfo' }, [
              // 头像
              createElementNode('div', undefined, { class: 'egg_avatar' }, [
                watchEffectRef(() => {
                  return userInfo.value!.avatarMediaUrl
                    ? createElementNode('img', undefined, {
                        src: userInfo.value!.avatarMediaUrl,
                        class: 'egg_avatar_img',
                        title: '用户头像',
                        alt: '用户头像',
                      })
                    : createElementNode(
                        'div',
                        undefined,
                        {
                          class: 'egg_avatar_nick',
                          title: '用户头像',
                        },
                        createTextNode(userInfo.value!.nick.substring(1, 3))
                      );
                }),
                // 状态
                createElementNode('div', undefined, {
                  title: `用户状态 (${isBlack.value ? '封禁' : '正常'})`,
                  class: watchEffectRef(
                    () => `egg_status${isBlack.value ? ' deactive' : ' active'}`
                  ),
                }),
              ]),
              // 昵称
              createElementNode(
                'div',
                undefined,
                { class: 'egg_nick', title: '用户昵称' },
                createTextNode(userInfo.value!.nick)
              ),
            ]),
            // 退出按钮
            createElementNode(
              'button',
              undefined,
              {
                type: 'button',
                class: 'egg_logout_btn',
                onclick: debounce(() => {
                  // 退出登录
                  sendMessage('logout', {
                    type: 'tab',
                    id: tabId.value,
                    data: null,
                  });
                  login.value = false;
                }, 300),
              },
              createTextNode('退出')
            ),
          ]
        : undefined
    ),
    {
      onMounted() {
        // 监听用户信息
        addListener<UserInfo | undefined>('getUserInfo', (res) => {
          if (!res) {
            return;
          }
          userInfo.value = res;
        });
        // 更新用户信息
        sendMessage('getUserInfo', {
          type: 'tab',
          id: tabId.value,
          data: null,
        });
        // 重置
        watchEffect(() => !login.value && (userInfo.value = null));
      },
      beforeDestroy() {
        // 移除监听
        removeAllListeners();
      },
    }
  );
}

export default UserItem;
