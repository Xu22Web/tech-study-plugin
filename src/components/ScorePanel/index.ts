import store from '../../store';
import { Ref, watchEffectRef } from '../../utils/composition';
import { createElementNode, createTextNode } from '../../utils/element';
import Icon from '../Icon';
import './index.less';

function ScorePanel({ show }: { show: Ref<boolean> }) {
  // 存储
  const { taskConfig, todayScore } = store;
  return createElementNode(
    'div',
    undefined,
    {
      class: watchEffectRef(
        () => `egg_score_panel${show.value ? ' active' : ''}`
      ),
    },
    [
      createElementNode('div', undefined, { class: 'egg_score_title' }, [
        Icon({
          paths: [
            'M314.81 304.01h415.86v58.91H314.81zM314.81 440.24h415.86v58.91H314.81z',
            'M814.8 892.74h-8.64l-283.51-182-283.51 182h-8.64A69.85 69.85 0 0 1 160.72 823V188.22a69.85 69.85 0 0 1 69.77-69.77H814.8a69.85 69.85 0 0 1 69.77 69.77V823a69.85 69.85 0 0 1-69.77 69.74zM230.5 177.35a10.87 10.87 0 0 0-10.86 10.86V823a10.86 10.86 0 0 0 5 9.11l298.01-191.42 298.06 191.38a10.86 10.86 0 0 0 5-9.11V188.22a10.87 10.87 0 0 0-10.86-10.86z',
          ],
        }),
        createElementNode(
          'div',
          undefined,
          {
            class: 'egg_score_title_text',
          },
          createTextNode('积分详情')
        ),
      ]),
      ...taskConfig.map((task) =>
        createElementNode(
          'div',
          undefined,
          { class: 'egg_score_detail_item' },
          [
            createTextNode(task.title),
            createElementNode(
              'span',
              undefined,
              undefined,
              createTextNode(watchEffectRef(() => task.currentScore))
            ),
          ]
        )
      ),
      createElementNode('div', undefined, { class: 'egg_score_detail_item' }, [
        createTextNode('其他'),
        createElementNode(
          'span',
          undefined,
          undefined,
          createTextNode(
            watchEffectRef(
              () =>
                todayScore.value -
                taskConfig.reduce<number>((p, n) => p + n.currentScore, 0)
            )
          )
        ),
      ]),
    ]
  );
}

export default ScorePanel;
