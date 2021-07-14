export default class MegamenuMobile {
    constructor() {
        this.log('initialized mobile megamenu');
        const mm = this.mm = document.querySelector('.megamenu');
        this.init(mm);
        this.showCls = 'active-md';
        this.hideCls = 'inactive-md';
        mm.addEventListener('click', (e) => this.handleNavigationClick(e));
        mm.addEventListener('click', (e) => this.handleBackBtnClick(e, mm));
    }

    init(el) {
        if (!el) return;

        this.handlePrimary(el);
    }

    log(str) {
        console.info(str);
    }

    toggleClass(el, action) {
        if (action === 'show') {
            if (el.classList.contains(this.hideCls)) {
                el.classList.remove(this.hideCls);
            }
            el.classList.add(this.showCls);
        } else {
            if (el.classList.contains(this.showCls)) {
                el.classList.remove(this.showCls);
            }
            el.classList.add(this.hideCls);
        }
    }

    handleBackBtnClick(event, el) {
        event.preventDefault();

        const backBtn = event.target.closest('.cmp-megamenu__back');

        if (!backBtn) return;
        backBtn.style.opacity = 0;

        const allSecondaryMenu = el.querySelectorAll('.cmp-megamenu__secondary');
        allSecondaryMenu?.forEach(menu => {
            this.toggleClass(menu, 'hide');
        })
        this.toggleClass(el.querySelector('.cmp-megamenu__primary'), 'show');
        this.toggleClass(el.querySelector('.cmp-megamenu__title'), 'show');
        this.removeOpenedMenus(el, this.primary);
    }

    removeOpenedMenus(el, primary) {
        if (primary.length <= 0) {
            return;
        }

        const secondary = el.querySelector(`[data-cmp-parent="${primary}"] .cmp-megamenu__secondary`);
        const navGroup = secondary?.querySelector('.cmp-navigation__group');

        if (navGroup) {
            this.removeActiveClass(navGroup);
        }
    }

    removeActiveClass(activeEl) {
        const listArray = Array.from(activeEl.children);
        listArray.forEach(item => {
            if (item.classList.contains('active')) {
                item.classList.remove('active');
            }

            const navGroup = item.querySelector('.cmp-navigation__group');
            if(navGroup) {
                if (navGroup.classList.contains('active-md')) {
                    navGroup.classList.remove('active-md');
                }
                this.removeActiveClass(navGroup);
            };
        });
    }

    handlePrimary(el) {
        const mmPrimaryList = el?.querySelectorAll('.cmp-megamenu__primary li');
        mmPrimaryList.forEach(list => {
            list.addEventListener('click', () => {
                // capturing primary as I need a reference later to close by opened menu
                const primary = this.primary = list.querySelector('[data-cmp-children]')?.dataset.cmpChildren;
                this.toggleClass(list.parentNode, 'hide');
                this.toggleClass(el.querySelector('.cmp-megamenu__title'), 'hide');

                // grab chevron and show it.
                const backBtn = el.querySelector('.cmp-megamenu__back');
                backBtn.style.opacity = 1;

                // show secondary
                this.toggleClass(el.querySelector(`[data-cmp-parent="${primary}"] .cmp-megamenu__secondary`), 'show');
                this.appendTitleAndSubTitle(el, primary);
                this.checkSubMenu(el, primary);
            })
        });
    }

    appendTitleAndSubTitle(el, type) {
        const secondaryEl = el.querySelector(`[data-cmp-parent="${type}"] .cmp-megamenu__secondary`);

        if (el.querySelector(`[data-cmp-parent="${type}"] .cmp-megamenu__secondary--title`) ||
            el.querySelector(`[data-cmp-parent="${type}"] .cmp-megamenu__secondary--sub-title`)) {
            return;
        }

        const title = document.createElement('div');
        title.className = 'cmp-megamenu__secondary--title';
        title.innerHTML = type;

        const subTitle = document.createElement('div');
        subTitle.className = 'cmp-megamenu__secondary--sub-title';
        subTitle.innerHTML = `${type} home`;

        secondaryEl.insertBefore(subTitle, secondaryEl.firstChild);
        secondaryEl.insertBefore(title, secondaryEl.firstChild);
    }

    checkSubMenu(el, type) {
        const secMenu = el.querySelectorAll(`[data-cmp-parent="${type}"] .cmp-megamenu__secondary >.cmp-navigation__group`)[0];
        this.appendChevron(secMenu);
    }

    appendChevron(el) {
        const listArray = Array.from(el?.children);
        listArray.forEach(item => {
            const navGroup = item.querySelector('.cmp-navigation__group');
            if(navGroup) {
                item.classList.add('has-child');
                this.appendChevron(navGroup);
            };
        });
    }

    handleNavigationClick(event) {
        event.preventDefault();

        let isList = event.target.closest('.cmp-navigation__item');
        const ACTIVE_CLASS = 'active';

        if (!isList) return;
        if (!isList.classList.contains('cmp-navigation__item')) return;

        const subMenu = isList.querySelector('.cmp-navigation__group');

        if (subMenu) {
            if (isList.classList.contains(ACTIVE_CLASS)) {
                isList.classList.remove(ACTIVE_CLASS);
                this.toggleClass(subMenu, 'hide');
            } else {
                isList.classList.add(ACTIVE_CLASS);
                this.toggleClass(subMenu, 'show');
            }
        }
    }
}