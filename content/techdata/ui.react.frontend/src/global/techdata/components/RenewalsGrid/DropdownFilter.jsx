import PropTypes from "prop-types";
import React, { useState } from "react";

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
  const [callbackExecuted, setCallbackExecuted] = useState(false)
  const { dropdown, input } = values;

  const clickHandler = () => {
    callback()
    setCallbackExecuted(true)
  };

  const onReset = () => {
    setCallbackExecuted(false)
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

  let styles;
  if (!styleProps) {
    styles = {
      width: "250px",
      tooltipWidth: "280px",
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
        <button className="tooltip__button" onClick={clickHandler}>
          <i className="fa fa-search"></i>
        </button>
        {/* Add logic with filterCounter prop in order to render this or a message when the filter results are 0 */}
        <div
          style={{ width: styleProps?.width || styles.tooltipWidth }}
          className="tooltip"
        >
          {callbackExecuted && !filterCounter ? <p>Sorry, no rows to display</p> : <p>Search by {chosenFilter}</p>}
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
DropdownFilter.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ).isRequired,
  callback: PropTypes.func.isRequired,
  filterCounter: PropTypes.number,
  inputType: PropTypes.string,
  styleProps: PropTypes.object,
};
