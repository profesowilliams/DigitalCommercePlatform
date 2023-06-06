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
import { getReportAnalytics, pushDataLayer } from '../utils/analyticsUtils';

function Report({ selectOption, selectedKey, reportAnalyticsLabel }, ref) {
  const reportOptions = [
    { key: 'OpenOrders', label: 'Open Orders' },
    { key: 'NewBacklog', label: 'New Backlog' },
    { key: 'TodaysShipmentsDeliveries', label: `Today's Shipments/Deliveries` },
    { key: 'Last7DaysOrders', label: 'Last 7 Days Orders' },
    { key: 'Last30DaysOrders', label: 'Last 30 Days Orders' },
    { key: 'Last7DaysShipments', label: 'Last 7 Days Shipments' },
    { key: 'Last30DaysShipments', label: 'Last 30 Days Shipments' },
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
    pushDataLayer(getReportAnalytics(reportAnalyticsLabel, option));
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
