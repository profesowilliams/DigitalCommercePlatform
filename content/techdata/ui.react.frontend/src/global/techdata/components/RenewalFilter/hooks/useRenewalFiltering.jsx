import { useRef } from "react";


// hook for extend base grid with filtering functionality
export default function useRenewalFiltering() {

    const resetCallback = useRef(null);
    const shouldGoToFirstPage =useRef(false);
    const isOnSearchAction = useRef(false);


    function onAfterGridInit(config) {
        resetCallback.current = config.gridResetRequest;
        shouldGoToFirstPage.current= false;
    }

    function onQueryChanged(config) {
        const defaultConfig = {goToFirstPage: false, onSearchAction: false};        
        const {goToFirstPage, onSearchAction} = config || defaultConfig;
        if (goToFirstPage) shouldGoToFirstPage.current = true; 
        isOnSearchAction.current = onSearchAction;              
        if (resetCallback.current) resetCallback.current();        
    } 

    function handleQueryFlowLogic(){
        const onFiltersClear = shouldGoToFirstPage.current;       
        return {onFiltersClear, onSearchAction:isOnSearchAction.current};
    }

    return { onAfterGridInit, onQueryChanged, handleQueryFlowLogic };
}
