import React, { useState, useEffect } from "react";


function DropdownFilter({
  styleProps,
  options,
  callback,
  inputType,
  filterCounter,
}) {
  const [values, setValues] = useState({
    dropdown: "",
    input: "",
  });
  const { dropdown, input } = values;

  useEffect(() => {
    /**This is where you'll filter the grid when changing in the input */
    if (callback) {
      callback();
    }
  }, [input]);

  const onReset = () => {
    for (const key in values) {
      if (Object.hasOwnProperty.call(values, key)) {
        setValues((prevSt) => {
          return {
            ...prevSt,
            [key]: "",
          };
        });
      }
    }
  };

  const changeHandler = (evt) => {
    evt.preventDefault();
    const { value, name } = evt.target;
    setValues((prevSt) => {
      return {
        ...prevSt,
        [name]: value,
      };
    });
  };

  /** in the future, please erase the renewals import directly and use it as a prop, when done that, also erase this dropdownOptions variable */
  let styles;
  if (!styleProps) {
    styles = {
      width: "250px",
    };
  }

  if (dropdown.length) {
    const chosenFilter = options.find(
      (option) => option.value === dropdown
    ).label;
    return (
      <div className="tooltipContainer">
        <input
          onChange={changeHandler}
          className="inputStyle"
          name="input"
          value={input}
          style={styleProps || styles}
          placeholder={`Enter a ${chosenFilter}`}
          type={inputType || "text"}
        ></input>
        {/* Add logic with filterCounter prop in order to render this or a message when the filter results are 0 */}
        <div
          style={{ width: styleProps?.width || styles.width }}
          className="tooltip"
        >
          <p>Search by {chosenFilter}</p>
          <button onClick={onReset}>Reset</button>
        </div>
      </div>
    );
  }

  return (
    <select
      id="select-box"
      className="inputStyle"
      style={styleProps || styles}
      onChange={changeHandler}
      value={dropdown}
      name="dropdown"
      placeholder="Search"
    >
      <option value="" disabled={!dropdown.length}>
        Search by
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default DropdownFilter;
