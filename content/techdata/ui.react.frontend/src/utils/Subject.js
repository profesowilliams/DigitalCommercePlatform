export class Subject {
    constructor() {
        this.observer = [];
    }
    static subscribe(fn){
        this.instance.observer.push(fn);
    }
    static unsubscribe(fn){
        this.instance.observer = this.instance.observer.filter(obj => obj !== fn);
    }
    static notify(metadata){
        this.instance.observer.forEach(fn => fn(metadata));
    }
}



