import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { ReportIcon, ReportIconFilled } from '../../../../../fluentIcons/FluentIcons'
import ReportDropdown from './ReportDropdown';
import '../../../../../../src/styles/TopIconsBar.scss';
import Tooltip from '@mui/material/Tooltip';
import Hover from '../../Hover/Hover';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';
import { getUrlParamsCaseInsensitive } from '../../../../../utils/index';
import { updateUrl } from './Utils/utils';

/**
 * Functional component representing the Report feature
 * @param {Object} props - Component props
 * @param {Function} props.onChange - Callback function invoked on change events
 * @param {string} props.analyticsLabel - Label used for analytics purposes
 * @param {React.Ref} ref - Reference object used to expose imperative methods
 */
function Report({ onChange, analyticsLabel }, ref) {
  console.log('Report::init');

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
    }

    // Trigger the onChange callback with the selected option
    onChange(option);

    // Ensure the tooltip is closed
    setIsTooltipOpen(false);

    // Update the URL with the selected option
    updateUrl(option);
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

  /**
   * Custom hook to handle clicks outside of a specified element.
   * This hook will close a dropdown menu if a click occurs outside of the specified element.
   * @param {Object} wrapperRef - The reference to the element to detect outside clicks for.
   * @param {Function} setIsDropdownOpen - Function to update the dropdown open state.
   */
  useEffect(() => {
    /**
     * Function to handle clicks outside of the specified element.
     * @param {Event} event - The click event.
     */
    function handleClickOutside(event) {
      // Check if the click is outside the element referenced by wrapperRef
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        // Close the dropdown menu
        setIsDropdownOpen(false);
      }
    }

    // Add event listener to detect clicks outside of the specified element
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listener when the component unmounts or wrapperRef changes
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
            analyticsLabel={analyticsLabel}
          />
        )}
      </div>
    </Tooltip>
  );
}

export default forwardRef(Report);