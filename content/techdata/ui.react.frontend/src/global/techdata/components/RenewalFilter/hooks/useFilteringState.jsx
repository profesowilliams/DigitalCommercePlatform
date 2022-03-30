import React, { useRef, useEffect, useCallback } from "react";
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

  const _setOptionsFileds = useCallback(
    ([optionFields, hasData]) => {
      optionFieldsRef.current = optionFields;
      isFilterDataPopulated.current = hasData;
    },
    [filterList, dateSelected]
  );

  useEffect(() => {
    const optionFields = _generateFilterFields();
    optionFields && _setOptionsFileds(optionFields);
  }, [filterList, dateSelected, datePickerState]);

  const _generateFilterFields = () => {
    const postJsonFields = generateFilterFields(
      filterList,
      dateSelected,
      datePickerState
    );
    if (!postJsonFields) return [false, false];
    if (Object.keys(postJsonFields).length > 4) return [postJsonFields, true];
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
