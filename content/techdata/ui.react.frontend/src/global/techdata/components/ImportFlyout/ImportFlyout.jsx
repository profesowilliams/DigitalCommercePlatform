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
  const closeFlyout = () =>
    effects.setCustomState({ key: 'importFlyout', value: { show: false } });

  //TODO: Implement both handle logic

  // This is vendorOptions data structure - delete it later
  // (vendorOptions = [
  //   {
  //     text: 'IBM',
  //     id: '8',
  //     name: 'Programs',
  //     options: [
  //       {
  //         text: 'Passport Advantage',
  //         parserId: '123',
  //       },
  //     ],
  //   },
  // ]),

  // In first dropdown I want to display vendorOptions[].text and set vendor to vendorOptions[].id
  // In second dropdown I want to display vendorProgramOptions[].text and set vendorProgram to vendorProgramOptions[].parserId

  // Tose are handleChange for both dropdowns
  // const handleVendorChange = (event) => {
  //   const selectedVendorId = event.target.value;
  //   setVendorProgram('');
  //   setVendor(selectedVendorId);

  //   const selectedVendor = vendorOptions?.find(
  //     (vendorOption) => vendorOption?.id === selectedVendorId
  //   );
  //   setVendorProgramOptions(selectedVendor?.options || []);
  // };

  // const handleVendorProgramChange = (event) => {
  //   setVendorProgram(event.target.value);
  // };

  // Set up event listener for 'flyoutClosed'

  // Handle Vendor Selection
  const handleVendorChange = (event) => {
    const selectedVendorId = event.target.value;
    setVendorProgram('');
    setVendor(selectedVendorId);

    const selectedVendor = vendorOptions.find(
      (vendorOption) => vendorOption.id === selectedVendorId
    );
    setVendorProgramOptions(selectedVendor?.options || []);
  };

  // Handle Vendor Program Selection
  const handleVendorProgramChange = (event) => {
    setVendorProgram(event.target.value);
  };

  // Enable Import button based on dropdown selections
  useEffect(() => {
    setEnableImport(vendor.length > 0 && vendorProgram.length > 0);
  }, [vendor, vendorProgram]);

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

  // Enable Import button
  useEffect(() => {
    if (vendor?.length > 0 && vendorProgram?.length > 0) {
      setEnableImport(true);
    } else {
      setEnableImport(false);
    }
  }, [vendor, vendorProgram]);

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
                optionValueKey="parserId"
                options={JSON.stringify(
                  vendorOptions.map(({ text, id }) => ({ text, value: id }))
                )}
                onInput={handleVendorChange}
              >
                {getDictionaryValueOrKey(importFlyout?.vendorImport) ||
                  'Vendor'}
              </tds-dropdown>
              <tds-dropdown
                id="dropdown-1"
                required
                optionTextKey="text"
                optionValueKey="parserId"
                options={JSON.stringify(
                  vendorProgramOptions.map(({ text, parserId }) => ({
                    text,
                    value: parserId,
                  }))
                )}
                {...(!vendor ? { disabled: '' } : {})}
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
