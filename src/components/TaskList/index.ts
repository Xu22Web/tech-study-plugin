import { TaskType } from '../../enum';
import store from '../../store';
import TaskItem from '../TaskItem';
import { watchEffect, watchEffectRef } from '../../utils/composition';
import { createElementNode } from '../../utils/element';
import { debounce, notification } from '../../utils/utils';
import './index.less';

function TaskList() {
  // 存储
  const { taskConfig, login } = store;
  // 处理任务设置变化
  const handleTaskChange = (e: Event, type: TaskType, title: string) => {
    // 开关
    const { checked } = <HTMLInputElement>e.target;
    if (taskConfig[type].active !== checked) {
      taskConfig[type].active = checked;
      // 本地存储
      chrome.storage.local.set({
        taskConfig: JSON.parse(JSON.stringify(taskConfig)),
      });
      // 通知
      notification(`${title} ${checked ? '打开' : '关闭'}`);
    }
  };
  return createElementNode(
    'div',
    undefined,
    {
      class: 'egg_task_list',
    },
    taskConfig.map((label) =>
      TaskItem({
        title: label.title,
        tip: label.tip,
        checked: watchEffectRef(() => label.active),
        disabled: watchEffectRef(() => label.disabled),
        currentScore: watchEffectRef(() => label.currentScore),
        dayMaxScore: watchEffectRef(() => label.dayMaxScore),
        onchange: debounce((e) => {
          handleTaskChange(e, label.type, label.title);
        }, 300),
      })
    ),
    {
      async onMounted() {
        // 获取任务配置
        const { taskConfig: taskConfigTemp } = await chrome.storage.local.get(
          'taskConfig'
        );
        try {
          if (taskConfig.length === taskConfigTemp.length) {
            taskConfig.forEach((task, i) => {
              task.active = taskConfigTemp[i].active;
            });
          }
        } catch (error) {
          taskConfig.forEach((task) => {
            task.active = true;
          });
        }
        // 重置
        watchEffect(
          () =>
            !login.value &&
            taskConfig.forEach((task) => {
              task.currentScore = 0;
              task.dayMaxScore = 0;
              task.status = false;
            })
        );
      },
    }
  );
}

export default TaskList;
