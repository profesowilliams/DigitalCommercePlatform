// Import the LitElement base class and html helper function
import { LitElement, html, css, nothing } from "lit";
import {choose} from 'lit/directives/choose.js';

/**
 * @prop {boolean} disabled - Checks if the button should be disabled
 * @prop {string} type - The type of the button
 * @prop {string} link - The link of the button
 * @prop {string} variant - The variant of the button
 * @prop {string} theme - The theme of the button
 * @prop {Boolean} minimal - The size of the button
 * @prop {string} id - The id of the button
 * @prop {string} name - The name of the button
 * @prop {string} class - The class of the button
 * @prop {string} label - The label of the button
 * @summary This is a custom button element
 * @tag tds-button
 */
export class Button extends LitElement {
  static get properties() {
    return {
      id: { type: String, reflect: true },
      type: { type: String, reflect: true }, // 'link' or 'button'
      link: { type: String, reflect: true }, // link to open when action link is clicked
      name: { type: String, reflect: true },
      class: { type: String, reflect: true },
      variant: { type: String, reflect: true },
      label: { type: String, reflect: true },
      theme: { type: String, reflect: true },
      disabled: { type: Boolean, reflect: true },
      minimal: { type: Boolean, reflect: true },
      ariaLabel: { type: String, reflect: true },
      backgroundColor: { type: String, reflect: true }
    };
  }

  // Initializes properties in the constructor
  constructor() {
    super();
    this.type = "button";
    this.label = "Button";
    this.theme = "dark";
    this.variant = "primary";
    this.disabled = false;
  }

  static get styles() {
    return css`
      /* styles for the button element */
      a, button {
        background: var(--tds-button-bg-color, transparent);
        border: var(--tds-button-border, none);
        border-radius: var(--tds-button-border-radius, none);
        box-sizing: var(--tds-button-box-sizing, border-box);
        color: var(--tds-button-color, var(--white, #ffffff));
        cursor: var(--tds-button-cursor, pointer);
        display: var(--tds-button-display, inline-block);
        font-weight: var(--tds-button-font-weight, 400);
        font-size: var(--tds-button-font-size, 1rem);
        height: var(--tds-button-height, 3rem);
        line-height: var(--tds-button-line-height, unset);
        min-width: var(--tds-button-min-width, 8.8125rem);
        outline-color: var(--tds-button-outline-color, transparent);
        outline-style: var(--tds-button-outline-style, solid);
        outline-width: var(--tds-button-outline-width, 1px);
        outline-offset: var(--tds-button-outline-offset, 0);
        padding: var(--tds-button-padding, 12px 20px);
        -webkit-appearance: button;
        position: var(--tds-button-position, relative);
        text-align: var(--tds-button-text-align, center);
        text-decoration: var(--tds-button-text-decoration, none);
        text-decoration-thickness: var(
          --tds-button-text-decoration-thickness,
          inherit
        );
        text-underline-offset: var(--tds-button-text-underline-offset, inherit);
        text-transform: var(--tds-button-text-transforma, none);
        vertical-align: var(--tds-button-vertical-align, middle);
        width: var(--tds-button-width, auto);
      }

      a.minimal {
        line-height: inherit;
        height: 32px;
      }

      button:focus::before, a:focus::before {
        content: "";
        border-radius: 0.25rem;
        box-sizing: inherit;
        display: block;
        position: absolute;
        height: calc(100% - 0.8rem);
        top: 0.4rem;
        left: 0.4rem;
        visibility: visible;
        width: calc(100% - 0.8rem);
      }

      :host {
        --tds-button-min-width: var(--button-min-width);
        --tds-button-bg-color: var(--button-bg-color, #903d57);
        --tds-button-color: var(--button-color, #fff);
        --tds-icon-color: var(--button-icon-color, var(--button-color));
        --tds-button-border: var(--button-border, transparent);
        --tds-button-border-radius: var(--button-radius, none);
        --tds-button-font-weight: var(--button-font-weight, 400);
        --tds-button-font-size: var(--button-font-size, 1rem);
        --tds-button-line-height: var(--button-line-height, unset);
        --tds-button-padding: var(--button-padding, 12px 20px);
        --tds-button-height: var(--button-height, 3rem);
        --tds-button-icon-height: var(--button-icon-height, 24px);
        --tds-button-icon-width: var(--button-icon-width, 24px);
        --tds-button-outline-color: var(--button-outline-color, transparent);
        --tds-button-outline-style: var(--button-outline-style, solid);
        --tds-button-outline-width: var(--button-outline-width, 1px);
        --tds-button-outline-offset: var(--button-outline-offset, 0);
      }

      :host button:hover, :host a:hover {
        --tds-button-bg-color: var(--button-hover, #0062cc);
        --tds-button-color: var(--button-color-hover, var(--button-color));
        --tds-button-text-decoration: var(--button-text-decoration, none);
        --tds-button-text-underline-offset: 3px;
        --tds-icon-color: var(--button-color-hover, #fff);
      }

      :host button:active, :host a:active {
        --tds-button-bg-color: var(--button-active, #0062cc);
        --tds-button-color: var(--button-color-active, var(--button-color));
        --tds-icon-color: var(--button-color-active, var(--button-color));
      }

      :host button:disabled,
      :host button:disabled:hover,
      :host a:disabled,
      :host a:disabled:hover {
        pointer-events: none;
        --tds-button-bg-color: var(--button-bg-color, #e4e5e6);
        --tds-button-color: var(--button-color, var(--button-color));
        --tds-button-outline-color: var(--button-outline-color, transparent);
        --tds-icon-color: var(--button-color, var(--button-color));
      }
    `;
  }
  render() {
    return html`
      ${choose(this.type, [
        ['link', () => html`
          <a
            href=${this.link}
            ?disabled=${this.disabled}
            class="${this.minimal ? 'minimal' : ''}"
            aria-label="${this.ariaLabel || nothing}"
          >
            <slot>${this.label}</slot>
          </a>
        `],
        ['button', () => html`
          <button
            ?disabled=${this.disabled}
            aria-label="${this.ariaLabel || nothing}"
          >
            <slot>${this.label}</slot>
          </button>
    `]
    ],
      () => html`<h1>Error</h1>`)}
    `;
  }
}

customElements.define("tds-button", Button);
