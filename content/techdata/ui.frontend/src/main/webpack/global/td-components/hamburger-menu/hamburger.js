export default class Hamburger {
    constructor() {
        const el = this.injectHamburger();

        if (!el) return;

        const classObj = {
            active: 'active',
            open: 'megamenu--open',
        }

        this.el = el;
        this.open = false;
        this.containerEl = document.querySelector('.megamenu');

        this.el.addEventListener('click', () => this.handleClick(classObj));
    }

    injectHamburger() {
        const figure = document.querySelector('.dp-figure');
        if (!figure) return;

        const hamburgerBtn = document.createElement('button');
        hamburgerBtn.type = 'button';
        hamburgerBtn.ariaLabel = 'hamburger menu';
        hamburgerBtn.classList.add('cmp-td-hamburgerMenu');

        const hamIcon = document.createElement('i');
        hamIcon.classList.add('fas', 'fa-bars');
        hamburgerBtn.append(hamIcon);

        figure.parentNode.insertBefore(hamburgerBtn, figure);
        return hamburgerBtn;
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
