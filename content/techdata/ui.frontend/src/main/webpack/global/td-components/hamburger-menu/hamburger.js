export default class Hamburger {
    constructor(el) {
        const classObj = {
            active: 'active',
            open: 'megamenu--open',
        }

        this.el = el;
        this.open = false;
        this.containerEl = document.querySelector('.megamenu');

        this.el.addEventListener('click', () => this.handleClick(classObj));
    }

    handleClick({active, open}) {
        if (!this.open) {
            this.el.classList.add(active);
            this.containerEl.classList.add(open);
            this.open = true;
        } else {
            this.el.classList.remove(active);
            this.containerEl.classList.remove(open);
            this.open = false;
        }
    }
}
