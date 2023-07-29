/**
 * @description 设置类型
 */
export enum SettingType {
  AUTO_START,
  SCHEDULE_RUN,
  VIDEO_MUTED,
  RANDOM_EXAM,
  AUTO_ANSWER,
  REMOTE_PUSH,
}

/**
 * @description 任务类型
 */
export enum TaskType {
  LOGIN,
  READ,
  WATCH,
  PRACTICE,
}

/**
 * @description 学习状态类型
 */
export enum StudyStatusType {
  LOADING,
  START,
  PROGRESS,
  PAUSE,
  FINISH,
}

export enum ReadAndWatch {
  READ,
  WATCH,
}
