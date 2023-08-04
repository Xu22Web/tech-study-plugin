import PLUGIN_CONFIG from '../../config/plugin';
import { SettingType } from '../../enum';
import store from '../../store';
import { Settings } from '../../types';
import { Reactive, Ref, watchEffectRef } from '../../utils/composition';
import { createElementNode, createTextNode } from '../../utils/element';
import { setValue } from '../../utils/storage';
import { debounce } from '../../utils/utils';
import Icon from '../Icon';
import Select from '../Select';
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
  const { maxRead, maxWatch, pushToken, notify } = store;
  // token input
  const tokenInput = watchEffectRef(() => pushToken.value || null);
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
                        setValue('themeColor', themeColor);
                        // 通知
                        notify({
                          title: '主题设置',
                          message: `主题色已保存为${color.title}`,
                        });
                      }
                    }, 300),
                  })
                )
              )
            ),
          ]
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
                setValue('maxRead', maxRead);
                // 通知
                notify({
                  title: '时间设置',
                  message: `最大文章选读时间改为${value}s`,
                });
              },
            }),
          ]
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
                setValue('maxWatch', maxWatch);
                // 通知
                notify({
                  title: '时间设置',
                  message: `最大视听学习时间改为${value}s`,
                });
              },
            }),
          ]
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
                      createElementNode(
                        'div',
                        undefined,
                        { class: 'egg_settings_token_input_wrap' },
                        createElementNode(
                          'input',
                          { value: tokenInput },
                          {
                            class: 'egg_settings_token_input',
                            type: 'text',
                            placeholder: 'token',
                            maxlength: 32,
                            pattern: '^[0-9a-z]{32}$',
                            required: true,
                            oninput(e: InputEvent) {
                              const input = <HTMLInputElement>e.target;
                              // 绑定输入
                              tokenInput.value = input.value;
                            },
                            onblur() {
                              // 存在输入
                              if (tokenInput.value !== null) {
                                // 格式匹配
                                const matched = /^[0-9a-z]{32}$/.test(
                                  tokenInput.value
                                );
                                // 满足格式
                                if (matched) {
                                  // 存在修改
                                  if (pushToken.value !== tokenInput.value) {
                                    // 设置 token
                                    pushToken.value = tokenInput.value;
                                    // 本地存储
                                    setValue('pushToken', pushToken);
                                    // 通知
                                    notify({
                                      title: '推送设置',
                                      message: 'token 保存成功!',
                                    });
                                  }
                                  return;
                                }
                                // 重置初始值
                                if (tokenInput.value === '') {
                                  pushToken.value = '';
                                  tokenInput.value = null;
                                  // 本地存储
                                  setValue('pushToken', pushToken);
                                  // 通知
                                  notify({
                                    title: '推送设置',
                                    message: 'token 删除成功!',
                                  });
                                  return;
                                }
                                // 设置正确值
                                tokenInput.value = pushToken.value;
                                // 通知
                                notify({
                                  title: '推送设置',
                                  message: 'token 有误!',
                                });
                              }
                            },
                          }
                        )
                      ),
                    ]
                  ),
                ]
              )
            : undefined
        ),
      ]),
    ])
  );
}

export default SettingsPanel;
