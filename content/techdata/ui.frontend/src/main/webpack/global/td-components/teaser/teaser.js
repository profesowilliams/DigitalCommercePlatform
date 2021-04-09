import $ from 'jquery';

export default function Teaser(el) {
    this.el = el;
    console.log(el);
    this.initEventHandlers();
}

Object.assign(Teaser.prototype, {
    initEventHandlers() {
        
        this.el.querySelectorAll('.cmp-teaser__action-link')
            .forEach(el => el.addEventListener('click', (e) => {
                this.sampleFunction(e);
            }
        ));
    },
    
    sampleFunction(e){
        e.preventDefault();
        alert("I am clicked");
    }
});