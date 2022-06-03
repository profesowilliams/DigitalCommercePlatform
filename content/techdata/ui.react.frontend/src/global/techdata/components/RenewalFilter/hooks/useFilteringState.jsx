import React, { useRef, useEffect, useCallback } from "react";
import { isObject } from "../../../../../utils";
import { FILTER_LOCAL_STORAGE_KEY } from "../../../../../utils/constants";
import { getLocalStorageData, setLocalStorageData } from "../../RenewalsGrid/renewalUtils";
import { useRenewalGridState } from "../../RenewalsGrid/store/RenewalsStore";
import { generateFilterFields } from "../filterUtils/filterUtils";

export const useMultiFilterSelected = () => {
  const filterList = useRenewalGridState((state) => state.filterList);
  const dateSelected = useRenewalGridState((state) => state.dateSelected);
  const datePickerState = useRenewalGridState((state) => state.datePickerState);
  const resetFilter = useRenewalGridState((state) => state.resetFilter);
  const effects = useRenewalGridState((state) => state.effects);
  const filterData = useRenewalGridState((state) => state.refinements);

  const optionFieldsRef = useRef();
  const isFilterDataPopulated = useRef(false);

  const _setOptionsFields = useCallback(
    ([optionFields, hasData]) => {
      optionFieldsRef.current = hasFilterLocalStorageData() ? getLocalStorageData(FILTER_LOCAL_STORAGE_KEY)?.optionFields : optionFields;
      isFilterDataPopulated.current = hasData;

      if (resetFilter) {isFilterDataPopulated.current = false;effects.setCustomState({key:'resetFilter', value: false})}
    },
    [filterList, dateSelected]
  );

  function hasFilterLocalStorageData() {
    return isObject(getLocalStorageData(FILTER_LOCAL_STORAGE_KEY)?.optionFields);
  }

  useEffect(() => {
    const optionFields = _generateFilterFields();       
    optionFields && _setOptionsFields(optionFields);
  }, [filterList, dateSelected, datePickerState, resetFilter]);


  const _generateFilterFields = () => {
    const postJsonFields = generateFilterFields(
      filterList,
      dateSelected,
      datePickerState
    );
    if (!postJsonFields) return [false, false];
    if (Object.keys(postJsonFields).length >= 4) return [postJsonFields, true];
    return [postJsonFields, false];
  };

  return {
    optionFieldsRef,
    isFilterDataPopulated,
    filterList,
    resetFilter,
    effects,
    filterData,
    _generateFilterFields,
  };
};
