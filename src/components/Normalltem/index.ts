import { Ref } from '../../utils/composition';
import { createElementNode, createTextNode } from '../../utils/element';
import Detail from '../Detail';
import Switch from '../Switch';
import './index.less';

/**
 * @description 设置普通项
 * @returns
 */
function NormalItem({
  title,
  tip,
  checked,
  onchange,
}: {
  title: string;
  tip: string;
  checked: Ref<boolean> | boolean;
  onchange: (e: Event) => void;
}) {
  return createElementNode('div', undefined, { class: 'egg_setting_item' }, [
    createElementNode('div', undefined, { class: 'egg_label_wrap' }, [
      createElementNode('label', undefined, { class: 'egg_task_title' }, [
        createTextNode(title),
        Detail({ tip }),
      ]),
    ]),
    Switch({ tip, checked, onchange }),
  ]);
}

export default NormalItem;
