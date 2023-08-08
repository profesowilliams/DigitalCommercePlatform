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
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

function Report({ selectOption, selectedKey, reportAnalyticsLabel, gridConfig}, ref) {
  const reportOptions = [
    {
      key: 'OpenOrders',
      label: getDictionaryValueOrKey(gridConfig?.reportOpenOrdersLabel),
    },
    {
      key: 'NewBacklog',
      label: getDictionaryValueOrKey(gridConfig?.reportNewBacklogLabel),
    },
    {
      key: 'TodaysShipmentsDeliveries',
      label: getDictionaryValueOrKey(
        gridConfig?.reportTodaysShipmentsDeliveriesLabel
      ),
    },
    {
      key: 'Last7DaysOrders',
      label: getDictionaryValueOrKey(gridConfig?.reportLast7DaysOrdersLabel),
    },
    {
      key: 'Last30DaysOrders',
      label: getDictionaryValueOrKey(gridConfig?.reportLast30DaysOrdersLabel),
    },
    {
      key: 'Last7DaysShipments',
      label: getDictionaryValueOrKey(gridConfig?.reportLast7DaysShipmentsLabel),
    },
    {
      key: 'Last30DaysShipments',
      label: getDictionaryValueOrKey(
        gridConfig?.reportLast30DaysShipmentsLabel
      ),
    },
  ];
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
  );
}

export default forwardRef(Report);
