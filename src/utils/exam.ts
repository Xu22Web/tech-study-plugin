import { getAnswer } from '../api/answer';
import { $$ } from './element';

/**
 * @description 获取题目元素
 * @returns
 */
function getQuestionBody() {
  // 题目
  const qBody = $$('.q-body')[0];
  return qBody;
}
/**
 * @description 获取题目
 * @returns
 */
function getQuestion() {
  return getQuestionBody().innerText;
}

/**
 * @description 获取提示信息
 * @returns
 */
function getTips() {
  // 所有提示元素
  const allTips = $$('.line-feed font[color]');
  // 提示
  const tips = allTips.map((t) => t.innerText.trim()).filter((t) => t);
  return tips;
}

/**
 * @description 获取题型
 * @returns
 */
function getType() {
  // 题目类型
  const type = <'填空题' | '单选题' | '多选题'>(
    $$('.q-header')[0].innerText.substring(0, 3)
  );
  return type;
}

/**
 * @description 选项按钮
 * @returns
 */
function getChoicesBtn() {
  // 选项按钮
  const allBtns = $$<HTMLButtonElement>('.q-answer');
  return allBtns;
}

/**
 * @description 获取选项
 * @returns
 */
function getChoices() {
  // 选项按钮
  const allBtns = getChoicesBtn();
  // 选项
  const choices = allBtns.map((btn) => btn.innerText.trim()).filter((t) => t);
  return choices;
}

/**
 * @description 获取填空
 * @returns
 */
function getBlanksCount() {
  // 填空
  const blanks = $$('.blank');
  return blanks.length;
}

/**
 * @description 获取题目页码
 * @returns
 */
function getQuestionPage() {
  // 页码
  const page = $$('.pager')[0];
  // 页码信息
  const [current, total] = page.innerText.split('/').map((n) => Number(n));
  return {
    current,
    total,
  };
}

/**
 * @description 获取下一步按钮文本
 * @returns
 */
function getNext() {
  return new Promise<string>((resolve) => {
    const timer = setInterval(() => {
      // 答题按钮
      const nextAll = $$<HTMLButtonElement>('.ant-btn')
        .filter((next) => next.innerText)
        .map((btn) => btn.innerText.replace(/\s/g, ''));
      if (nextAll.length) {
        // 停止定时器
        clearInterval(timer);
        if (nextAll.length === 2) {
          resolve(nextAll[1]);
          return;
        }
        resolve(nextAll[0]);
      }
    }, 500);
  });
}

/**
 * @description 获取滑动验证状态
 * @returns
 */
function getSlideVerifyStatus() {
  // 滑动验证
  const mask = $$<HTMLElement>('#nc_mask')[0];
  // 显示状态
  const status = !!mask && getComputedStyle(mask).display !== 'none';
  if (status) {
    // 提高层级
    mask.style.zIndex = '999';
  }
  return status;
}

/**
 * @description 处理选择答案匹配
 * @param tips
 * @param answers
 * @returns
 */
function handleChoiceAnswersMatch(choices: string[], answers: string[]) {
  // 作答
  return answers
    .map((answer) => {
      // 包含答案最短长度选项
      const minLengthChoice = {
        value: '',
        index: -1,
      };
      // 遍历
      choices.forEach((choice, i) => {
        // 无符号选项文本
        const unsignedChoice = choice.replaceAll(/[、，,。 ]/g, '');
        // 无符号答案
        const unsignedAnswer = answer.replaceAll(/[、，,。 ]/g, '');
        // 包含答案
        if (
          choice === answer ||
          choice.includes(answer) ||
          answer.includes(choice) ||
          unsignedChoice.includes(unsignedAnswer)
        ) {
          // 最小长度选项有值
          if (minLengthChoice.value.length) {
            // 最短长度选项与当前选项比较长度
            if (minLengthChoice.value.length > choice.length) {
              minLengthChoice.value = choice;
              minLengthChoice.index = i;
            }
          } else {
            minLengthChoice.value = choice;
            minLengthChoice.index = i;
          }
        }
      });
      // 存在选项
      if (minLengthChoice.value.length) {
        return minLengthChoice.index;
      }
      return -1;
    })
    .filter((v) => !!(v + 1));
}

/**
 * @description 处理选项答案分隔符匹配
 * @param choices
 * @param tips
 * @param seperator
 * @returns
 */
