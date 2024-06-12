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
import Hover from '../../Hover/Hover';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';

function Report(
  {
    selectOption,
    selectedKey,
    reportAnalyticsLabel,
    reportOptions,
  },
  ref
) {
  const [isDropDownOpen, setIsDropdownOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(selectedKey);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const wrapperRef = useRef(null);
  const uiTranslations = useOrderTrackingStore(
    (state) => state.uiTranslations
  );
  const translations = uiTranslations?.['OrderTracking.MainGrid.Reports'];

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropDownOpen);
    setIsTooltipOpen(false);
  };

  const handleSelectOption = (option) => {
    pushDataLayerGoogle(getReportAnalyticsGoogle(reportAnalyticsLabel, option));
    setCurrentValue(option.key);
    selectOption(option);
    setLocalStorageData(REPORTS_LOCAL_STORAGE_KEY, option);
    setIsTooltipOpen(false);
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
      title={translations?.Tooltip}
      placement="top"
      arrow
      disableInteractive={true}
      open={isTooltipOpen}
      onClose={() => setIsTooltipOpen(false)}
    >
      <div
        onClick={handleDropdownClick}
        className="cmp-order-tracking-grid__report"
        data-testid="report"
        onMouseEnter={() => setIsTooltipOpen(true)}
        onMouseLeave={() => setIsTooltipOpen(false)}
      >
        <Hover
          onHover={<ReportIconFilled fill="#262626" className="icon-hover" />}
        >
          <ReportIcon fill="#262626" className="icon-hover" />
        </Hover>
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
