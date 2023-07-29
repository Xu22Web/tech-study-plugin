import store from '../../store';
import { watchEffectRef } from '../../utils/composition';
import { createElementNode, createTextNode } from '../../utils/element';
import './index.less';

function MessageItem() {
  // 存储
  const { message } = store;
  return createElementNode('div', undefined, { class: 'egg_message_item' }, [
    watchEffectRef(() =>
      message.value
        ? createElementNode(
            'div',
            undefined,
            { class: 'egg_message_content' },
            createTextNode(message)
          )
        : undefined
    ),
  ]);
}

export default MessageItem;
