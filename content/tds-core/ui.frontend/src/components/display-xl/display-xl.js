class DisplayXL extends HTMLElement {
  connectedCallback() {
    // This method is called when the element is inserted into the DOM
    // You can interact with the DOM and add content here

    // Example: Create a div element and set its text
    const div = document.createElement('div');
    div.textContent = 'This is a display-xl custom element';
    this.appendChild(div);
  }

  // Define any methods or properties for your custom element
}

customElements.define('display-xl', DisplayXL);
