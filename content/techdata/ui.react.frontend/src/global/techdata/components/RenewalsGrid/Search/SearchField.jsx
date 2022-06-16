import React from "react";
import { If } from "../../../helpers/If";
import { CloseIconWeighted } from "./SearchFilter";

export function SearchField({ chosenFilter = '', inputRef, triggerSearchOnEnter, searchTerm, setSearchTerm }) {
  const capitalizeContainedID = (searchTermText) => searchTermText.replace(/\bid(?:$|\b)/g,'ID');  
  const formatChosenFilter = (searchTermText) => `Enter ${capitalizeContainedID(searchTermText?.toLowerCase())}`
  return (
    <div className="cmp-search-select-container__box-search-field">
      <input
        className={`inputStyle ${searchTerm ? "searchText" : ""}`}
        autoFocus
        placeholder={formatChosenFilter(chosenFilter)}
        ref={inputRef}
        onKeyDown={triggerSearchOnEnter}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} />
      <If condition={inputRef.current?.value || searchTerm}>
        <CloseIconWeighted
          onClick={() => { inputRef.current.value = ""; setSearchTerm(""); }} />
      </If>
    </div>
  );
}
