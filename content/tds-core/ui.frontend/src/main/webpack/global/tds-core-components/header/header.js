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
        this.header.classList.add('cmp-experiencefragment__header--sticky');
        
        const aemGrid = document.querySelector(".aem-Grid");
        this.subheaderList = aemGrid.querySelectorAll(".subheader");
        this.subheader = this.subheaderList[0];
        this.container = this.subheader ? this.subheader.previousElementSibling : null;

        if(this.header && this.subheader && this.container){
            this.subheaderNav = this.subheader.querySelector('.cmp-sub-header--sub-nav');
            this.subheaderNav.style.marginTop = "-"+this.subheaderNav.clientHeight+"px";
            this.isSubheaderSticky = false;

            if(this.container.classList.contains("container") || this.container.classList.contains("teaser")){
                this.isContainer = true;
                this.checkHeaderImage();
                this.checkSubheaderImage();  
            }
        }
    }

    headerResize() {
        if (bp.tablet()) {
            this.headerEl?.classList.add(this.HEADER_MOBILE);
        } else {
            this.headerEl?.classList.remove(this.HEADER_MOBILE);
        }

        if(this.header && this.subheaderNav && this.container){
            this.subheaderNav.style.width = this.container.clientWidth + "px";
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
        if(this.header && this.isContainer && this.subheader){
            this.checkHeaderImage();
            this.checkHeaderSubheader();
        }
    }

    checkHeaderSubheader(){
        if(this.header.getBoundingClientRect().bottom >= this.subheaderNav.getBoundingClientRect().top){
            if(this.isSubheaderSticky && window.pageYOffset <= this.container.clientHeight - this.subheaderNav.clientHeight - this.header.clientHeight){
                this.subheaderNav.classList.add('cmp-experiencefragment__subheader--sticky--opaque');
                this.subheaderNav.classList.remove('cmp-experiencefragment__subheader--sticky');
                this.isSubheaderSticky = false;
            }
            else{
                this.subheaderNav.style.width = this.container.clientWidth + "px";
                this.subheaderNav.style.top = this.header.clientHeight + this.subheaderNav.clientHeight + "px";
                this.subheaderNav.classList.add('cmp-experiencefragment__subheader--sticky');
                this.subheaderNav.classList.remove('cmp-experiencefragment__subheader--sticky--opaque');
                this.isSubheaderSticky = true;
            }
        }
    }

    checkHeaderImage(){
        if(this.header.getBoundingClientRect().bottom >= this.container.getBoundingClientRect().top && this.container.getBoundingClientRect().bottom > 0 && window.pageYOffset == 0){
            this.header.classList.add('cmp-experiencefragment__header--sticky--opaque');
        }
        else{
            this.header.classList.remove('cmp-experiencefragment__header--sticky--opaque');
        }
    }

    checkSubheaderImage(){
        if(this.subheaderNav.getBoundingClientRect().top + parseInt(this.subheaderNav.style.marginTop,10) <= this.container.getBoundingClientRect().bottom){
            this.subheaderNav.classList.add('cmp-experiencefragment__subheader--sticky--opaque');
        }
    }
}
