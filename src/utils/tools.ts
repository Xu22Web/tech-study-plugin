import useMouse from '../hooks/useMouse';
import { ref, watchEffect, watchEffectRef } from './composition';
import { createElementNode, mountElement } from './element';

/**
 * @description 鼠标助手
 */
function installMouseHelper() {
  // 左边距
  const left = ref(0);
  // 上边距
  const top = ref(0);
  // 样式
  const eleStyle = Object.entries({
    width: '20px',
    height: '20px',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    background: '#00000050',
    'border-radius': '50%',
    'z-index': '9999',
    'pointer-events': 'none',
    border: '2px solid #00000050',
  })
    .map((v) => `${v[0]}: ${v[1]};`)
    .join('');
  // 创建元素
  const ele = createElementNode(
    'div',
    undefined,
    {
      style: watchEffectRef(
        () => `left: ${left.value}px;top: ${top.value}px;${eleStyle}`
      ),
    },
    undefined,
    {
      onMounted() {
        // 鼠标
        const { x, y } = useMouse();
        watchEffect(() => (left.value = x.value));
        watchEffect(() => (top.value = y.value));
      },
    }
  );
  // body样式
  const bodyStyle = Object.entries({
    position: 'relative',
  });
  bodyStyle.forEach((e) => document.body.style.setProperty(e[0], e[1]));
  // 挂载元素
  mountElement(ele);
}

export { installMouseHelper };
