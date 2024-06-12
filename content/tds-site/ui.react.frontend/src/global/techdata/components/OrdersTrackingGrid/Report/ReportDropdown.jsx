import React, { forwardRef } from 'react';

function ReportDropdown({ reportOptions, selectOption }, ref) {
  const handleOptionClick = (option) => {
    selectOption(option);
  };

  return (
    <div
      ref={ref}
      className="cmp-order-tracking-grid__report-dropdown"
      data-testid="report-dropdown"
    >
      <ul>
        {reportOptions.map((option, index) => (
          <li
            key={option.key}
            onClick={() => handleOptionClick(option)}
            data-testid={`report-option-${index}`}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default forwardRef(ReportDropdown);
