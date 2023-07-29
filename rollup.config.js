import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { glob } from 'glob';
import path from 'path';
import { defineConfig } from 'rollup';
import html from 'rollup-plugin-html2';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript2';

// 目标目录
const distDir = 'dist';
// 源文件目录
const srcDir = 'src';

export default defineConfig([
  {
    input: './src/popup/index.ts',
    output: {
      format: 'es',
      dir: `${distDir}/popup`,
    },
    watch: {
      buildDelay: 500,
    },
    plugins: [
      postcss({ extract: true }),
      html({
        template: './src/index.html',
        title: 'tech-study-plugin',
        onlinePath: '.',
        meta: {
          description:
            'A browser plugin helps you study joyfully on xuexi.com.',
        },
        entries: {
          index: {
            tag: 'script',
            type: 'module',
          },
        },
        externals: {
          before: [
            {
              tag: 'link',
              rel: 'icon',
              href: '../assets/icon.jpg',
            },
          ],
        },
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          keepClosingSlash: true,
        },
      }),
      resolve(),
      commonjs(),
      typescript(),
      terser(),
    ],
  },
  ...glob.sync('./src/@(inject|background)/**/*.ts').map((file) => {
    // 目录
    const dir = path.join(distDir, path.dirname(file).replace(srcDir, ''));
    return {
      input: file,
      output: {
        format: 'es',
        dir,
      },
      watch: {
        buildDelay: 500,
      },
      plugins: [resolve(), commonjs(), typescript(), terser()],
    };
  }),
]);
