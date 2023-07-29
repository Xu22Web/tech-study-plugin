import { ref } from '../utils/composition';

function useMouse() {
  // 横坐标
  const x = ref(0);
  // 纵坐标
  const y = ref(0);
  window.addEventListener(
    'mousedown',
    (e) => {
      x.value = e.pageX;
      y.value = e.pageY;
    },
    { passive: true }
  );
  window.addEventListener(
    'mousemove',
    (e) => {
      x.value = e.pageX;
      y.value = e.pageY;
    },
    { passive: true }
  );
  window.addEventListener(
    'mouseup',
    (e) => {
      x.value = e.pageX;
      y.value = e.pageY;
    },
    { passive: true }
  );
  window.addEventListener(
    'wheel',
    (e) => {
      x.value = e.pageX;
      y.value = e.pageY;
    },
    { passive: true }
  );
  return {
    x,
    y,
  };
}

export default useMouse;
