import { useRef } from "react";
import { useRenewalGridState } from "../../RenewalsGrid/store/RenewalsStore";


// hook for extend base grid with filtering functionality
export default function useRenewalFiltering() {

    const resetCallback = useRef(null);
    const shouldGoToFirstPage =useRef(false);
    const isOnSearchAction = useRef(false);
    const effects = useRenewalGridState(state => state.effects);


    function onAfterGridInit(config) {
        resetCallback.current = config.gridResetRequest;
        shouldGoToFirstPage.current= false;
        effects.setCustomState({key:'resetGrid', value:resetCallback.current});
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
