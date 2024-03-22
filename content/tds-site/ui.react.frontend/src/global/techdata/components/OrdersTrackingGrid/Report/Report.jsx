import React, {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { ReportIcon, ReportIconFilled } from '../../../../../fluentIcons/FluentIcons'
import ReportDropdown from './ReportDropdown';
import '../../../../../../src/styles/TopIconsBar.scss';
import {
  getReportAnalyticsGoogle,
  pushDataLayerGoogle,
} from '../utils/analyticsUtils';
import { setLocalStorageData } from '../utils/gridUtils';
import { REPORTS_LOCAL_STORAGE_KEY } from '../../../../../utils/constants';
import Tooltip from '@mui/material/Tooltip';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

function Report(
  {
    selectOption,
    selectedKey,
    reportAnalyticsLabel,
    reportOptions,
    gridConfig,
  },
  ref
) {
  const [isDropDownOpen, setIsDropdownOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(selectedKey);
  const wrapperRef = useRef(null);
  const [isReportHovered, setIsReportHovered] = useState(false);
  const handleMouseOverSearch = () => {
    setIsReportHovered(true);
  };
  const handleMouseLeaveSearch = () => {
    setIsReportHovered(false);
  };
  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropDownOpen);
  };

  const handleSelectOption = (option) => {
    pushDataLayerGoogle(getReportAnalyticsGoogle(reportAnalyticsLabel, option));
    setCurrentValue(option.key);
    selectOption(option);
    setIsReportHovered(false);
    setLocalStorageData(REPORTS_LOCAL_STORAGE_KEY, option);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  useImperativeHandle(
    ref,
    () => {
      return { value: currentValue };
    },
    [currentValue]
  );

  return (
    <Tooltip
      title={getDictionaryValueOrKey(gridConfig?.reportTooltip)}
      placement="top"
      arrow
      disableInteractive={true}
    >
      <div
        onClick={handleDropdownClick}
        className="cmp-order-tracking-grid__report"
        onMouseOver={handleMouseOverSearch}
        onMouseLeave={handleMouseLeaveSearch}
        data-testid="report"
      >
        {isReportHovered ? (
          <ReportIconFilled fill="#262626" className="icon-hover" />
        ) : (
          <ReportIcon fill="#262626" className="icon-hover" />
        )}
        {isDropDownOpen && (
          <ReportDropdown
            ref={wrapperRef}
            reportOptions={reportOptions}
            selectOption={handleSelectOption}
          />
        )}
      </div>
    </Tooltip>
  );
}

export default forwardRef(Report);
