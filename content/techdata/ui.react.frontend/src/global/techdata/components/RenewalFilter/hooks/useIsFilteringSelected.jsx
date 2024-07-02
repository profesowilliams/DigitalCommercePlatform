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

    /**
     * Checks if there is any change available in the filter list or date filter.
     *
     * @returns {boolean} True if there is a change in the filter list and the date filter is null/undefined,
     *                    or if there is a change in either the filter list or the date filter. False otherwise.
     */
    const hasFilterChangeAvailable = () => {
      // Filter out the filters that do not have childIds
      const noChildIds = filterList.filter(filter => !filter.childIds.length);

      /**
       * Check if any of the filters without childIds have a change in their checked or applied status
       *
       * @type {boolean}
       */
      const hasFilterListChange = noChildIds.some((filter) => 
        (filter.checked && !filter.applied) || (!filter.checked && filter.applied)
      );

      /**
       * Determine if there is a change in the date filter
       *
       * @returns {boolean|null|undefined} - The change status of the date filter
       */
      const dateFilterChangeAvailable = hasDateFilterChangeAvailable();

      // Return true if there is a change in filter list and date filter is null or undefined
      if (hasFilterListChange && (dateFilterChangeAvailable === null || dateFilterChangeAvailable === undefined)) {
        return true;
      }

      // Return true if there is no change in filter list but there is a change in date filter
      if (!hasFilterListChange && dateFilterChangeAvailable) {
        return true;
      }

      // Return true if there is a change in both filter list and date filter
      if (hasFilterListChange && dateFilterChangeAvailable) {
        return true;
      }

      // Return false if there is no change in both filter list and date filter
      if (!hasFilterListChange && !dateFilterChangeAvailable) {
        return false;
      }

      // Return false if there is a change in filter list but no change in date filter
      if (hasFilterListChange && !dateFilterChangeAvailable) {
        return false;
      }

      // Default return false if none of the above conditions are met
      return false;
    }

  return { hasAnyFilterApplied, hasFilterChangeAvailable, filterList, dateSelected }
}

