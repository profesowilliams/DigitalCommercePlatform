import PropTypes from "prop-types";
import React, { useRef, useState, useCallback } from "react";
import { If } from "../../helpers/If";


function DropdownFilter({
  styleProps,
  options,
  callback,
  inputType,
  filterCounter,
  onQueryChanged
}) {
  const [values, setValues] = useState({
    dropdown: "",
    input: "",
    option:""
  });
  const [callbackExecuted, setCallbackExecuted] = useState(false)
  const [isDropdownVisible, setSwitchDropdown ] = useState(false);  
  const [isResetVisible, setResetVisible] = useState(true);
  const { dropdown, input, option } = values;
  const node = useRef();
  const inputRef = useRef();
  
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

  const changeHandler = (value) => {    
    setValues((prevSt) => ({
        ...prevSt,
        "option": value,
    }));
  };

  let styles;
  if (!styleProps) {
    styles = {
      width: "250px",
      tooltipWidth: "280px",
    };
  }
  
  const handleDropdownSwitch = useCallback(() => {
    setSwitchDropdown(!isDropdownVisible)
    if (!isDropdownVisible) {
      document.addEventListener("click", handleOutsideClick, false);
    } else {
      document.removeEventListener("click", handleOutsideClick, false);
    }
  }, [isDropdownVisible])

  const handleOutsideClick = e => {        
    const isComingFromSearch = e.target.parentNode.className === 'cmp-renewal-search';
    const isComingFromReset = e.target.parentNode.className === 'cmp-search-options__reset';
    if (node.current && !isComingFromSearch && !isComingFromReset && !node.current.contains(e.target)) {
      setSwitchDropdown(false)
    };
  };
  
  function triggerSearch (){
    const {option} = values;   
    const inputValue = inputRef.current.value;
    const query = {
      queryString : `&${option}=${inputValue}`
    }
    onQueryChanged(query);
    // onReset();
    // setSwitchDropdown(false);
  }
  const triggerSearchOnEnter = (event) => {
    if(event.keyCode === 13){
      triggerSearch();
    }
  }
 

  if (option.length) {    
    const chosenFilter = options.find(
      ({value}) => value === option
    ).label;
    return (
      <div className="cmp-search-select-container">
        <div className="cmp-search-select-container__box">
          <input className="inputStyle" autoFocus placeholder={`Enter a ${chosenFilter}`} ref={inputRef} onKeyDown={triggerSearchOnEnter} />
          <button className="cmp-search-tooltip__button" onClick={() => triggerSearch()}>
            <i className="fa fa-search"></i>
          </button>
        </div>
        <If condition={isResetVisible}>
          <div className="cmp-search-options" style={{padding:'0 10px'}}>
            <div className="cmp-search-options__reset">
              <label>
                {callbackExecuted && !filterCounter ? <p>Sorry, no rows to display</p> : <p>Search by {chosenFilter}</p>}
              </label>
              <a onClick={onReset}>Reset</a>
            </div>
          </div>
        </If>
      </div>     
    );
  }

  return (
    <>
    <If condition={!isDropdownVisible}>
    <div className="cmp-renewal-search" onClick={handleDropdownSwitch}>
      <span>search</span>
      <i className="fa fa-search"></i>
    </div>
    </If>
    <If condition={isDropdownVisible}>
      <div className="cmp-search-select-container" ref={node}>  
          <div className="cmp-search-select-container__box">
            <input className="inputStyle" placeholder="Search by" disabled/>
            <button className="cmp-search-tooltip__button">
              <i className="fa fa-search"></i>
            </button>
            </div>      
          <If condition={true}>
          <div className="cmp-search-options">
            {options.map((option) => (
              <label key={option.value} onClick={() => changeHandler(option.value)}>
            {option.label}
          </label>
        ))}
          </div>   
        </If>
      </div>   
    </If>
    
    </>
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
