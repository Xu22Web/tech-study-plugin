import { createElementNode, createTextNode } from '../../utils/element';
import './index.less';

function Detail({ tip }: { tip: string }) {
  return createElementNode(
    'button',
    undefined,
    {
      type: 'button',
      class: 'egg_detail',
      title: tip,
    },
    createTextNode('i')
  );
}

export default Detail;
