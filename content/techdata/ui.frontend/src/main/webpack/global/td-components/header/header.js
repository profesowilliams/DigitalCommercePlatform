import bp from '../../../common-utils/js/media-match';
import insertAfter, { hasSomeParentTheClass } from '../../../common-utils/js/helper';

export default class Header {
    constructor() {
        this.headerEl = document.querySelector('#cmp-techdata-header');
        this.searchEl = document.querySelector('#cmp-techdata-header .search');
        this.HEADER_MOBILE = 'cmp-experiencefragment--header-mobile';
        
        this.headerResize();
        window.addEventListener('resize', () => this.headerResize());
        this.searchEl?.addEventListener('click', () => this.toggleSearch(this.searchEl));
        document.addEventListener('click', (event) => this.showSearchIconOnly(event, this.searchEl));
        this.initSecondaryImage();
    }

    headerResize() {
        if (bp.tablet()) {
            this.headerEl?.classList.add(this.HEADER_MOBILE);
        } else {
            this.headerEl?.classList.remove(this.HEADER_MOBILE);
        }
    }

    initSecondaryImage() {
        const imgEl = document.querySelector('[data-mobile-logo]');
        if (imgEl) {
            const smallLogo = imgEl.dataset.mobileLogo;
            const img = document.createElement('img');
            img.classList.add('cmp-header--logo-small');

            const figure = document.querySelector('.dp-figure');
            if (!figure) return;
            insertAfter(img, figure);
            img.src = smallLogo;
        }
    }

    toggleSearch(el) {
        if (hasSomeParentTheClass(el, this.HEADER_MOBILE)) {
            el.classList.add('active');
            document.querySelector('.cmp-header--logo-small')?.classList.add('active');
            document.querySelector('.dp-figure').style.display = 'none';
        }
    }

    showSearchIconOnly(event, el) {
        if (bp.desktop()) {
            return;
        }

        if (hasSomeParentTheClass(el, this.HEADER_MOBILE)) {
            if (!el.contains(event.target)) {
                el.classList.remove('active');
                document.querySelector('.cmp-header--logo-small')?.classList.remove('active');
                document.querySelector('.dp-figure').style.display = 'block';
            }
        }
    }
}
