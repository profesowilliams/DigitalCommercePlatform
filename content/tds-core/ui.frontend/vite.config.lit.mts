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

      // Read the existing contents of js.txt
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(`Error reading ${filePath}:`, err);
          return;
        }

        // Check if '#base=js' exists, if not, add it
        if (!data.includes('#base=js')) {
          data = '#base=js\n' + data;
        }

        // Append 'components.js' to the file
        if (!data.includes('components.js')) {
          data += 'components.js\n';
        }

        // Write the updated contents back to js.txt
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
