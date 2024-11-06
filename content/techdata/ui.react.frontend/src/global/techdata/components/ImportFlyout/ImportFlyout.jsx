import React, { useState, useEffect, useRef } from 'react';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

export default function ImportFlyout({ store, importFlyout }) {
  const effects = store((state) => state.effects);
  const importFlyoutConfig = store((state) => state?.importFlyout);
  const flyoutRef = useRef(null);
  const vendorOptions = importFlyoutConfig?.options || [];
  const [enableImport, setEnableImport] = useState(false);
  const [vendor, setVendor] = useState('');
  const [vendorProgram, setVendorProgram] = useState('');
  const [vendorProgramOptions, setVendorProgramOptions] = useState([]);
  const [fileSelected, setFileSelected] = useState(false);

  const handleFileChange = (event) => {
    setFileSelected(event.target.files && event.target.files.length > 0);
  };

  // Close flyout function
  const closeFlyout = () =>
    effects.setCustomState({ key: 'importFlyout', value: { show: false } });

  // Handle Vendor Selection
  const handleVendorChange = (event) => {
    const selectedVendorId = event.detail?.value || event.target?.value;

    if (selectedVendorId) {
      setVendor(selectedVendorId);
      setVendorProgram(''); // Clear the second dropdown when vendor changes

      const selectedVendor = vendorOptions.find(
        (vendorOption) => vendorOption.id === selectedVendorId
      );
      setVendorProgramOptions(selectedVendor?.options || []);
    }
  };

  // Handle Vendor Program Selection
  const handleVendorProgramChange = (event) => {
    setVendorProgram(event.target.value);
  };

  // Enable Import button based on dropdown selections
  useEffect(() => {
    setEnableImport(
      vendor.length > 0 && vendorProgram.length > 0 && fileSelected
    );
  }, [vendor, vendorProgram, fileSelected]);

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
  }, []);

  // Flyout close listener
  useEffect(() => {
    const handleFlyoutClosed = (event) => closeFlyout();
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
      class="offcanvas-backdrop"
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
              <tds-dropdown
                id="dropdown"
                required
                optionTextKey="text"
                optionValueKey="id"
                options={JSON.stringify(
                  vendorOptions.map(({ text, id }) => ({ text, id }))
                )}
                onValueChanged={(event) => handleVendorChange(event)} // Listen to a custom event
              >
                {getDictionaryValueOrKey(importFlyout?.vendorImport) ||
                  'Vendor'}
              </tds-dropdown>
              <tds-dropdown
                id="dropdown-1"
                required
                optionTextKey="text"
                optionValueKey="text"
                options={JSON.stringify(
                  vendorProgramOptions.map(({ text }) => ({
                    text
                  }))
                )}
                {...(vendor ? {} : { disabled: true })} // Dynamically apply the `disabled` attribute
                onInput={handleVendorProgramChange}
              >
                {getDictionaryValueOrKey(importFlyout?.vendorProgram) ||
                  'Vendor Program'}
              </tds-dropdown>
            </div>
            <tds-file-input
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
            ></tds-file-input>
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
