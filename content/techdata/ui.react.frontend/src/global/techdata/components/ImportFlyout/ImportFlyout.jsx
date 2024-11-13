import React, { useState, useEffect, useRef } from 'react';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import FileInput from '../Widgets/FileUpload';

/**
 * ImportFlyout component to render a flyout for importing vendor quotes, including vendor and vendor program selection.
 * @param {Object} props - Component properties.
 * @param {Function} props.store - Store function to manage state.
 * @param {Object} props.importFlyout - Configuration for import flyout, providing localization and UI text.
 * @returns {JSX.Element} The rendered ImportFlyout component.
 */
export default function ImportFlyout({ store, importFlyout }) {
  const effects = store((state) => state.effects);
  const importFlyoutConfig = store((state) => state?.importFlyout);
  const flyoutRef = useRef(null);

  // Vendor options fetched from importFlyoutConfig, initially empty
  const [vendorOptions, setVendorOptions] = useState([]);

  // States to manage the import flyout functionality
  const [enableImport, setEnableImport] = useState(false);
  const [vendor, setVendor] = useState('');
  const [vendorProgram, setVendorProgram] = useState('');
  const [vendorProgramOptions, setVendorProgramOptions] = useState([]);
  const [fileSelected, setFileSelected] = useState(false);

  /**
   * Handles the selection of a file for import.
   * Updates the file selection state.
   * @param {Event} event - The file input change event.
   */
  const handleFileChange = (event) => {
    setFileSelected(event.target.files && event.target.files.length > 0);
  };

  /**
   * Closes the flyout.
   * Sets the importFlyout state to not show the flyout.
   */
  const closeFlyout = () =>
    effects.setCustomState({ key: 'importFlyout', value: { show: false } });

  /**
   * Handles vendor selection change.
   * Updates the vendor state and fetches related vendor program options.
   * @param {Event} event - The vendor selection event.
   */
  const handleVendorChange = (event) => {
    const selectedVendorId = event.detail?.value || event.target?.value;

    if (selectedVendorId) {
      // Set selected vendor state
      setVendor(selectedVendorId);
      // Clear any previously selected vendor program since the vendor changed
      setVendorProgram('');

      // Find the selected vendor to extract available program options
      const selectedVendor = vendorOptions.find(
        (vendorOption) => String(vendorOption.id) === String(selectedVendorId)
      );

      if (selectedVendor) {
        // Update vendor program options if they exist
        setVendorProgramOptions(selectedVendor.options || []);
      }
    }
  };

  /**
   * Handles the selection change for the vendor program dropdown.
   * Updates the vendor program state.
   * @param {Event} event - The vendor program selection event.
   */
  const handleVendorProgramChange = (event) => {
    const selectedProgram = event.detail?.value || event.target?.value;
    setVendorProgram(selectedProgram);
  };

  /**
   * Enables the import button if a vendor, vendor program, and file are selected.
   * Listens for changes in vendor, vendor program, and file selection state.
   */
  useEffect(() => {
    setEnableImport(
      vendor.length > 0 && vendorProgram.length > 0 && fileSelected
    );
  }, [vendor, vendorProgram, fileSelected]);

  /**
   * Populates vendor options from importFlyoutConfig when available.
   * This ensures the dropdown is populated as soon as the configuration data is loaded.
   */
  useEffect(() => {
    if (importFlyoutConfig?.options && importFlyoutConfig.options.length > 0) {
      setVendorOptions(importFlyoutConfig.options);
    }
  }, [importFlyoutConfig]);

  /**
   * Adds an event listener for the vendor dropdown value change event.
   * Ensures that the correct function is called when a vendor is selected.
   */
  useEffect(() => {
    const dropdownElement = document.getElementById('dropdown');
    if (dropdownElement) {
      dropdownElement.addEventListener('value-changed', handleVendorChange);
    }

    // Clean up listener on component unmount
    return () => {
      if (dropdownElement) {
        dropdownElement.removeEventListener(
          'value-changed',
          handleVendorChange
        );
      }
    };
  }, [vendorOptions]);

  /**
   * Adds a listener to handle when the flyout is closed.
   * This ensures that the flyout closes gracefully.
   */
  useEffect(() => {
    const handleFlyoutClosed = () => closeFlyout();
    const flyoutElement = flyoutRef.current;
    if (flyoutElement) {
      flyoutElement.addEventListener('flyoutClosed', handleFlyoutClosed);
    }
    return () => {
      if (flyoutElement) {
        flyoutElement.removeEventListener('flyoutClosed', handleFlyoutClosed);
      }
    };
  }, [flyoutRef]);

  return (
    <tds-flyout
      ref={flyoutRef}
      {...(importFlyoutConfig?.show ? { show: '' } : {})}
      onClose={closeFlyout}
      size="sm"
      placement="end"
      id="import-quote-flyout"
      aria-labelledby="offcanvasLabel"
      scrollable
      backdrop="true"
      className="offcanvas-backdrop"
    >
      <tds-flyout-header>
        <tds-flyout-title>
          {getDictionaryValueOrKey(importFlyout?.importTitle) || 'Import'}
        </tds-flyout-title>
      </tds-flyout-header>
      <tds-flyout-body id="flyout-body">
        <p className="pt-1 mb-4 text-black-100">
          {getDictionaryValueOrKey(importFlyout?.completeTheRequiredFields) ||
            'Complete the required fields below to import new quotes.'}
        </p>
        <div className="layout-container">
          <div className="form-elements">
            <div className="dropdown-group">
              {/* Vendor Dropdown */}
              <tds-dropdown
                id="dropdown"
                required
                optionTextKey="text"
                optionValueKey="id"
                options={JSON.stringify(
                  vendorOptions.map(({ text, id }) => ({ text, id }))
                )}
                {...(vendorOptions.length === 0 ? { disabled: true } : {})}
                onValueChanged={(event) => handleVendorChange(event)}
              >
                {getDictionaryValueOrKey(importFlyout?.vendorImport) ||
                  'Vendor'}
              </tds-dropdown>

              {/* Vendor Program Dropdown */}
              <tds-dropdown
                id="dropdown-1"
                required
                optionTextKey="text"
                optionValueKey="text"
                options={JSON.stringify(
                  vendorProgramOptions.map(({ text }) => ({
                    text,
                  }))
                )}
                {...(vendor ? {} : { disabled: true })}
                onInput={handleVendorProgramChange}
              >
                {getDictionaryValueOrKey(importFlyout?.vendorProgram) ||
                  'Vendor Program'}
              </tds-dropdown>
            </div>

            {/* File Input */}
            <FileInput
              headingText={
                getDictionaryValueOrKey(importFlyout?.dragAndDrop) ||
                'Drag & Drop or Choose file from device'
              }
              secondaryText={getDictionaryValueOrKey(importFlyout?.maxSizeOf)}
              buttonText={
                getDictionaryValueOrKey(importFlyout?.browseFile) ||
                'Browse file'
              }
              iconName="upload"
              iconState="default"
              maxFileSize="2MB"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </tds-flyout-body>
      <tds-flyout-footer>
        <tds-flyout-button
          disabled={!enableImport}
          type="button"
          variant="primary"
          theme="light"
          label={getDictionaryValueOrKey(importFlyout?.importTitle)}
          color="teal"
        >
          {getDictionaryValueOrKey(importFlyout?.importButton) || 'Import'}
        </tds-flyout-button>
      </tds-flyout-footer>
    </tds-flyout>
  );
}
