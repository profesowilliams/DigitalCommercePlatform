import React, { Fragment, useState } from 'react';

const Dropdown = ({ selected, setValue, options, label = "Create from", placeholderText }) => {
  const [open, setOpen] = useState(false)
  const toggleOpen = () =>{
    const newOpen = open ? false : true;
    setOpen(newOpen);
  }
  const handleSetValue = (value) =>{
    setValue(value);
    setOpen(false);
  }
  return(
    <Fragment>
      <div className={`cmp-dropdown-custom ${open?'cmp-dropdown-custom--open':''}`}>
        <a className="cmp-dropdown-custom__input" onClick={toggleOpen}>
          <span>
            {selected ? selected.label : placeholderText}
          </span>
          <span>
            <i className="fas fa-chevron-right"></i>
            <i className="fas fa-chevron-down"></i>
          </span>
        </a>
        <div className="cmp-dropdown-custom__list-wrapper">
          <ul className="cmp-dropdown-custom__list">
            {
              options.map( (option, i) => 
                <li 
                  key={ Symbol(option.key? option.key : `${i}-${option.label}`).toString()} 
                  onClick={() => handleSetValue(option) }>{option.label}</li> )
            }
          </ul>
        </div>
      </div>
    </Fragment>
  );
};

export default Dropdown;