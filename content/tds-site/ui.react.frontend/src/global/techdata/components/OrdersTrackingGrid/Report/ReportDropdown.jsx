import React, { forwardRef } from 'react';
import { getReportAnalyticsGoogle, pushDataLayerGoogle } from '../utils/analyticsUtils';

function ReportDropdown({ reportOptions, selectOption }, ref) {
  const handleOptionClick = (option) => {
    selectOption(option);
    // Push data to Google Analytics with the selected option and report label
    pushDataLayerGoogle(getReportAnalyticsGoogle(analyticsLabel, option));
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
