import path from 'path';
import { defineConfig } from 'vite';
import terser from '@rollup/plugin-terser';
import fs from 'fs';

// Define the base path for the js.txt file and output directory
const basePath = path.resolve(__dirname, '../ui.apps/src/main/content/jcr_root/apps/tds-core/clientlibs/clientlib-web-components');

// Plugin to update js.txt
function updateJsTxtPlugin() {
  return {
    name: 'update-js-txt',
    writeBundle() {
      const filePath = path.join(basePath, 'js.txt');

      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(`Error reading ${filePath}:`, err);
          return;
        }

        if (!data.includes('#base=js')) {
          data = '#base=js\n' + data;
        }

        if (!data.includes('components.js')) {
          data += 'components.js\n';
        }

        fs.writeFile(filePath, data, 'utf8', (err) => {
          if (err) {
            console.error(`Error writing to ${filePath}:`, err);
          } else {
            console.log(`${filePath} updated successfully.`);
          }
        });
      });
    },
  };
}

// Common configuration
const commonConfig = {
  build: {
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: ['bootstrap'],
      input: {
        lit: path.resolve(__dirname, 'src/main/webpack/webcomponents/components/Lit/index.ts'),
      },
      output: [
        {
          dir: path.join(basePath, 'js'),
          format: 'iife',
          entryFileNames: 'components.js',
        },
      ],
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        quietDeps: true, // Suppress warnings from dependencies
        quiet: true, // Suppresses all warnings
        silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin'],
      },
    },
  },
  plugins: [updateJsTxtPlugin()],
};

// Development configuration
const devConfig = {
  ...commonConfig,
  build: {
    ...commonConfig.build,
    sourcemap: true,
    minify: false,
  },
};

// Production configuration
const prodConfig = {
  ...commonConfig,
  build: {
    ...commonConfig.build,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove all console.* statements
        drop_debugger: true, // Optional: Remove debugger statements too
      },
    },
    rollupOptions: {
      ...commonConfig.build.rollupOptions,
      plugins: [terser()],
    },
  },
};

export default defineConfig(({ mode }) => {
  if (mode === 'development') {
    return devConfig;
  }
  return prodConfig;
});
