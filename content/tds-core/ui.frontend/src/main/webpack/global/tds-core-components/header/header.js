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
        if (this.detectMobileView()) {
            this.initSecondaryImage();
        }
        this.header = document.getElementById('cmp-techdata-header');
        this.authorColor = this.header.style.backgroundColor;

        this.setComponentToStick();
        this.checkSubheaderContainer();
        this.checkSubheaderTransparency();
    }

    setComponentToStick(){
        const masthead =  document.querySelector('.masthead');
        const mastheadContainer = masthead.querySelector('.cmp-container');
        this.stickyHeaderFlag = mastheadContainer.dataset.stickyHeaderflag;

        this.isSubheaderTransparency = false;
        this.componentToStick = document.getElementById(mastheadContainer.dataset.stickyComponentid);
        this.componentToStickTop = this.componentToStick ? this.componentToStick.getBoundingClientRect().top : null;

        if(this.stickyHeaderFlag === "true"){
            this.header.classList.add('cmp-experiencefragment__header--sticky');
        }
    }

    checkSubheaderContainer(){
        const aemGrid = document.querySelector(".aem-Grid");
        this.subheaderList = aemGrid.querySelectorAll(".subheader");
        this.subheader = this.subheaderList[0];

        if(!this.subheader.previousElementSibling){
            if(!this.subheader.closest(".experiencefragment")){
                this.container = this.subheader.closest(".container") ? this.subheader.closest(".container").previousElementSibling : null;
            }
            else{
                this.container = this.subheader.closest(".experiencefragment") ? this.subheader.closest(".experiencefragment").previousElementSibling : null;
            }
        }
        else{
            this.container = this.subheader ? this.subheader.previousElementSibling : null;
        }
    }

    checkSubheaderTransparency(){
        if(this.header && this.subheader && this.container){
            this.subheaderNav = this.subheader.querySelector('.cmp-tabs');
            this.subheaderNav.style.marginTop = "-"+this.subheaderNav.clientHeight+"px";
            this.isComponentStuck = false;

            if(this.container.classList.contains("container") || this.container.classList.contains("teaser")){
                this.isContainer = true;
                if(this.stickyHeaderFlag === "true"){ 
                    this.checkHeaderImage();
                } 
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
            this.subheaderNav.style.top = this.header.clientHeight + this.subheaderNav.clientHeight + "px";
            this.subheaderNav.style.width = this.container.clientWidth + "px";
        }
    }

    detectMobileView() {
        /* Storing user's device details in a variable*/
        const details = navigator.userAgent;
        
        /* Creating a regular expression
        containing some mobile devices keywords
        to search it in details string*/
        const regexp = /android|iphone|kindle|ipad/i;
        
        /* Using test() method to search regexp in details
        it returns boolean value*/
        const isMobileDevice = regexp.test(details);
        return isMobileDevice
    }
    
    // Comment on this block to preserve big logo on mobile for the new composition with the new searchBar component
    initSecondaryImage() {
        const figure = document.querySelectorAll('.dp-figure');
        if (!figure) return;
        const images = [];
        figure.forEach(f => {
            images.push(f);
        });

        if (images.length === 0) return;
        images.forEach(image => {
            const imgEl = image.querySelector('[data-mobile-logo]');
            if (!imgEl) return;
            const smallLogo = imgEl.dataset.mobileLogo;
            const img = document.createElement('img');
            img.classList.add('cmp-header--logo-small');
            image.style.display='none';
            insertAfter(img, image );
            img.src = smallLogo;
        });
    }

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
        if(this.header && this.isContainer && this.subheader && this.stickyHeaderFlag === "true"){
            this.checkHeaderImage();
        }
        if(this.stickyHeaderFlag === "true" && this.componentToStick){
            this.checkHeaderSubheader();
        }
    }

    checkHeaderSubheader(){
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
                this.componentToStick.style.width = this.container.clientWidth + "px";
                this.componentToStick.classList.add('sticky');
                if(this.subheaderNav.id === this.componentToStick.id){
                    this.componentToStick.classList.remove('cmp-experiencefragment__subheader--sticky--opaque');
                }
                this.isComponentStuck = true;
            }
        }
    }

    checkHeaderImage(){
        if(this.header.getBoundingClientRect().bottom >= this.container.getBoundingClientRect().top && this.container.getBoundingClientRect().bottom > 0 && window.pageYOffset == 0){
            this.header.classList.add('cmp-experiencefragment__header--sticky--opaque');
            this.header.style.backgroundColor = this.authorColor;
        }
        else {
            var rgb = this.authorColor.replace(/^rgba?\(|\s+|\)$/g,'').split(',');
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
