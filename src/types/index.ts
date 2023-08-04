import { TaskType } from '../enum';

/**
 * @description 设置
 */
export type Settings = [boolean, boolean, boolean, boolean];

/**
 * @description 任务配置
 */
export type TaskConfig = {
  title: string;
  currentScore: number;
  dayMaxScore: number;
  need: number;
  status: boolean;
  tip: string;
  active: boolean;
  disabled: boolean;
  type: TaskType;
}[];

/**
 * @description 文章视听列表
 */
export type NewsVideoList = {
  publishTime: string;
  title: string;
  type: string;
  url: string;
  showSource: string;
  dataValid: boolean;
  itemType: string;
}[];

/**
 * @description 点
 */
export type Point = { x: number; y: number };

/**
 * @description 范围
 */
export type Bounds = { x: number; y: number; width: number; height: number };
