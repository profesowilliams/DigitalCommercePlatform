import React, { useEffect, useState } from "react";
import { isEnterKey } from "../../helpers/isEnterKey";

function SimpleQueryInput({ filterKey, placeholder, onQueryChanged, onKeyPress}) {
  const [filterValue, setFilterValue] = useState(null);
  const [maxLength, setMaxLength] = useState(524288);
  function textInputChanged(value) {
    setFilterValue(value);
  }

  useEffect(() => {
      onQueryChanged({ key: filterKey, value: filterValue });
  }, [filterValue]);

  return (
    <span className="cmp-query-input">
      <input
        className="cmp-query-input__input"
        type="text"
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(event) => textInputChanged(event.target.value)}
        onKeyPress={(event) => onKeyPress(isEnterKey(event))}
      />
    </span>
  );
}
export default SimpleQueryInput;
