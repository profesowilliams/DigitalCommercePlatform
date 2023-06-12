import React from "react";
import { CloseIcon, CloseIconWeighted } from "../../../../../fluentIcons/FluentIcons";
import useComputeBranding from "../../../hooks/useComputeBranding";

export function OrderSearchField({
  chosenFilter = '',
  inputRef,
  triggerSearchOnEnter,
  searchTerm,
  setSearchTerm,
  store,
  gridConfig,
}) {
  const capitalizeContainedID = (searchTermText) =>
    searchTermText.replace(/\bid(?:$|\b)/g, 'ID');
  const formatChosenFilter = (searchTermText) =>
    `${getDictionaryValueOrKey(
      gridConfig?.searchEnterLabel
    )} ${capitalizeContainedID(searchTermText)}`;
  const { isTDSynnex } = useComputeBranding(store);
  return (
    <div className="cmp-search-select-container__box-search-field">
      <input
        className={`inputStyle ${searchTerm ? 'searchText' : ''}`}
        autoFocus
        placeholder={formatChosenFilter(chosenFilter)}
        ref={inputRef}
        onKeyDown={triggerSearchOnEnter}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {(inputRef.current?.value || searchTerm) && (
        <>
          {isTDSynnex ? (
            <CloseIcon
              onClick={() => {
                inputRef.current.value = '';
                setSearchTerm('');
              }}
            />
          ) : (
            <CloseIconWeighted
              onClick={() => {
                inputRef.current.value = '';
                setSearchTerm('');
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
