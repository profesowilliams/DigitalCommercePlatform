const path = require("path");

module.exports = {
  stories: [
    "../src/main/webpack/webcomponents/components/**/*.mdx",
    "../src/main/webpack/webcomponents/components/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-events",
    "@storybook/addon-interactions",
    "@storybook/addon-storysource",
    "@storybook/preset-scss",
    "storybook-addon-headless",
    "@storybook/addon-coverage",
    "storybook-dark-mode",
  ],
  features: {
    interactionsDebugger: true,
  },
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
    defaultName: 'Documentation',
  },
};
