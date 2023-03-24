import bp from '../../../common-utils/js/media-match';
import insertAfter, { hasSomeParentTheClass } from '../../../common-utils/js/helper';

export default class Header {
    constructor() {
        this.headerEl = document.querySelector('#cmp-techdata-header');
        this.searchEl = document.querySelector('#cmp-techdata-header .search');
        this.HEADER_MOBILE = 'cmp-experiencefragment--header-mobile';
        this.masthead = document.querySelector('.masthead');

        this.headerResize();
        window.addEventListener('resize', () => this.headerResize());
        this.searchEl?.addEventListener('click', () => this.toggleSearch(this.searchEl));
        document.addEventListener('click', (event) => this.showSearchIconOnly(event, this.searchEl));
        window.addEventListener('scroll', () => this.handleStickyHeader());

        this.header = document.getElementById('cmp-techdata-header');
        if (!this.header) return;
        this.authorColor = this.header.style.backgroundColor;

        if(this.masthead !== undefined && this.masthead !== null) {
            this.setComponentToStick();
            this.checkSubheaderContainer();
            this.setSubheaderMargin();
            this.checkHeaderImage();
        }

        this.isComponentStuck = false;
    }

    setComponentToStick(){
        const mastheadContainer = this.masthead.querySelector('.cmp-container');
        this.stickyHeaderFlag = mastheadContainer.dataset.stickyHeaderflag;
    
        this.isSubheaderTransparency = false;
        this.componentToStick = document.getElementById(mastheadContainer.dataset.stickyComponentid);
    
        if (this.componentToStick) {
            this.componentToStickTop = this.componentToStick.getBoundingClientRect().top;
        } else {
            this.componentToStickTop = null;
        }
    
        if(this.stickyHeaderFlag === "true"){
            this.header.classList.add('cmp-experiencefragment__header--sticky');
        }
    }    

    checkSubheaderContainer(){
        const aemGrid = document.querySelector(".aem-Grid");
        this.subheaderList = aemGrid.querySelectorAll(".subheader");
        this.subheader = this.subheaderList[0];

        if(this.subheader){
            if(!this.subheader.previousElementSibling){
                if(!this.subheader.closest(".experiencefragment")){
                    this.container = this.subheader.closest(".container") ? this.subheader.closest(".container").previousElementSibling : null;
                }
                else{
                    this.container = this.subheader.closest(".experiencefragment") ? this.subheader.closest(".experiencefragment").previousElementSibling : null;
                }
            }
            else{
                this.container = this.subheader.previousElementSibling;
            }
        }
    }

    setSubheaderMargin(){
        if(this.header){
            if(this.subheader && this.container){
                if(this.container.classList.contains("container")){
                    this.isContainer = true;
                    this.subheaderNav = this.subheader.querySelector('.cmp-tabs');
                    this.subheaderNav.style.marginTop = "-"+this.subheaderNav.clientHeight+"px";
                    if(this.stickyHeaderFlag === "true"){ 
                        this.checkHeaderImage();
                    } 
                    this.checkSubheaderImage();
                }
                else{
                    this.checkHeaderComponent();
                }
            }
            else {
                this.checkHeaderComponent();
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
            this.subheaderNav.style.top = this.header.clientHeight + this.subheaderNav.clientHeight + "px";
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
        if(this.header){
            this.checkHeaderImage();
            if(this.subheader && this.isContainer){
                this.checkHeaderSubheader();
            }
            else if(this.componentToStick){
                this.checkHeaderComponent();
            }
        }
    }

    checkHeaderComponent(){
        if (this.componentToStick) {
            if(this.header.getBoundingClientRect().bottom >= this.componentToStick.getBoundingClientRect().top){
                if(this.isComponentStuck && window.pageYOffset <= this.componentToStickTop - (2*this.header.clientHeight)){
                    this.componentToStick.classList.remove('sticky');
                    this.isComponentStuck = false;
                }
                else{
                    this.componentToStick.style.top = this.header.clientHeight + "px";
                    this.componentToStick.classList.add('sticky');
                    this.isComponentStuck = true;
                }
            }
        }
    }
    

    checkHeaderSubheader(){
        if(this.componentToStick){
            if(this.header.getBoundingClientRect().bottom >= this.componentToStick.getBoundingClientRect().top){
                if(this.isComponentStuck && window.pageYOffset <= this.componentToStickTop - (2*this.header.clientHeight) - this.subheaderNav.clientHeight){
                    if(this.subheaderNav.id === this.componentToStick.id){
                        this.componentToStick.classList.add('cmp-experiencefragment__subheader--sticky--opaque');
                    }
                    this.componentToStick.classList.remove('sticky');
                    this.isComponentStuck = false;
                }
                else{
                    if(this.isSubheaderTransparency){
                        this.componentToStick.style.top = this.header.clientHeight + this.subheaderNav.clientHeight+ "px"; 
                    }
                    else{
                        this.componentToStick.style.top = this.header.clientHeight + "px";
                    }
                    this.componentToStick.classList.add('sticky');
                    if(this.subheaderNav.id === this.componentToStick.id){
                        this.componentToStick.classList.remove('cmp-experiencefragment__subheader--sticky--opaque');
                    }
                    this.isComponentStuck = true;
                }
            }
        }
    }

    checkHeaderImage(){
        var rgb = this.authorColor.replace(/^rgba?\(|\s+|\)$/g,'').split(',');
        if(this.isContainer){
            if(this.header.getBoundingClientRect().bottom >= this.container.getBoundingClientRect().top && this.container.getBoundingClientRect().bottom > 0 && window.pageYOffset == 0){
                this.header.classList.add('cmp-experiencefragment__header--sticky--opaque');
                this.header.style.backgroundColor = this.authorColor;
            }
            else {
                this.header.style.backgroundColor = "rgba(".concat(rgb.slice(0, -1).join(',')).concat(",1)");
                this.header.classList.remove('cmp-experiencefragment__header--sticky--opaque');
            }
        }
        else{
            this.header.style.backgroundColor = "rgba(".concat(rgb.slice(0, -1).join(',')).concat(",1)");
            this.header.classList.remove('cmp-experiencefragment__header--sticky--opaque');
        }
    }

    checkSubheaderImage(){
        if(this.subheaderNav.getBoundingClientRect().top + parseInt(this.subheaderNav.style.marginTop,10) <= this.container.getBoundingClientRect().bottom){
            if(this.subheaderNav && this.componentToStick){
                if(this.subheaderNav.id === this.componentToStick.id){
                    this.isSubheaderTransparency = true;
                }
            }
            this.subheaderNav.classList.add('cmp-experiencefragment__subheader--sticky--opaque');
        }
    }
}
