
import React, {useState, useEffect} from "react";
import { ExportItemXlsSubject } from "../store/ExportItemsXls";

export const useItemListExportState = () => {
    const [state,setState] = useState();
    const observer = (payload) => {
        setState(payload)
    }
    useEffect(() => {
        ExportItemXlsSubject.subscribe(observer);
        return () => ExportItemXlsSubject.unsubscribe(observer);
    }, [])
    return {lineItems:state};
}

export const useLineItemExport = (columnList) => {
    const cols = () => columnList.map(col => ({ ...col, checked: true }));
    const [checkboxList, setCheckboxList] = useState(cols);
    const [selectAllState, setSelectAllState] = useState('Deselect all');
    useEffect(()=>{
        ExportItemXlsSubject.setItemList(checkboxList);
    },[])
    function updateCheckboxList  (event) {
        const id = event.target.id;
        const index = checkboxList.findIndex(col => col.columnKey == id);
        const newCheckboxList = [...checkboxList];
        if (index >= 0) {
            newCheckboxList[index] = { ...newCheckboxList[index], checked: !newCheckboxList[index]?.checked };
        }
        setCheckboxList(newCheckboxList);
        ExportItemXlsSubject.setItemList(newCheckboxList);
    };
    function switchSelectAll  () {
        let newCheckboxList = [];
        let selectedState = selectAllState;
        if (selectedState === "Select all") {
            newCheckboxList = [...checkboxList].map(col => ({ ...col, checked: true }));
            selectedState = 'Deselect all';
        } else if (selectedState === "Deselect all") {
            newCheckboxList = [...checkboxList].map(col => ({ ...col, checked: false }));
            selectedState = "Select all";
        }
        setSelectAllState(selectedState);
        setCheckboxList(newCheckboxList);
        ExportItemXlsSubject.setItemList(newCheckboxList);

    };
    function itemsSelected () {
        return checkboxList.map(c => c.checked).filter(c => c).length;
    };
    return {checkboxList,selectAllState,updateCheckboxList,switchSelectAll, itemsSelected}
  }