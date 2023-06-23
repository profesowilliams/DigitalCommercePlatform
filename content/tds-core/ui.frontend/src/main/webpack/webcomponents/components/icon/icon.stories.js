import { Icon}  from './icon.js';
import { html } from 'lit-html';

export default {
  title: 'Components/Icon',
  component: 'tds-icon',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  render: (args) => new Icon(args),
};

export const Default = {
  render: (args) => html`
  <tds-icon type="button" src="/src/icons/filled/people.svg" size="64px" ></tds-icon>
`,
};
