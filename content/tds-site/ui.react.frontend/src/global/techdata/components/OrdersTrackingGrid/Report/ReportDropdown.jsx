import React, { forwardRef, useState } from 'react'

function ReportDropdown({ reportOptions, selectOption }, ref) {

  const handleOptionClick = (option) => {
    selectOption(option);
  }

  return (
    <div ref={ref} className='cmp-order-tracking-grid__report-dropdown'>
        <ul>
            {reportOptions.map((option) =>
              <li key={option.key} onClick={(event) => handleOptionClick(option)}>
                {option.label}
              </li>
            )}
        </ul>
    </div>

  )
}

export default forwardRef(ReportDropdown)
