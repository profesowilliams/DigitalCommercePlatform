import React, { useState, useRef, useEffect } from 'react'
import { ChevronDownIcon } from '../../../../../fluentIcons/FluentIcons'
import ReportDropdown from './ReportDropdown';

function Report({options}) {
  const [isDropDownOpen, setIsDropdownOpen] = useState(false);
  const wrapperRef = useRef(null);

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropDownOpen);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div onClick={handleDropdownClick} className='cmp-order-tracking-grid__report'>
        <label>Report</label>
        <ChevronDownIcon fill="#262626" />
        {isDropDownOpen && <ReportDropdown ref={wrapperRef} reportOptions={options} />}
    </div>

  )
}

export default Report
