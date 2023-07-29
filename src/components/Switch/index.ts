import { Ref } from '../../utils/composition';
import { createElementNode } from '../../utils/element';
import './index.less';

function Switch({
  tip = '',
  checked = false,
  disabled = false,
  onchange,
}: {
  tip?: string;
  checked?: Ref<boolean> | boolean;
  disabled?: Ref<boolean> | boolean;
  onchange?: (e: Event) => void;
}) {
  return createElementNode(
    'input',
    {
      checked,
    },
    {
      title: tip,
      class: 'egg_switch',
      type: 'checkbox',
      disabled,
      onchange,
    }
  );
}

export default Switch;
