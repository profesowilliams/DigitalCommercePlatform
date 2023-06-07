import { useRef } from "react";
import { useRenewalGridState } from "../../RenewalsGrid/store/RenewalsStore";

/**
 * This hook extends the base grid operations and preserves the functionality of filtering, searching, and pagination. 
 * A microstore, such as renewalsGrid, renewalDetails, or ordertrackinggrid, can be utilized for each individual grid module.
 */
export default function useExtendGridOperations(store) {

    const resetCallback = useRef(null);
    const shouldGoToFirstPage =useRef(false);
    const isOnSearchAction = useRef(false);
    const defaultConfig = {goToFirstPage: false, onSearchAction: false};   
    const effects = store(state => state.effects);

    function resetGrid(){
        if (resetCallback.current) resetCallback.current();
    }

    function onAfterGridInit(config) {
        resetCallback.current = config.gridResetRequest;
        shouldGoToFirstPage.current= false;
        effects.setCustomState({key:'resetGrid', value:resetCallback.current});
    }

    function onQueryChanged(config) {
        const {goToFirstPage, onSearchAction} = config || defaultConfig;
        if (goToFirstPage) shouldGoToFirstPage.current = true; 
        isOnSearchAction.current = onSearchAction;              
        if (resetCallback.current) resetCallback.current();        
    } 

    function onOrderQueryChanged() {    
        const {onSearchAction} = store || defaultConfig;
        shouldGoToFirstPage.current = true; 
        isOnSearchAction.current = onSearchAction;              
        if (resetCallback.current) resetCallback.current();        
    } 

    function handleQueryFlowLogic(){
        const onFiltersClear = shouldGoToFirstPage.current;       
        return {onFiltersClear, onSearchAction:isOnSearchAction.current};
    }

    return { onAfterGridInit, onQueryChanged, handleQueryFlowLogic, resetGrid, onOrderQueryChanged };
}
