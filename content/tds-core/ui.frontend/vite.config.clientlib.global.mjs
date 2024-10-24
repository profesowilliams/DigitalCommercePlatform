import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { bundlesImportRewriter } from '@aem-vite/import-rewriter';

// Define the name variable
const name = 'global'; // Replace with your desired name
const sourceRoot = '../../ui.apps/src/main/content/jcr_root/apps/tds-core/clientlibs/';

export default defineConfig(({ command, mode }) => ({
  base: command === 'build' ? `/etc.clientlibs/tds-core/clientlibs/clientlib-site-${name}/` : '/',
  publicDir: command === 'build' ? false : 'src/assets',

  build: {
    assetsDir: `clientlib-site-${name}/resources/static`,

    cssCodeSplit: false,
    reportCompressedSize: false,
    manifest: false,
    minify: mode === 'development' ? false : 'terser',
    outDir: `${sourceRoot}/clientlib-site-${name}`,
    sourcemap: command === 'serve' ? 'inline' : false,

    rollupOptions: {
      assetFileNames(chunk) {
        return chunk.name?.endsWith('.css')
          ? 'clientlib-site/resources/css/[name][extname]'
          : 'clientlib-site/resources/static/[name].[hash][extname]';
      },
      input: {
        // Define your JavaScript and CSS inputs
        bundle: 'src/main/webpack/global/main.js',
        styles: 'src/main/webpack/global/main.scss',
      },
      output: {
        // Output JS and CSS with the defined name variable
        entryFileNames: `js/${name}.js`, // JavaScript output
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return `css/${name}.css`; // CSS output
          }
          // All other assets (images, fonts, etc.) will go to resources
          return 'resources/[ext]/[name][extname]';
        },
        chunkFileNames: 'resources/chunks/[name].[hash].js', // Chunk files (dynamic imports)
      },
    },
  },

  plugins: [
    tsconfigPaths(),
    bundlesImportRewriter({
      publicPath: `/etc.clientlibs/tds-core/clientlibs/clientlib-site-${name}`,
      resourcesPath: 'resources/js',
    }),
  ],

  server: {
    origin: 'http://localhost:3000',
  },
}));
