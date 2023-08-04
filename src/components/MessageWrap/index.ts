import {
  Reactive,
  reactive,
  watchEffectRef,
  watchRef,
} from '../../utils/composition';
import { createElementNode, createTextNode } from '../../utils/element';
import { randomId, sleep } from '../../utils/utils';
import Icon from '../Icon';
import './index.less';

interface MessageOptions {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warn' | 'success' | 'fail';
  delay?: number;
  keep?: boolean;
}

class Message implements MessageOptions {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warn' | 'success' | 'fail';
  active: boolean = false;
  destroyed: boolean = false;
  mounted: boolean = false;
  removed: boolean = false;
  keep: boolean;
  delay: number;
  constructor(
    options: Pick<
      MessageOptions,
      'message' | 'title' | 'type' | 'delay' | 'keep'
    >
  ) {
    // 随机 id
    const id = randomId(8);
    this.id = id;
    // 配置
    const { title, message, type, delay, keep } = options;
    this.title = title;
    this.message = message;
    this.type = type;
    this.delay = delay || 2000;
    this.keep = keep || false;
  }
  show() {
    this.active = true;
    if (!this.keep) {
      setInterval(() => {
        this.destroy();
      }, this.delay);
    }
    return this;
  }
  async destroy() {
    if (!this.destroyed) {
      this.active = false;
      this.destroyed = true;
      let timer = setInterval(async () => {
        // 销毁列表
        const destroyedList = messageList.filter((message) => message.destroy);
        // 等待前置组件移除
        if (
          destroyedList[0].removed ||
          (destroyedList[0].id === this.id && this.mounted)
        ) {
          clearInterval(timer);
          await sleep(300);
          const index = messageList.findIndex(
            (message) => message.id === this.id
          );
          messageList.splice(index, 1);
        }
      }, 300);
    }
  }
  update(options: Partial<Pick<MessageOptions, 'message' | 'title'>>) {
    // 消息
    const item = messageList.find((message) => message.id === this.id);
    if (item) {
      // 配置
      const { title, message } = options;
      if (title !== undefined) {
        item.title = title;
      }
      if (message !== undefined) {
        item.message = message;
      }
    }
    return this;
  }
}

// 消息列表
const messageList: Reactive<Message[]> = reactive([]);

function MessageWrap() {
  return createElementNode(
    'div',
    undefined,
    {
      class: 'egg_message_wrap',
    },
    watchRef(
      () => messageList.map((msg) => msg),
      () =>
        messageList.map((message) =>
          createElementNode(
            'div',
            undefined,
            {
              class: watchEffectRef(
                () => `egg_message_item_wrap${message.active ? ' active' : ''}`
              ),
            },
            createElementNode(
              'div',
              undefined,
              {
                class: 'egg_message_item',
              },
              [
                createElementNode(
                  'div',
                  undefined,
                  { class: 'egg_message_head_wrap' },
                  [
                    createElementNode(
                      'div',
                      undefined,
                      {
                        class: watchEffectRef(
                          () => `egg_message_head ${message.type}`
                        ),
                      },
                      [
                        message.type === 'info'
                          ? Icon({
                              paths: [
                                'M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z',
                              ],
                              viewBox: '64 64 896 896',
                            })
                          : message.type === 'warn'
                          ? Icon({
                              paths: [
                                'M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z',
                              ],
                              viewBox: '64 64 896 896',
                            })
                          : message.type === 'success'
                          ? Icon({
                              paths: [
                                'M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z',
                              ],
                              viewBox: '64 64 896 896',
                            })
                          : Icon({
                              paths: [
                                'M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z',
                              ],
                              viewBox: '64 64 896 896',
                            }),
                        createElementNode(
                          'div',
                          undefined,
                          { class: 'egg_message_title' },
                          createTextNode(watchEffectRef(() => message.title))
                        ),
                      ]
                    ),
                    createElementNode(
                      'button',
                      undefined,
                      {
                        type: 'button',
                        class: 'egg_message_head_extra',
                        onclick() {
                          message.destroy();
                        },
                      },
                      Icon({
                        paths: [
                          'M579.392 511.296l429.376 428.544a48.128 48.128 0 0 1-34.176 82.304c-12.8 0-25.088-5.12-34.112-14.208L511.168 579.392 81.792 1008a48.32 48.32 0 0 1-67.648-0.576 48.128 48.128 0 0 1-0.64-67.52L442.88 511.296 13.568 82.752A48.128 48.128 0 0 1 14.08 15.168 48.32 48.32 0 0 1 81.792 14.592l429.376 428.544L940.48 14.592a48.32 48.32 0 0 1 67.648 0.64c18.624 18.56 18.88 48.64 0.64 67.52L579.392 511.296z',
                        ],
                      })
                    ),
                  ]
                ),
                createElementNode(
                  'div',
                  undefined,
                  { class: 'egg_message_content' },
                  createTextNode(watchEffectRef(() => message.message))
                ),
              ],
              {
                beforeCreat() {
                  //  已卸载
                  if (message.destroyed) {
                    return;
                  }
                  message.active = message.mounted;
                },
                onMounted() {
                  // 已卸载
                  if (message.destroyed) {
                    return;
                  }
                  // 已挂载
                  if (message.mounted) {
                    return;
                  }
                  // 挂载
                  message.mounted = true;
                  // 设置显示
                  if (!message.active) {
                    requestAnimationFrame(() => {
                      message.show();
                    });
                  }
                },
              }
            ),
            {
              onDestroyed() {
                if (message.mounted && message.destroyed) {
                  message.removed = true;
                }
              },
            }
          )
        )
    )
  );
}

// 使用
const useMessage = () => {
  return {
    create(
      options: Pick<
        MessageOptions,
        'message' | 'title' | 'type' | 'delay' | 'keep'
      >
    ) {
      const message = new Message(options);
      messageList.push(message);
      return message;
    },
    clear() {
      messageList.forEach((msg) => msg.destroy());
    },
  };
};
export { useMessage };
export default MessageWrap;
