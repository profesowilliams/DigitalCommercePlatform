import { Button } from "./button.js";
import { html } from "lit-html";

export default {
  title: "Components/Button",
  component: "tds-button",
  parameters: {
    layout: "centered",
  },
  tags: ["docsPage"],
  render: (args) => new Button(args),
  argTypes: {
    theme: {
      control: "radio",
      options: ["light", "dark"],
    },
    disabled: {
      control: "boolean",
    },
    label: {
      control: "text",
    },
    minimal: {
      control: "boolean",
    },
    variant: {
      table: {
        disable: true,
      },
    },
    backgroundColor: { control: "color" },
    onClick: { action: "onClick" },
  },
  args: {
    theme: "dark",
    disabled: false,
    minimal: false,
  },
};

export const Default = {
  render: (args) => html`
    <tds-button
      type="button"
      variant="${args.variant}"
      theme="${args.theme}"
      label="${args.label}"
      ?disabled=${args.disabled}
      ?minimal=${args.minimal}
    ></tds-button>
  `,
  args: {
    label: "Button",
  },
  parameters: {
    design: [
      {
        type: "figspec",
        accessToken: import.meta.env.STORYBOOK_FIGMA_API_KEY,
        url: "https://www.figma.com/proto/0kRReWOuX0Wv29hbxahsRr/Component-Library?page-id=3%3A3&node-id=1343%3A4089&viewport=2055%2C-1706%2C1.44&scaling=min-zoom",
      },
      {
        type: "figspec",
        accessToken: import.meta.env.STORYBOOK_FIGMA_API_KEY,
        url: "https://www.figma.com/proto/0kRReWOuX0Wv29hbxahsRr/Component-Library?page-id=3%3A3&node-id=294%3A1776&scaling=min-zoom",
      },
    ],
    docs: {
      source: {
        code: "<tds-button></tds-button>",
      },
    },
  },
};

export const Primary = {
  render: (args) => html`
    <tds-button
      type="button"
      variant="${args.variant}"
      theme="${args.theme}"
      label="${args.label}"
      ?disabled=${args.disabled}
      ?minimal=${args.minimal}
    ></tds-button>
  `,
  args: {
    variant: "primary",
    label: "Primary",
    theme: "dark",
    disabled: false,
  },
};

export const Secondary = {
  render: (args) => html`
    <tds-button
      type="button"
      variant="${args.variant}"
      theme="${args.theme}"
      label="${args.label}"
      ?disabled=${args.disabled}
      ?filled=${args.filled}
      ?minimal=${args.minimal}
    ></tds-button>
  `,
  args: {
    ...Primary.args,
    variant: "secondary",
    label: "Secondary",
    filled: false,
  },
};

export const Tertiary = {
  render: (args) => html`
    <tds-button
      type="button"
      variant="${args.variant}"
      theme="${args.theme}"
      label="${args.label}"
      ?disabled=${args.disabled}
      ?minimal=${args.minimal}
    ></tds-button>
  `,
  args: {
    ...Primary.args,
    variant: "tertiary",
    label: "Tertiary",
  },
};

export const Link = {
  render: (args) => html`
    <tds-button
      type="button"
      variant="${args.variant}"
      theme="${args.theme}"
      label="${args.label}"
      ?disabled=${args.disabled}
      ?minimal=${args.minimal}
    ></tds-button>
  `,
  args: {
    ...Primary.args,
    variant: "link",
    label: "Link",
  },
};

export const Affirmative = {
  render: (args) => html`
    <tds-button
      type="button"
      variant="${args.variant}"
      theme="${args.theme}"
      label="${args.label}"
      ?disabled=${args.disabled}
      ?minimal=${args.minimal}
    ></tds-button>
  `,
  args: {
    ...Primary.args,
    variant: "affirmative",
    label: "Affirmative",
  },
};

export const Destructive = {
  render: (args) => html`
    <tds-button
      type="button"
      variant="${args.variant}"
      theme="${args.theme}"
      label="${args.label}"
      ?disabled=${args.disabled}
      ?minimal=${args.minimal}
    ></tds-button>
  `,
  args: {
    ...Primary.args,
    variant: "destructive",
    label: "Destructive",
  },
};
