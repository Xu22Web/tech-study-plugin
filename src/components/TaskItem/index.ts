import Switch from '../Switch';
import { Ref, watchEffectRef } from '../../utils/composition';
import { createElementNode, createTextNode } from '../../utils/element';
import './index.less';

/**
 * @description 设置任务项
 * @returns
 */
function TaskItem({
  title,
  tip,
  checked,
  currentScore,
  dayMaxScore,
  onchange,
  disabled,
}: {
  title: string;
  tip: string;
  checked: Ref<boolean> | boolean;
  disabled: Ref<boolean> | boolean;
  currentScore: Ref<number>;
  dayMaxScore: Ref<number>;
  onchange: (...args: any[]) => void;
}) {
  return createElementNode(
    'div',
    undefined,
    {
      class: 'egg_task_item',
    },
    [
      createElementNode('div', undefined, { class: 'egg_label_wrap' }, [
        createElementNode('div', undefined, { class: 'egg_task_title_wrap' }, [
          createElementNode(
            'div',
            undefined,
            { class: 'egg_task_title' },
            createTextNode(title)
          ),
          createElementNode(
            'div',
            undefined,
            { class: 'egg_task_progress_wrap' },
            [
              createElementNode(
                'div',
                undefined,
                {
                  class: 'egg_task_current',
                },
                createTextNode(currentScore)
              ),
              createElementNode(
                'div',
                undefined,
                {
                  class: 'egg_task_max',
                },
                createTextNode(watchEffectRef(() => `/${dayMaxScore.value}`))
              ),
            ]
          ),
        ]),
        createElementNode('div', undefined, { class: 'egg_progress' }, [
          createElementNode(
            'div',
            undefined,
            { class: 'egg_track' },
            createElementNode('div', undefined, {
              class: 'egg_bar',
              style: watchEffectRef(
                () =>
                  `width: ${(
                    (100 * currentScore.value) /
                    dayMaxScore.value
                  ).toFixed(1)}%;`
              ),
            })
          ),
        ]),
      ]),
      Switch({ tip, checked, disabled, onchange }),
    ]
  );
}

export default TaskItem;
