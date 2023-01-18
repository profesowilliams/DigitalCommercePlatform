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
      const isRangeDateSelected = (customStartDate && customEndDate);        
      const hasDateApplied = getLocalStorageData(FILTER_LOCAL_STORAGE_KEY)?.dateSelected;
      const hasDateSelected = dateSelected === "custom" ? isRangeDateSelected : !!dateSelected
      return hasDateSelected || hasDateApplied;
    }    

    const hasAnyFilterApplied = () => {
      const noChildIds = filterList.filter(filter => !filter.childIds.length);        
      return noChildIds.some((filter) => filter.checked || filter.applied) || isDateSelectedOrApplied();
    }

    const hasFilterChangeAvailable = () => {
      const noChildIds = filterList.filter(filter => !filter.childIds.length);
      const hasFilterListChange = noChildIds.some((filter) => (filter.checked && !filter.applied) || (!filter.checked && filter.applied));
      const localDateApplied = getLocalStorageData(FILTER_LOCAL_STORAGE_KEY)?.dateSelected;  
      const hasValidCustomRange = dateSelected === "custom" ? (customStartDate && customEndDate) : true;
      const hasDateFilterChange = !localDateApplied && dateSelected || localDateApplied && !dateSelected && hasValidCustomRange;    
      const hasDateChangeToApply = localDateApplied && dateSelected && localDateApplied !== dateSelected;
      return hasFilterListChange || hasDateFilterChange || hasDateChangeToApply;
    }

    return {hasAnyFilterApplied, hasFilterChangeAvailable, filterList, dateSelected}
}

