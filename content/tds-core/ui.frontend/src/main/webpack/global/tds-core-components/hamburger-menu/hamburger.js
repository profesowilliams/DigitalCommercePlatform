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
        this.headerResize();
        window.addEventListener('resize', () => this.headerResize());

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
        if (this.el?.closest('.cmp-container')) {
            this.el?.closest('.cmp-container').classList.remove('header-active');
            document.dispatchEvent(new CustomEvent('header-closed'));
            this.headerResize();
        }
    }


    updateHeaderLogo(mobileFlag) {
        const tdsSiteheader = document.querySelector('.cmp-tds-site-header');
        if (tdsSiteheader && tdsSiteheader.querySelector('.header-active')) {
            const tdsSiteHeaderLogo = tdsSiteheader.querySelector('.masthead .cmp-image__link img');
            if (mobileFlag && tdsSiteHeaderLogo) {
                const desktopLogo = tdsSiteHeaderLogo?.getAttribute('src');
                const mobileLogo = tdsSiteHeaderLogo?.dataset?.mobileLogo;
                tdsSiteHeaderLogo.src = mobileLogo;
                tdsSiteHeaderLogo.dataset.desktopLogo = desktopLogo;
            } else {
                if (tdsSiteHeaderLogo?.dataset?.desktopLogo) {
                    const desktopLogo = tdsSiteHeaderLogo?.dataset?.desktopLogo;
                    tdsSiteHeaderLogo.src = desktopLogo;
                }
            }
        } else {
            const tdsSiteHeaderLogo = tdsSiteheader?.querySelector('.masthead .cmp-image__link img');
            if (tdsSiteHeaderLogo?.dataset?.desktopLogo) {
                const desktopLogo = tdsSiteHeaderLogo?.dataset?.desktopLogo;
                tdsSiteHeaderLogo.src = desktopLogo;
            }
        }
    }

    headerResize() {
        var $this = this;
        setTimeout(function() {
            if (window.matchMedia("(max-width:1023px)").matches) {
               $this.updateHeaderLogo(true);
            } else {
                $this.updateHeaderLogo(false);
            }
        }, 100);
    }

    handleClick({active, open}) {
        if (!this.open) {
            this.el.classList.add(active);
            this.containerEl.classList.add(open);
            this.open = true;
            if (this.el?.closest('.cmp-container')) {
                this.el?.closest('.cmp-container').classList.add('header-active');
                this.headerResize();
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

      if (isInsideMenu || isHamburgerBtn || headerActive) {
        return;
      }
      this.hideMegaMenu(active, open);
    }
}
