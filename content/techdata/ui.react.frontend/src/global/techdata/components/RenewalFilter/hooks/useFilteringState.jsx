import React from "react";
import { useRenewalGridState } from "../../RenewalsGrid/store/RenewalsStore";
import { generateFilterFields } from "../filterUtils/filterUtils";

//hook para reducir zustandboilerplate
//logica comun que se reutiliza en los componentes
export const useMultiFilterSelected = () => {
  const filterList = useRenewalGridState((state) => state.filterList);
  const dateSelected = useRenewalGridState((state) => state.dateSelected);
  const datePickerState = useRenewalGridState((state) => state.datePickerState);
  const resetFilter = useRenewalGridState((state) => state.resetFilter);
  const effects = useRenewalGridState((state) => state.effects);
  const filterData = useRenewalGridState((state) => state.refinements);

  const _generateFilterFields = () => {
    const postJsonFields = generateFilterFields(filterList, dateSelected, datePickerState);
    if (!postJsonFields) return [false,false];
    if (Object.keys(postJsonFields).length > 4) return [postJsonFields, true]
    return [postJsonFields, false];
  };

  return {
    filterList,
    dateSelected,
    filterData,
    datePickerState,
    resetFilter,
    effects,
    _generateFilterFields,    
  };
};
