import { useRef } from "react";


// hook for extend base grid with filtering functionality
export default function useRenewalFiltering() {

    const resetCallback = useRef(null);
    const shouldGoToFirstPage =useRef(false);


    function onAfterGridInit(config) {
        resetCallback.current = config.gridResetRequest;
        clearFilterResults.current= false;
    }

    function onQueryChanged({goToFirstPage = false} = false) {
        if (goToFirstPage) shouldGoToFirstPage.current = true; 
        if (resetCallback.current) resetCallback.current();        
    } 

    function handleQueryFlowLogic(){
        const initialRequest = shouldGoToFirstPage.current;
        return {initialRequest};
    }

    return { onAfterGridInit, onQueryChanged, handleQueryFlowLogic };
}
