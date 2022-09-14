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
        window.addEventListener('scroll', () => this.handleStickyHeader());
        // this.initSecondaryImage();

        this.header = document.getElementById('cmp-techdata-header');
        this.headerHeight = document.body.getAttribute("data-header-height");
        this.header.classList.add('cmp-experiencefragment__header--sticky');

        this.subheader = document.getElementsByClassName('cmp-sub-header--sub-nav')[0];
        this.currentTop = this.subheader ? this.subheader.getBoundingClientRect().top : 0;
        this.isSubheaderSticky = this.subheader ? false : null;
        this.carouselList = document.querySelectorAll(".aem-Grid .container .cmp-carousel");

        this.checkHeaderImage();
    }

    headerResize() {
        if (bp.tablet()) {
            this.headerEl?.classList.add(this.HEADER_MOBILE);
        } else {
            this.headerEl?.classList.remove(this.HEADER_MOBILE);
        }
    }
// Comment on this block to preserve big logo on mobile for the new composition with the new searchBar component
/*     initSecondaryImage() {
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
    } */

    toggleSearch(el) {
        if (hasSomeParentTheClass(el, this.HEADER_MOBILE)) {
            el.classList.add('active');
            document.querySelector('.cmp-header--logo-small')?.classList.add('active');
            // Comment on this block to preserve big logo on mobile for the new composition with the new searchBar component
            //document.querySelector('.dp-figure').style.display = 'none';
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

    handleStickyHeader() {
        if(this.header && this.subheader){
            this.checkHeaderSubheader();
        }

        if(this.header && this.carouselList.length > 0){
            this.checkHeaderImage();
        }
    }

    checkHeaderSubheader(){
        if(this.header.getBoundingClientRect().bottom >= this.subheader.getBoundingClientRect().top){
            if(this.isSubheaderSticky && window.pageYOffset <= this.currentTop-this.headerHeight){
                this.subheader.classList.remove('cmp-experiencefragment__subheader--sticky');
                this.isSubheaderSticky = false;
            }
            else{
                this.subheader.classList.add('cmp-experiencefragment__subheader--sticky');
                this.isSubheaderSticky = true;
            }
        }
        else{
            this.subheader.classList.remove('cmp-experiencefragment__subheader--sticky');
        }
    }

    checkHeaderImage(){
        const carouselArray = Array.from(this.carouselList);
        const headerBottom = this.header.getBoundingClientRect().bottom;

        const carousels = carouselArray.filter(function (carousel){
            return headerBottom >= carousel.getBoundingClientRect().top && carousel.getBoundingClientRect().bottom > 0;
        });

        if (carousels.length > 0){
            this.header.classList.add('cmp-experiencefragment__header--sticky--opaque');
        }
        else{
            this.header.classList.remove('cmp-experiencefragment__header--sticky--opaque');
        }
    }
}