function handleChoicesAnswersSepratorMatch(
  choices: string[],
  tips: string[],
  seperator: string[]
) {
  // 可能答案
  const answersLike = seperator.map((s) => tips.join(s));
  for (const i in answersLike) {
    // 答案
    const answer = answersLike[i];
    // 选项索引
    const choiceIndexs = handleChoiceAnswersMatch(choices, [answer]);
    if (choiceIndexs.length === 1) {
      return choiceIndexs;
    }
  }
}

/**
 * @description 处理单选
 * @returns
 */
async function handleSingleChoice() {
  // 问题
  const question = getQuestion();
  // 选项
  const choices = getChoices();
  // 提示
  const tips = getTips();
  // 提示存在
  if (tips.length) {
    // 创建提示为1
    if (tips.length === 1) {
      // 处理答案选项
      const choiceIndexs = handleChoiceAnswersMatch(choices, tips);
      if (choiceIndexs.length === 1) {
        return choiceIndexs;
      }
    } else {
      // 可能分隔符
      const seperator = ['', ' ', ',', ';', ',', '、', '-', '|', '+', '/'];
      // 可能答案
      const choiceIndexs = handleChoicesAnswersSepratorMatch(
        choices,
        tips,
        seperator
      );
      if (choiceIndexs?.length === 1) {
        return choiceIndexs;
      }
    }
  }
  // 网络答案
  const answersNetwork = await getAnswer(question);
  // 存在答案
  if (answersNetwork.length) {
    // 单答案单选项
    if (answersNetwork.length === 1) {
      // 尝试查找点击
      const choiceIndexs = handleChoiceAnswersMatch(choices, answersNetwork);
      if (choiceIndexs.length === 1) {
        return choiceIndexs;
      }
    } else {
      // 多答案单选项 选项意外拆分
      // 可能分隔符
      const seperator = ['', ' '];
      // 可能答案
      const choiceIndexs = handleChoicesAnswersSepratorMatch(
        choices,
        tips,
        seperator
      );
      if (choiceIndexs?.length === 1) {
        return choiceIndexs;
      }
    }
  }
}

/**
 * @description 处理多选
 * @returns
 */
async function handleMutiplyChoices() {
  // 问题
  const question = getQuestion();
  // 选项
  const choices = getChoices();
  // 提示
  const tips = getTips();
  // 存在提示
  if (tips.length) {
    // 选项内容
    const choicesContent = choices
      .map((choiceText) => choiceText.split(/[A-Z]./)[1].trim())
      .join('');
    // 空格
    const blanks = question.match(/（）/g) || [];
    // 填空数量、选项数量、答案数量相同 | 选项全文等于答案全文
    if (
      choices.length === blanks.length ||
      question === choicesContent ||
      choices.length === 2
    ) {
      // 全选
      return choices.map((_c, i) => i);
    }
    // 选项数量大于等于答案
    if (choices.length >= tips.length) {
      // 选项索引
      const choiceIndexs = handleChoiceAnswersMatch(choices, tips);
      if (choiceIndexs.length) {
        return choiceIndexs;
      }
    }
  }
  // 获取网络答案
  const answersNetwork = await getAnswer(question);
  console.log('answersNetwork', answersNetwork);
  if (answersNetwork.length) {
    // 选项索引
    const choiceIndexs = handleChoiceAnswersMatch(choices, answersNetwork);
    if (choiceIndexs.length) {
      return choiceIndexs;
    }
  }
}

/**
 * @description 处理填空
 * @returns
 */
async function handleBlanks() {
  // 问题
  const question = getQuestion();
  // 填空
  const blanksCount = getBlanksCount();
  // 提示
  const tips = getTips();
  if (tips.length) {
    // 填空数量=提示数量
    if (tips.length === blanksCount) {
      return tips;
    }
    // 填空数量=1&&提示数量>1
    if (blanksCount === 1 && tips.length > 1) {
      // 直接将所有答案整合填进去
      const answer = tips.join('');
      return [answer];
    }
  }
  // 获取网络答案
  const answersNetwork = await getAnswer(question);
  console.log('answersNetwork', answersNetwork);
  if (answersNetwork.length) {
    // 填空数量=答案数量
    if (answersNetwork.length === blanksCount) {
      return answersNetwork;
    }
    // 填空数量=1&&答案数>1
    if (blanksCount === 1 && answersNetwork.length > 1) {
      // 直接将所有答案整合填进去
      const answer = answersNetwork.join('');
      return [answer];
    }
  }
}

export {
  getBlanksCount,
  getChoices,
  getNext,
  getQuestion,
  getQuestionBody,
  getTips,
  getType,
  getQuestionPage,
  getSlideVerifyStatus,
  handleBlanks,
  handleMutiplyChoices,
  handleSingleChoice,
};
