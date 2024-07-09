import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
//import { useHistory } from 'react-router-dom';
import { ReportIcon, ReportIconFilled } from '../../../../../fluentIcons/FluentIcons'
import ReportDropdown from './ReportDropdown';
import '../../../../../../src/styles/TopIconsBar.scss';
import { getReportAnalyticsGoogle, pushDataLayerGoogle } from '../utils/analyticsUtils';
import Tooltip from '@mui/material/Tooltip';
import Hover from '../../Hover/Hover';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';
import { getUrlParamsCaseInsensitive, removeDisallowedParams, removeSpecificParams } from '../../../../../utils/index';

/**
 * Functional component representing the Report feature
 * @param {Object} props - Component props
 * @param {Function} props.onChange - Callback function invoked on change events
 * @param {string} props.analyticsLabel - Label used for analytics purposes
 * @param {React.Ref} ref - Reference object used to expose imperative methods
 */
function Report({ onChange, analyticsLabel }, ref) {
  //const history = useHistory();
  const [isDropDownOpen, setIsDropdownOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const wrapperRef = useRef(null);
  const uiTranslations = useOrderTrackingStore((state) => state.uiTranslations);
  const translations = uiTranslations?.['OrderTracking.MainGrid.Reports'];
  const reportOptions = [
    {
      key: 'OpenOrders',
      label: translations?.['OpenOrders'],
    },
    {
      key: 'NewBacklog',
      label: translations?.['NewBacklog'],
    },
    {
      key: 'TodaysShipmentsDeliveries',
      label: translations?.['TodaysShipmentsDeliveries'],
    },
    {
      key: 'Last7DaysOrders',
      label: translations?.['Last7DaysOrders'],
    },
    {
      key: 'Last30DaysOrders',
      label: translations?.['Last30DaysOrders'],
    },
    {
      key: 'Last7DaysShipments',
      label: translations?.['Last7DaysShipments'],
    },
    {
      key: 'Last30DaysShipments',
      label: translations?.['Last30DaysShipments'],
    },
    {
      key: 'EOLOrders',
      label: translations?.['EOLOrders'],
    },
  ];
  const params = getUrlParamsCaseInsensitive();
  const getInitial = params.get('report');

  /**
   * Handles the click event for the dropdown menu
   * Toggles the dropdown open state and ensures the tooltip is closed
   */
  const handleDropdownClick = () => {
    // Toggle the dropdown open state
    setIsDropdownOpen(!isDropDownOpen);

    // Ensure the tooltip is closed
    setIsTooltipOpen(false);
  };

  /**
   * Handles the selection of an option from the dropdown
   * @param {Object} option - The selected option
   */
  const handleSelectOption = (option) => {
    console.log('Report::handleSelectOption');

    // If an option is selected
    if (option) {
      // Add a new field to the option with a label from translations
      option.field = translations?.PillLabel;

      // Push data to Google Analytics with the selected option and report label
      pushDataLayerGoogle(getReportAnalyticsGoogle(analyticsLabel, option));
    }

    // Trigger the onChange callback with the selected option
    onChange(option);

    // Ensure the tooltip is closed
    setIsTooltipOpen(false);

    // Update the URL with the selected option
    updateUrl(option);
  };

  /**
   * Updates the URL based on the selected report
   * @param {Object} report - The selected report
   */
  const updateUrl = (report) => {
    console.log('Report::updateUrl');

    // Get the current URL
    const currentUrl = new URL(window.location.href);

    // Declare a variable to hold the updated URL
    let url;

    // If an report is selected
    if (report) {
      // List of allowed parameters
      const allowedParameters = ['page', 'sortby', 'sortdirection'];

      // Remove disallowed parameters from the current URL, keeping only specified ones
      url = removeDisallowedParams(new URL(window.location.href), allowedParameters);
      url.searchParams.set('report', report.key);
    } else {
      // List of parameters which should be removed
      const parametersToRemove = ['report'];

      // Remove specific parameters from the URL
      url = removeSpecificParams(currentUrl, parametersToRemove);
    }

    // If the URL has changed, update the browser history
    if (url.toString() !== currentUrl.toString())
      window.history.pushState(null, '', url.toString());
    // history.push(url.href.replace(url.origin, ''));
  };

  /**
   * Exposes methods to the parent component using a ref
   */
  useImperativeHandle(ref, () => ({
    cleanUp() {
      console.log('Report::cleanUp');

      // Call the updateUrl function with undefined to clear specific parameters from the URL
      updateUrl(undefined);
    }
  }));

  useEffect(() => {
    console.log('Report::useEffect::translations');
    // Check if the initial value (getInitial) is provided
    if (getInitial) {

      // Normalize the initial value to 'EOLOrders' if it matches 'EOL' (case-insensitive)
      if (getInitial.toLowerCase() === 'EOL'.toLowerCase()) {
        getInitial = 'EOLOrders';
      }

      // Select the option corresponding to the initial value
      handleSelectOption({
        key: getInitial,
        label: translations?.[getInitial]
      });
    }
    // This effect runs whenever the translations object changes
  }, [translations]);

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