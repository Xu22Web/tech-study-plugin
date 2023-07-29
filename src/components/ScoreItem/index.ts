import store from '../../store';
import { ref, watchEffect } from '../../utils/composition';
import { createElementNode, createTextNode } from '../../utils/element';
import { debounce } from '../../utils/utils';
import Icon from '../Icon';
import ScorePanel from '../ScorePanel';
import './index.less';

/**
 * @description 分数详情
 */
function ScoreItem() {
  // 存储
  const { todayScore, totalScore, login } = store;
  // 分数面板显示
  const show = ref(false);
  return createElementNode(
    'div',
    undefined,
    {
      class: 'egg_score_item',
    },
    createElementNode('div', undefined, { class: 'egg_scoreinfo' }, [
      createElementNode(
        'div',
        undefined,
        {
          class: 'egg_total_score',
        },
        [
          createTextNode('总积分'),
          createElementNode(
            'span',
            undefined,
            undefined,
            createTextNode(totalScore)
          ),
        ]
      ),
      createElementNode(
        'button',
        undefined,
        {
          class: 'egg_today_score',
          type: 'button',
          onclick: debounce(() => {
            show.value = !show.value;
          }, 300),
          onblur() {
            show.value = false;
          },
        },
        [
          createTextNode('当天分数'),
          // 当天分数
          createElementNode(
            'span',
            undefined,
            undefined,
            createTextNode(todayScore)
          ),
          Icon({
            paths: [
              'M332.16 883.84a40.96 40.96 0 0 0 58.24 0l338.56-343.04a40.96 40.96 0 0 0 0-58.24L390.4 140.16a40.96 40.96 0 0 0-58.24 58.24L640 512l-307.84 314.24a40.96 40.96 0 0 0 0 57.6z',
            ],
          }),
          // 分数面板
          ScorePanel({ show }),
        ]
      ),
    ]),
    {
      onMounted() {
        // 重置
        watchEffect(() => {
          if (!login.value) {
            todayScore.value = 0;
            totalScore.value = 0;
          }
        });
      },
    }
  );
}

export default ScoreItem;
