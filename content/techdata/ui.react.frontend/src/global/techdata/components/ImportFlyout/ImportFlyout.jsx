import React, { useState, useEffect, useRef } from 'react';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import Flyout, {
  FlyoutHeader,
  FlyoutTitle,
  FlyoutBody,
  FlyoutFooter,
  FlyoutButton,
} from '../web-components/Flyout';
import Dropdown from '../web-components/Dropdown';
import FileInput from '../web-components/FileUpload';

/**
 * ImportFlyout component renders a flyout for importing vendor quotes,
 * including vendor and vendor program selection.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Function} props.store - State management function from the store.
 * @param {Object} props.importFlyout - Configuration object providing localization and UI text.
 * @returns {JSX.Element} The rendered ImportFlyout component.
 */
export default function ImportFlyout({ store, importFlyout }) {
  const effects = store((state) => state.effects);
  const importFlyoutConfig = store((state) => state?.importFlyout);
  const flyoutRef = useRef(null);

  const [vendorOptions, setVendorOptions] = useState([]);
  const [enableImport, setEnableImport] = useState(false);
  const [vendor, setVendor] = useState('');
  const [vendorProgram, setVendorProgram] = useState('');
  const [vendorProgramOptions, setVendorProgramOptions] = useState([]);
  const [fileSelected, setFileSelected] = useState(false);

  /**
   * Handles file selection change for import functionality.
   *
   * @function
   * @param {Event} event - The file input change event.
   */
  const handleFileChange = (event) => {
    setFileSelected(event.target.files && event.target.files.length > 0);
  };

  /**
   * Closes the import flyout.
   *
   * @function
   */
  const closeFlyout = () =>
    effects.setCustomState({ key: 'importFlyout', value: { show: false } });

  /**
   * Handles vendor selection change by updating the vendor state
   * and fetching the corresponding vendor program options.
   *
   * @function
   * @param {Event} event - The vendor selection event.
   */
  const handleVendorChange = (event) => {
    const selectedVendorId = event.detail?.value || event.target?.value;

    if (selectedVendorId) {
      setVendor(selectedVendorId);
      setVendorProgram('');

      const selectedVendor = vendorOptions.find(
        (vendorOption) => String(vendorOption.id) === String(selectedVendorId)
      );

      if (selectedVendor) {
        setVendorProgramOptions(selectedVendor.options || []);
      }
    }
  };

  /**
   * Handles vendor program selection change.
   *
   * @function
   * @param {Event} event - The vendor program selection event.
   */
  const handleVendorProgramChange = (event) => {
    const selectedProgram = event.detail?.value || event.target?.value;
    setVendorProgram(selectedProgram);
  };

  /**
   * Enables or disables the import button based on selected
   * vendor, vendor program, and file.
   *
   * @function
   */
  useEffect(() => {
    setEnableImport(
      vendor.length > 0 && vendorProgram.length > 0 && fileSelected
    );
  }, [vendor, vendorProgram, fileSelected]);

  /**
   * Populates vendor options based on importFlyoutConfig.
   *
   * @function
   */
  useEffect(() => {
    if (importFlyoutConfig?.options && importFlyoutConfig.options.length > 0) {
      setVendorOptions(importFlyoutConfig.options);
    }
  }, [importFlyoutConfig]);

  /**
   * Adds an event listener to handle vendor dropdown value changes.
   * Cleans up the event listener on component unmount.
   *
   * @function
   */
  useEffect(() => {
    const dropdownElement = document.getElementById('dropdown');
    if (dropdownElement) {
      dropdownElement.addEventListener('value-changed', handleVendorChange);
    }

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
   * Adds a listener to close the flyout gracefully when the event fires.
   * Cleans up the listener on component unmount.
   *
   * @function
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
    <Flyout
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
      <FlyoutHeader>
        <FlyoutTitle>
          {getDictionaryValueOrKey(importFlyout?.importTitle) || 'Import'}
        </FlyoutTitle>
      </FlyoutHeader>
      <FlyoutBody id="flyout-body">
        <p className="pt-1 mb-4 text-black-100">
          {getDictionaryValueOrKey(importFlyout?.completeTheRequiredFields)}
        </p>
        <div className="layout-container">
          <div className="form-elements">
            <div className="dropdown-group">
              {/* Vendor Dropdown */}
              <Dropdown
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
                {getDictionaryValueOrKey(importFlyout?.vendorImport)}
              </Dropdown>

              {/* Vendor Program Dropdown */}
              <Dropdown
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
                {getDictionaryValueOrKey(importFlyout?.vendorProgram)}
              </Dropdown>
            </div>

            {/* File Input */}
            <FileInput
              headingText={getDictionaryValueOrKey(importFlyout?.dragAndDrop)}
              secondaryText={getDictionaryValueOrKey(importFlyout?.maxSizeOf)}
              buttonText={getDictionaryValueOrKey(importFlyout?.browseFile)}
              iconName="upload"
              iconState="default"
              maxFileSize="2MB"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </FlyoutBody>
      <FlyoutFooter>
        <FlyoutButton
          disabled={!enableImport}
          type="button"
          variant="primary"
          theme="light"
          label={getDictionaryValueOrKey(importFlyout?.importTitle) || 'Import'}
          color="teal"
        >
          {getDictionaryValueOrKey(importFlyout?.importButton) || 'Import'}
        </FlyoutButton>
      </FlyoutFooter>
    </Flyout>
  );
}
