import $ from 'jquery';

export default function Acoordion(el) {
    this.el = el;
    // console.log(el);
    this.initEventHandlers();
}

Object.assign(Acoordion.prototype, {
    initEventHandlers() {
        this.accordionButton = this.el.querySelectorAll('.cmp-accordion__button');
        this.accordionPanel = this.el.querySelectorAll('.cmp-accordion__panel');
        // console.log(this.accordionButton.length);
        for(let i = 0; i< this.accordionButton.length; i++){
          this.accordionButton[i].addEventListener('click', e => {
                    this.sampleFunction(i);
                })
        }
        // this.el.querySelectorAll('.cmp-accordion__button')
        //     .forEach((el, index) => el.addEventListener('click', e => {
        //         this.sampleFunction(e, index);
        //         console.log(index);
        //     }
        // ));
    },

    sampleFunction(index){
        // e.preventDefault();
        // alert("sample Text", index);
        // this.el.querySelectorAll('.cmp-accordion__panel')
        this.accordionPanel[index].classList.toggle('cmp-accordion__panel--hidden');
    }
});
