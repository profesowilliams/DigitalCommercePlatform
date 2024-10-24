const sass = require('sass');
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const minimist = require('minimist');

// Parse command-line arguments
const args = minimist(process.argv.slice(2));
const isProduction = args.env === 'production';

// Define input and output paths
const inputPath = path.resolve(__dirname, 'src/main/webpack/webcomponents/styles/index.scss');
const outputPath = path.resolve(
  __dirname,
  '../ui.apps/src/main/content/jcr_root/apps/techdata/clientlibs/clientlib-web-components/css/components.css'
);

// Measure the start time
const startTime = Date.now();

// Function to recursively count SCSS files
function countScssFiles(dir) {
  let count = 0;
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        count += countScssFiles(fullPath);
      } else if (path.extname(fullPath) === '.scss') {
        count += 1;
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }
  return count;
}

async function buildCSS() {
  try {
    // Dynamically import gzip-size and chalk
    const { gzipSize } = await import('gzip-size');
    const chalk = (await import('chalk')).default;

    // Count SCSS files in the specified directory
    const moduleCount = countScssFiles(path.resolve(__dirname, 'src/main/webpack/webcomponents/styles'));

    // Compile the SCSS file asynchronously with warnings suppressed
    const result = await sass.compileAsync(inputPath, {
      outFile: outputPath,
      api: 'modern-compiler',
      loadPaths: [path.resolve(__dirname, 'node_modules')],
      quietDeps: true, // Suppress warnings from dependencies
      quiet: true,     // Suppresses all warnings
      silenceDeprecations: ["legacy-js-api", "import", "global-builtin"],
    });

    // Ensure output directory exists before writing the file
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    // Configure PostCSS plugins
    const postCssPlugins = [autoprefixer()];
    if (isProduction) {
      postCssPlugins.push(cssnano());
    }

    // Process CSS with PostCSS
    const processedCss = await postcss(postCssPlugins).process(result.css, {
      from: undefined,
      to: outputPath,
    });

    // Write the final CSS to the output file
    fs.writeFileSync(outputPath, processedCss.css);

    // Calculate file sizes for logging
    const cssSize = fs.statSync(outputPath).size;
    const gzipCssSize = await gzipSize(processedCss.css);

    // Measure the build time
    const endTime = Date.now();
    const buildTime = ((endTime - startTime) / 1000).toFixed(2);

    // Log build results
    const cyan = chalk.cyan;
    const gray = chalk.gray;
    const boldGray = chalk.gray.bold;

    console.log(`${chalk.green('✓')} ${moduleCount} modules transformed.`);
    console.log(
      `${gray('../ui.apps/src/main/content/jcr_root/apps/techdata/clientlibs/clientlib-web-components/css/')}${cyan(
        'components.css'
      )}  ${boldGray((cssSize / 1024).toFixed(2) + ' kB')} │ ${gray('gzip: ' + (gzipCssSize / 1024).toFixed(2) + ' kB')}`
    );
    console.log(`${chalk.green(`✓ built in ${buildTime}s`)}`);
  } catch (error) {
    console.error('Error during CSS build:', error);
  }
}

// Run the build process
buildCSS();
