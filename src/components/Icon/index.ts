import { createNSElementNode } from '../../utils/element';
import './index.less';

function Icon({
  paths,
  viewBox = '0 0 1024 1024',
}: {
  paths: string[];
  viewBox?: string;
}) {
  return createNSElementNode(
    'svg',
    undefined,
    {
      viewBox,
      class: 'egg_icon',
    },
    paths.map((d) =>
      createNSElementNode('path', undefined, {
        d,
      })
    )
  );
}

export default Icon;
