import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import fs from 'fs';
import { glob } from 'glob';
import path from 'path';
import { defineConfig, Plugin, RollupOptions } from 'rollup';
import html from 'rollup-plugin-create-html';
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
      postcss({ extract: true, minimize: true }),
      html({
        template: './src/popup/index.html',
        title: 'tech-study-plugin',
        prefix: './',
        meta: {
          name: 'description',
          content: 'A browser plugin helps you study joyfully on xuexi.com.',
        },
        link: {
          rel: 'icon',
          href: './src/assets/icon.jpg',
        },
        inject: {
          'index.js': {
            defer: true,
            location: 'head',
          },
        },
      }),
      resolve(),
      commonjs(),
      typescript(),
      terser(),
      <Plugin>{
        name: 'temp',
        writeBundle(options) {
          // 生成文件夹
          const { dir } = options;
          if (dir) {
            // 目标文件夹
            const distDir = path.dirname(dir);
            fs.cpSync('./src/assets', path.join(distDir, './assets'), {
              recursive: true,
            });
          }
        },
      },
    ],
  },
  ...glob
    .sync('./src/@(inject|background)/**/*.ts')
    .map<RollupOptions>((file) => {
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
