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

// Define the input and output paths
const inputPath = path.resolve(__dirname, 'src/main/webpack/webcomponents/styles/index.scss');
const outputPath = isProduction
  ? path.resolve(__dirname, '../ui.apps/src/main/content/jcr_root/apps/tds-core/clientlibs/clientlib-web-components/css/components.css')
  : path.resolve(__dirname, '../ui.apps/src/main/content/jcr_root/apps/tds-core/clientlibs/clientlib-web-components/css/components.css');

// Measure start time
const startTime = Date.now();

// Function to recursively count SCSS files
function countScssFiles(dir) {
  let count = 0;
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
  return count;
}

async function buildCSS() {
  try {
    // Dynamically import gzip-size and chalk
    const { gzipSize } = await import('gzip-size');
    const chalk = (await import('chalk')).default;

    // Count SCSS files
    const moduleCount = countScssFiles(path.resolve(__dirname, 'src/main/webpack/webcomponents/styles'));

    // Compile the SCSS file
    const result = sass.renderSync({
      file: inputPath,
      outFile: outputPath,
      includePaths: [path.resolve(__dirname, 'node_modules')],
      quietDeps: true, // Suppresses warnings from dependencies
    });

    // Ensure the directory exists before writing the file
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    // Process the compiled CSS with PostCSS (Autoprefixer and optionally cssnano)
    const postCssPlugins = [autoprefixer()];
    if (isProduction) {
      postCssPlugins.push(cssnano());
    }

    const processedCss = await postcss(postCssPlugins).process(result.css.toString(), { from: undefined, to: outputPath });

    // Write the processed CSS to the output file
    fs.writeFileSync(outputPath, processedCss.css);

    // Get the size of the processed CSS file
    const cssSize = fs.statSync(outputPath).size;
    const gzipCssSize = await gzipSize(processedCss.css);

    if (isProduction) {
      // Measure end time
      const endTime = Date.now();
      const buildTime = ((endTime - startTime) / 1000).toFixed(2);

      // Log the stats with colors and bold file sizes
      const cyan = chalk.cyan;
      const gray = chalk.gray;
      const boldGray = chalk.gray.bold;
      console.log(`${chalk.green('✓')} ${moduleCount} modules transformed.`);
      console.log(`${gray('../ui.apps/src/main/content/jcr_root/apps/tds-core/clientlibs/clientlib-web-components/css/')}${cyan('components.css')}  ${boldGray((cssSize / 1024).toFixed(2) + ' kB')} │ ${gray('gzip: ' + (gzipCssSize / 1024).toFixed(2) + ' kB')}`);
      console.log(`${chalk.green(`✓ built in ${buildTime}s`)}`);
    } else {
      // Log the stats for development build
      const endTime = Date.now();
      const buildTime = ((endTime - startTime) / 1000).toFixed(2);

      // Log the stats with colors and bold file sizes
      const cyan = chalk.cyan;
      const gray = chalk.gray;
      const boldGray = chalk.gray.bold;
      console.log(`${chalk.green(`✓ ${moduleCount} modules transformed.`)}`);
      console.log(`${gray('../ui.apps/src/main/content/jcr_root/apps/tds-core/clientlibs/clientlib-web-components/css/')}${cyan('components.css')}  ${boldGray((cssSize / 1024).toFixed(2) + ' kB')} │ ${gray('gzip: ' + (gzipCssSize / 1024).toFixed(2) + ' kB')}`);
      console.log(`${chalk.green(`✓ built in ${buildTime}s`)}`);
    }
  } catch (error) {
    console.error('Error during CSS build:', error);
  }
}

buildCSS();
