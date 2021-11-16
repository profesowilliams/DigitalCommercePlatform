import { Subject } from "../../../../../../utils/Subject";

export class ExportItemXlsSubject extends Subject{
    itemList = [];
    static _instance;
    constructor(){
        super();
    }
    static get instance(){
        return this._instance || (this._instance = new this());
    }
    static setItemList(newCheckboxList){
        const itemList = newCheckboxList.filter(col => col.checked).map(col => col.columnKey);
        this.instance.itemList = itemList;
        this.notify(this.instance.itemList);
    }
}
