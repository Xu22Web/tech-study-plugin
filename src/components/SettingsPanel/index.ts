import PLUGIN_CONFIG from '../../config/plugin';
import { SettingType } from '../../enum';
import store from '../../store';
import { Settings } from '../../types';
import {
  Reactive,
  Ref,
  reactive,
  ref,
  watchEffectRef,
} from '../../utils/composition';
import {
  createElementNode,
  createNSElementNode,
  createTextNode,
} from '../../utils/element';
import { debounce, notification } from '../../utils/utils';
import Icon from '../Icon';
import Select from '../Select';
import TimeInput from '../TimeInput';
import './index.less';

function SettingsPanel({
  settingsShow,
  themeColor,
  settings,
}: {
  settingsShow: Ref<boolean>;
  themeColor: Ref<string>;
  settings: Reactive<Settings>;
}) {
  // 主题色
  const themeColors = [
    {
      value: '#fa3333',
      title: '强国红',
      detail: 'XueXi Red',
      code: 'none',
    },
    {
      value: '#bb2649',
      title: '非凡洋红',
      detail: 'Viva Magenta',
      code: '18-1750',
    },
    {
      value: '#35548a',
      title: '经典蓝',
      detail: 'Classic Blue',
      code: '19-4052',
    },
    {
      value: '#f36f63',
      title: '活珊瑚橘',
      detail: 'Living Coral',
      code: '16-1546',
    },
    {
      value: '#6d5b97',
      title: '紫外光色',
      detail: 'Ultra Violet',
      code: '18-3838',
    },
    {
      value: '#86af49',
      title: '草木绿',
      detail: 'Greenery',
      code: '15-0343',
    },
    {
      value: '#fc8bab',
      title: 'B站粉',
      detail: 'Bilibili Pink',
      code: 'none',
    },
    {
      value: '#056de8',
      title: '知乎蓝',
      detail: 'Zhihu Blue',
      code: 'none',
    },
  ];
  // 存储
  const { maxRead, maxWatch } = store;
  // token
  const pushToken = ref('');
  // token
  let token = '';
  // 小时
  const hour = ref(-1);
  // 分钟
  const minute = ref(-1);
  // 显示保存
  const saveShow = ref(false);
  /**
   * @description 定时刷新列表
   */
  const scheduleList = reactive<
    {
      hour: number;
      minute: number;
      time: string;
    }[]
  >([]);
  return createElementNode(
    'div',
    undefined,
    {
      class: watchEffectRef(
        () => `egg_settings_panel_wrap${settingsShow.value ? ' active' : ''}`
      ),
    },
    createElementNode('div', undefined, { class: 'egg_settings_panel' }, [
      createElementNode(
        'div',
        undefined,
        {
          class: 'egg_back_wrap',
        },
        [
          createElementNode(
            'button',
            undefined,
            {
              class: 'egg_btn',
              title: '返回',
              type: 'button',
              onclick: debounce(() => {
                settingsShow.value = false;
              }, 300),
            },
            Icon({
              paths: [
                'M942.545455 478.021818H165.748364l361.239272-361.192727a34.909091 34.909091 0 1 0-49.384727-49.384727L56.785455 488.261818a33.838545 33.838545 0 0 0-7.493819 11.264 34.536727 34.536727 0 0 0 7.493819 38.120727l420.817454 420.817455a34.816 34.816 0 0 0 49.338182 0 34.909091 34.909091 0 0 0 0-49.384727l-361.239273-361.192728h776.843637a34.909091 34.909091 0 0 0 0-69.864727z',
              ],
            })
          ),
          createTextNode('设置'),
        ]
      ),
      createElementNode('div', undefined, { class: 'egg_settings_content' }, [
        createElementNode(
          'div',
          undefined,
          { class: 'egg_settings_version_wrap' },
          [
            createElementNode(
              'div',
              undefined,
              { class: 'egg_settings_label' },
              createTextNode('版本信息')
            ),
            createElementNode(
              'div',
              undefined,
              {
                class: 'egg_settings_version',
              },
              [
                createTextNode(`v${PLUGIN_CONFIG.version}`),
                createElementNode(
                  'button',
                  undefined,
                  {
                    type: 'button',
                    class: 'egg_settings_version_detail',
                    title: 'GitHub Xu22Web/tech-study-plugin',
                    onclick() {
                      chrome.tabs.create({
                        url: 'https://github.com/Xu22Web/tech-study-plugin',
                        active: true,
                      });
                    },
                  },
                  Icon({
                    paths: [
                      'M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z',
                    ],
                    viewBox: '0 0 16 16',
                  })
                ),
              ]
            ),
          ]
        ),
        createElementNode(
          'div',
          undefined,
          { class: 'egg_settings_theme_wrap' },
          [
            createElementNode(
              'div',
              undefined,
              { class: 'egg_settings_title' },
              [
                createElementNode(
                  'div',
                  undefined,
                  { class: 'egg_settings_label' },
                  createTextNode('主题预设')
                ),
                createElementNode(
                  'div',
                  undefined,
                  {
                    class: 'egg_settings_current_theme',
                  },
                  createTextNode(
                    watchEffectRef(
                      () =>
                        themeColors.find(
                          (color) => color.value === themeColor.value
                        )!.title
                    )
                  )
                ),
              ]
            ),
            createElementNode(
              'div',
              undefined,
              { class: 'egg_settings_theme_colors' },
              themeColors.map((color) =>
                createElementNode(
                  'div',
                  undefined,
                  {
                    class: 'egg_settings_theme_color_wrap',
                    style: `--color: ${color.value}`,
                  },
                  createElementNode('button', undefined, {
                    class: watchEffectRef(
                      () =>
                        `egg_settings_theme_color${
                          themeColor.value === color.value ? ' active' : ''
                        }`
                    ),
                    type: 'button',
                    title: color.title,
                    onclick: debounce(() => {
                      if (themeColor.value !== color.value) {
                        themeColor.value = color.value;
                        // 存储
                        chrome.storage.local.set(
                          JSON.parse(JSON.stringify({ themeColor }))
                        );
                        // 通知
                        notification(`主题色已保存为${color.title}`);
                      }
                    }, 300),
                  })
                )
              )
            ),
          ],
          {
            async beforeCreat() {
              // 获取颜色
              const { themeColor: themeColorTemp } =
                await chrome.storage.local.get('themeColor');
              // 设置主题色
              themeColorTemp && (themeColor.value = themeColorTemp);
              // 监听颜色变化
              chrome.storage.local.onChanged.addListener((changes) => {
                for (let [key, { newValue }] of Object.entries(changes)) {
                  if (key === 'themeColor') {
                    themeColor.value = newValue;
                  }
                }
              });
            },
          }
        ),
        createElementNode(
          'div',
          undefined,
          {
            class: 'egg_settings_read_time_wrap',
          },
          [
            createElementNode(
              'div',
              undefined,
              { class: 'egg_settings_label' },
              createTextNode('最大文章时长')
            ),
            Select({
              data: [
                {
                  label: '40s',
                  value: 40,
                },
                {
                  label: '60s',
                  value: 60,
                },
                {
                  label: '80s',
                  value: 80,
                },
                {
                  label: '100s',
                  value: 100,
                },
              ],
              value: maxRead,
              placeholder: '100s',
              maxlength: 4,
              keep: true,
              onchange({ value }) {
                maxRead.value = value;
                // 存储
                chrome.storage.local.set(
                  JSON.parse(JSON.stringify({ maxRead }))
                );
                // 通知
                notification(`最大文章选读时间改为${value}s`);
              },
            }),
          ],
          {
            async beforeCreat() {
              const { maxRead: maxReadTemp } = await chrome.storage.local.get(
                'maxRead'
              );
              maxReadTemp && (maxRead.value = maxReadTemp);
              // 监听颜色变化
              chrome.storage.local.onChanged.addListener((changes) => {
                for (let [key, { newValue }] of Object.entries(changes)) {
                  if (key === 'maxRead') {
                    maxRead.value = newValue;
                  }
                }
              });
            },
          }
        ),
        createElementNode(
          'div',
          undefined,
          {
            class: 'egg_settings_watch_time_wrap',
          },
          [
            createElementNode(
              'div',
              undefined,
              { class: 'egg_settings_label' },
              createTextNode('最大视听时长')
            ),
            Select({
              data: [
                {
                  label: '40s',
                  value: 40,
                },
                {
                  label: '60s',
                  value: 60,
                },
                {
                  label: '80s',
                  value: 80,
                },
                {
                  label: '100s',
                  value: 100,
                },
                {
                  label: '120s',
                  value: 120,
                },
              ],
              value: maxWatch,
              placeholder: '120s',
              maxlength: 4,
              keep: true,
              onchange({ value }) {
                maxWatch.value = value;
                // 存储
                chrome.storage.local.set(
                  JSON.parse(JSON.stringify({ maxWatch }))
                );
                // 通知
                notification(`最大视听学习时间改为${value}s`);
              },
            }),
          ],
          {
            async beforeCreat() {
              const { maxWatch: maxWatchTemp } = await chrome.storage.local.get(
                'maxWatch'
              );
              maxWatchTemp && (maxWatch.value = maxWatchTemp);
              // 监听颜色变化
              chrome.storage.local.onChanged.addListener((changes) => {
                for (let [key, { newValue }] of Object.entries(changes)) {
                  if (key === 'maxWatch') {
                    maxWatch.value = newValue;
                  }
                }
              });
            },
          }
        ),
        watchEffectRef(() =>
          settings[SettingType.REMOTE_PUSH]
            ? createElementNode(
                'div',
                undefined,
                { class: 'egg_settings_token_wrap' },
                [
                  createElementNode(
                    'div',
                    undefined,
                    { class: 'egg_settings_token' },
                    [
                      createElementNode(
                        'div',
                        undefined,
                        { class: 'egg_settings_label' },
                        createTextNode('我的 token')
                      ),
                      createElementNode('input', undefined, {
                        class: 'egg_settings_token_input',
                        placeholder: '用户 token',
                        maxlength: 32,
                        value: pushToken.value,
                        onfocus: (e: Event) => {
                          const input = <HTMLInputElement>e.target;
                          input.classList.add('active');
                          saveShow.value = true;
                        },
                        onblur: (e: Event) => {
                          const input = <HTMLInputElement>e.target;
                          // 去除空格
                          const value = input.value.trim();
                          if (/^[0-9a-z]{32}$/.test(value)) {
                            token = value;
                            input.value = value;
                          } else {
                            token = '';
                          }
                          input.classList.remove('active');
                          setTimeout(() => {
                            saveShow.value = false;
                            input.value = pushToken.value;
                          }, 200);
                        },
                      }),
                    ]
                  ),
                  createElementNode(
                    'div',
                    undefined,
                    {
                      class: watchEffectRef(
                        () =>
                          `egg_settings_submit_btn_wrap${
                            saveShow.value ? ' active' : ''
                          }`
                      ),
                    },
                    createElementNode(
                      'button',
                      undefined,
                      {
                        class: 'egg_settings_submit_btn',
                        onclick: debounce(() => {
                          // 创建提示
                        }, 300),
                      },
                      createTextNode('保存')
                    )
                  ),
                ]
              )
            : undefined
        ),
        watchEffectRef(() =>
          settings[SettingType.SCHEDULE_RUN]
            ? createElementNode('div', undefined, { class: 'egg_schedule' }, [
                createElementNode(
                  'div',
                  undefined,
                  { class: 'egg_schedule_time_wrap' },
                  [
                    createElementNode(
                      'div',
                      undefined,
                      { class: 'egg_schedule_time' },
                      [
                        createElementNode(
                          'div',
                          undefined,
                          { class: 'egg_schedule_label' },
                          createTextNode('设置时间')
                        ),
                        createElementNode(
                          'div',
                          undefined,
                          { class: 'egg_schedule_time_input_wrap' },
                          [
                            TimeInput({
                              hour,
                              minute,
                              onchange({ hour: h, minute: min }) {
                                hour.value = h;
                                minute.value = min;
                              },
                            }),
                            createElementNode(
                              'button',
                              undefined,
                              {
                                class: 'egg_schedule_add_btn',
                                onclick: debounce(() => {
                                  //   // 定时刷新
                                  //   if (!settings[SettingType.SCHEDULE_RUN]) {
                                  //     createTip('未开启定时刷新!');
                                  //     return;
                                  //   }
                                  //   if (
                                  //     hour.value === -1 ||
                                  //     minute.value === -1
                                  //   ) {
                                  //     createTip('时间格式不符合要求!');
                                  //     return;
                                  //   }
                                  //   // 重复定时存在
                                  //   const exists = scheduleList.find(
                                  //     (schedule) =>
                                  //       schedule.hour === hour.value &&
                                  //       schedule.minute === minute.value
                                  //   );
                                  //   if (exists) {
                                  //     createTip('设置定时任务重复!');
                                  //     return;
                                  //   }
                                  //   createTip('设置定时任务成功!');
                                  //   // 添加
                                  //   scheduleList.push({
                                  //     hour: hour.value,
                                  //     minute: minute.value,
                                  //     time: `${formatDateNum(
                                  //       hour.value
                                  //     )}:${formatDateNum(minute.value)}`,
                                  //   });
                                  //   // 排序
                                  //   scheduleList.sort((a, b) =>
                                  //     a.hour === b.hour
                                  //       ? a.minute - b.minute
                                  //       : a.hour - b.hour
                                  //   );
                                  //   // 存储
                                  //   GM_setValue(
                                  //     'scheduleList',
                                  //     JSON.stringify(scheduleList)
                                  //   );
                                  //   // 清空
                                  //   hour.value = -1;
                                  //   minute.value = -1;
                                  //   const inputs = $$<HTMLInputElement>(
                                  //     '.egg_time_input input'
                                  //   );
                                  //   inputs.forEach((i) => (i.value = ''));
                                  // 刷新任务
                                  //   refreshScheduleTask();
                                }, 300),
                              },
                              createNSElementNode(
                                'svg',
                                undefined,
                                {
                                  viewBox: '0 0 1024 1024',
                                  class: 'egg_icon',
                                },
                                createNSElementNode('path', undefined, {
                                  d: 'M801.171 483.589H544V226.418c0-17.673-14.327-32-32-32s-32 14.327-32 32v257.171H222.83c-17.673 0-32 14.327-32 32s14.327 32 32 32H480v257.17c0 17.673 14.327 32 32 32s32-14.327 32-32v-257.17h257.171c17.673 0 32-14.327 32-32s-14.327-32-32-32z',
                                })
                              )
                            ),
                          ]
                        ),
                      ]
                    ),
                  ]
                ),
                // ScheduleList(),
              ])
            : undefined
        ),
      ]),
    ])
  );
}

export default SettingsPanel;
