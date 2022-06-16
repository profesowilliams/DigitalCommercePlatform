import React from "react";
import { useRenewalGridState } from "../../RenewalsGrid/store/RenewalsStore";

export default function useFilteringSelected(){
    const customStartDate = useRenewalGridState((state) => state.customStartDate);
    const filterList = useRenewalGridState((state) => state.filterList);
    const customEndDate = useRenewalGridState((state) => state.customEndDate);
    const dateSelected = useRenewalGridState((state) => state.dateSelected);
 
    const isDateSelected = () => {
        const isRangeDateSelected = (customStartDate && customEndDate);
        return dateSelected === "custom" ? isRangeDateSelected : !!dateSelected
      }
    
      const hasAnyFilterSelected = () => {
        const nochildIds = filterList.filter(filter => !filter.childIds.length);
        return nochildIds.some((filter) => filter.checked) || isDateSelected();
      }
      return {hasAnyFilterSelected, filterList, dateSelected}
}

