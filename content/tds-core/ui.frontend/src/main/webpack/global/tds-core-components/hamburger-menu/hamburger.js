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
        // Get the elements we need from the DOM
        const figure = document.querySelector('.dp-figure');
        const navbar = document.querySelector('#cmp-techdata-header');
      
        // If the elements are not found, return early
        if (!figure || !navbar) return;
      
        // Create the menu icon element
        const menuIcon = document.createElement('div');
        // Add the "menu-icon" class to the element
        menuIcon.classList.add('menu-icon');
      
        // Create the input element for the checkbox
        const inputCheckbox = document.createElement('input');
        // Add the "menu-icon__checkbox" class to the input element
        inputCheckbox.classList.add('menu-icon__checkbox');
        // Set the type of the input element to "checkbox"
        inputCheckbox.type = 'checkbox';
      
        // Create the inner div element for the two span elements
        const innerDiv = document.createElement('div');
        const span1 = document.createElement('span');
        const span2 = document.createElement('span');
        innerDiv.appendChild(span1);
        innerDiv.appendChild(span2);
      
        // Append the input and inner div elements to the menu icon element
        menuIcon.appendChild(inputCheckbox);
        menuIcon.appendChild(innerDiv);
      
        // Insert the menu icon element into the DOM before the figure element
        figure.parentNode.insertBefore(menuIcon, figure);
      
        // Return the menu icon element
        return menuIcon;
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
