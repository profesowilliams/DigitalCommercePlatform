import React from "react";
import { useRenewalGridState } from "../../RenewalsGrid/store/RenewalsStore";
import { getLocalStorageData } from "../../RenewalsGrid/utils/renewalUtils";
import { FILTER_LOCAL_STORAGE_KEY } from "../../../../../utils/constants"

export default function useFilteringSelected(){
    const customStartDate = useRenewalGridState((state) => state.customStartDate);
    const filterList = useRenewalGridState((state) => state.filterList);
    const customEndDate = useRenewalGridState((state) => state.customEndDate);
    const dateSelected = useRenewalGridState((state) => state.dateSelected);    
 
    const isDateSelectedOrApplied = () => {
      const isRangeDateSelected = (customStartDate !== null && customEndDate !== null);        
      const hasDateApplied = getLocalStorageData(FILTER_LOCAL_STORAGE_KEY)?.dateSelected !== null;
      const hasDateSelected = dateSelected === 'custom' ? isRangeDateSelected : !!dateSelected;
      return hasDateSelected || hasDateApplied;
    }    

    const hasAnyFilterApplied = () => {
      const noChildIds = filterList.filter(filter => !filter.childIds.length);        
      return noChildIds.some((filter) => filter.checked || filter.applied) || isDateSelectedOrApplied();
    }

    const hasDateFilterChangeAvailable = () => {
      const localFilters = getLocalStorageData(FILTER_LOCAL_STORAGE_KEY);
      const hasCustomSelected = dateSelected === 'custom';
      const hasLocalDateApplied = localFilters?.dateSelected;  
      const hasValidCustomRange = hasCustomSelected && !!(customStartDate && customEndDate);          
      let hasDateChangeToApply = dateSelected && hasLocalDateApplied !== dateSelected;
      // removing applied date
      hasDateChangeToApply = hasLocalDateApplied && !dateSelected ? true : hasDateChangeToApply;
      // changing start date range      
      hasDateChangeToApply = hasCustomSelected && customStartDate !== localFilters?.customStartDate? true : hasDateChangeToApply;
      // changing end date range      
      hasDateChangeToApply = hasCustomSelected && customEndDate !== localFilters?.customEndDate? true : hasDateChangeToApply;
      // custom range valid
      hasDateChangeToApply = hasCustomSelected && !hasValidCustomRange ? false : hasDateChangeToApply;
      return hasDateChangeToApply;
    }

    const hasFilterChangeAvailable = () => {
      const noChildIds = filterList.filter(filter => !filter.childIds.length);
      const hasFilterListChange = noChildIds.some((filter) => (filter.checked && !filter.applied) || (!filter.checked && filter.applied));
      return hasFilterListChange || hasDateFilterChangeAvailable();
    }

    return {hasAnyFilterApplied, hasFilterChangeAvailable, filterList, dateSelected}
}

