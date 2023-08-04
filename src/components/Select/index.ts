import {
  Ref,
  reactive,
  ref,
  watch,
  watchEffectRef,
  watchRef,
} from '../../utils/composition';
import { createElementNode, createTextNode } from '../../utils/element';
import './index.less';

function Select({
  data,
  maxlength,
  placeholder = '',
  onchange,
  value,
  keep,
}: {
  data: { label: string; value: number; selected?: boolean }[];
  maxlength?: number;
  placeholder?: string;
  onchange?: (selectData: { value: number; label: string }) => void;
  value?: Ref<number | null>;
  keep?: boolean;
}) {
  // 选择数据
  const selectData = reactive<
    {
      label: string;
      value: number;
      selected: boolean;
      active: boolean;
      ele: HTMLElement | null;
    }[]
  >(
    data.map((v) => ({
      selected: false,
      active: false,
      ele: null,
      ...v,
    }))
  );
  // 值
  const valueRef = value?.value
    ? watchEffectRef(() => value.value)
    : ref<number | null>(null);
  // 标签
  const labelRef = watchEffectRef(
    () =>
      selectData.find((item) => item.value === valueRef.value)?.label || null
  );
  // 聚焦
  const focus = ref(false);
  // 输入值
  const inputValueRef = ref<string | null>(labelRef);
  // 滚动顶部距离
  const listScrollTop = ref<number>(0);
  // 滚动到指定位置
  watch(
    () => selectData.map((item) => [item.active, item.selected]),
    () =>
      selectData.forEach(
        (item) =>
          (item.selected || item.active) &&
          (listScrollTop.value = item.ele?.offsetTop || 0)
      )
  );
  return createElementNode(
    'div',
    undefined,
    {
      class: 'egg_select',
    },
    [
      createElementNode(
        'input',
        { value: inputValueRef },
        {
          class: 'egg_select_input',
          type: 'text',
          placeholder,
          maxlength,
          onfocus() {
            focus.value = true;
            // 初始值存在
            if (valueRef.value) {
              // 查找匹配值
              const index = selectData.findIndex(
                (v) => v.value === valueRef.value
              );
              // 存在
              if (index + 1) {
                // 设置输入框
                inputValueRef.value = selectData[index].label;
                // 设置选择项目
                selectData.forEach((v, i) => (v.selected = i === index));
              }
            }
          },
          oninput(e: InputEvent) {
            // 输入框元素
            const inputEle = <HTMLInputElement>e.target;
            // 绑定输入值
            inputValueRef.value = inputEle.value;
            // 文本存在
            const index = selectData.findIndex((v) =>
              v.label.includes(inputEle.value)
            );
            // 移动到匹配选项
            if (inputValueRef.value) {
              // 存在匹配
              if (index + 1) {
                selectData.forEach((v, i) => {
                  v.active = i === index;
                  v.active &&
                    setTimeout(() => {
                      v.active = false;
                    }, 100);
                });
              }
              return;
            }
            // 清除
            selectData.forEach((v) => (v.active = v.selected = false));
            // 滚回起始位置
            listScrollTop.value = 0;
          },
          onblur() {
            if (keep) {
              // 恢复默认
              const defaultItem = selectData.find(
                (v) => v.value === valueRef.value
              );
              inputValueRef.value = defaultItem?.label || null;
            }
            // 失去焦点
            setTimeout(() => {
              focus.value = false;
            }, 100);
          },
        }
      ),
      createElementNode(
        'div',
        {
          scrollTop: listScrollTop,
        },
        {
          class: watchEffectRef(
            () => `egg_select_list${focus.value ? ' active' : ''}`
          ),
        },
        selectData.map((v, i) =>
          createElementNode(
            'button',
            undefined,
            {
              type: 'button',
              class: watchRef(
                () => [v.selected, v.active],
                () =>
                  `egg_select_item${
                    v.selected ? ' selected' : v.active ? ' active' : ''
                  }`
              ),
              ref: (e) => (v.ele = e),
              onclick() {
                if (inputValueRef.value !== v.label) {
                  // 设置输入框值
                  inputValueRef.value = v.label;
                  // 设置选择
                  selectData.forEach(
                    (item, index) => (item.selected = index === i)
                  );
                  // 变化之
                  onchange && onchange({ label: v.label, value: v.value });
                }
                focus.value = false;
              },
            },
            createTextNode(v.label)
          )
        )
      ),
    ]
  );
}

export default Select;
