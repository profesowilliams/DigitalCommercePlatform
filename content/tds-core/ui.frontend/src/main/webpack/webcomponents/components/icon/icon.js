import {
  LitElement,
  html,
  css
} from "lit";

// Class definition for the custom web component "tds-icon"
export class Icon extends LitElement {
  // Define properties for the component
  static get properties() {
      return {
          path: { type: String }, // path of the icon
          size: { type: String }, // size of the icon
          viewbox: { type: String }, // viewbox of the svg 
          flip: { type: String }, // flip of the icon
          rotate: { type: String }, // rotation of the icon
          src: { type: String }, // source of the icon
          width: { type: String }, // width of the icon
          height: { type: String }, // height of the icon
      };
  }

  // constructor 
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); // attach shadow DOM
    this.size = '24'; // default size
    this.viewbox = '0 0 24 24'; // default viewbox
    this.flip = false; // default flip
    this.rotate = false; // default rotate
    this.icon = ''; // default icon
  }

  // method that runs when component is first connected to the DOM
  async connectedCallback() {
      super.connectedCallback();
      this.icon = (this.shadowRoot.innerHTML = await (await fetch(this.src)).text()); // fetch text from src, assign to icon and shadow root
      //this.shadowRoot.append(...this.querySelectorAll("[shadowRoot]"))
      //this.replaceWith(...shadowRoot.childNodes)
  }

  // css styles for the component
  static get styles() {
      return css`
      :host {
        display: inline-block;
        vertical-align: middle;
        justify-content: center;
        color: var(--tds-icon-color, #000);
        pointer-events: none;
        padding: 0 5px;
      }

      svg {
        display: inline-block;
        height: var(--icon-height, 24px);
        width: var(--icon-width, 24px);
      }
    `;
  }

  // render method for the component
  render() {
      return this.icon;
  }
}

// register the component with the name "tds-icon"
customElements.define("tds-icon", Icon);