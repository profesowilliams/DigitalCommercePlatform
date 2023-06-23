// .storybook/preview.js
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import "../src/main/webpack/webcomponents/main.scss";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
};
