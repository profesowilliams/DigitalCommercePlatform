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
        document.addEventListener('click', (e) => this.hideWhenOutside(e, classObj));
    }

    injectHamburger() {
        const figure = document.querySelector('.dp-figure');
        const navbar = document.querySelector('#cmp-techdata-header');

        if (!figure || !navbar) return;

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

    hideMegaMenu(active, open) {
        this.el?.classList.remove(active);
        this.containerEl?.classList.remove(open);
        this.open = false;
        if (this.el?.closest('.aem-Grid')) {
            this.el?.closest('.aem-Grid').classList.remove('header-active');
        }
    }

    handleClick({active, open}) {
        if (!this.open) {
            this.el.classList.add(active);
            this.containerEl.classList.add(open);
            this.open = true;
            if (this.el?.closest('.aem-Grid')) {
                this.el?.closest('.aem-Grid').classList.add('header-active');
            }

        } else {
            this.hideMegaMenu(active, open);
        }
    }

    hideWhenOutside(event, classObj) {
        const isInsideMenu = event.target.closest('.cmp-megamenu__body');
        const isHamburgerBtn = event.target.closest('.cmp-td-hamburgerMenu');
        const headerActive =  event.target.closest('.header-active');
        const {active, open} = classObj;

        if (isInsideMenu || isHamburgerBtn || headerActive) return;
        this.hideMegaMenu(active, open);
    }
}
