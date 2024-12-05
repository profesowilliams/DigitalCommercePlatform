import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import { debounce } from 'lodash';
import Flyout, {
  FlyoutHeader,
  FlyoutTitle,
  FlyoutBody,
  FlyoutFooter,
  FlyoutButton,
} from '../web-components/Flyout';
import Dropdown from '../web-components/Dropdown';
import FileInput from '../web-components/FileInput';
import {
  Toast,
  ToastBody,
  ToastHeader,
  ToastLink,
} from '../web-components/Toast';
import Upload from './Upload';
import Export from './Export';

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
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isImporting, setIsImporting] = useState(false);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('information');

  /**
   * Handles file selection and manages the upload process.
   *
   * This function debounces file selection events, validates the selected files,
   * and updates the `uploadedFiles` state. It also manages the `fileSelected`
   * state to enable or disable UI elements based on file selection.
   *
   * @function
   * @param {File[]} files - Array of selected file objects.
   * @returns {void}
   */
  const handleFileSelected = useCallback(
    debounce((files) => {
      if (files && files.length > 0) {
        setFileSelected(true);

        Upload.uploadFiles(
          files,
          (newUploadedFiles) => {
            if (Array.isArray(newUploadedFiles)) {
              setUploadedFiles((prevFiles) => [
                ...(Array.isArray(prevFiles) ? prevFiles : []),
                ...newUploadedFiles,
              ]);
            } else {
              console.error(
                'Uploaded files is not an array:',
                newUploadedFiles
              );
            }
          },
          importFlyout.importQuoteDocumentEndpointValidate
        );
      } else {
        setFileSelected(false);
      }
    }, 300),
    []
  );

  /**
   * Handles file removal by updating the uploadedFiles state.
   *
   * @function
   * @param {Object} removedFile - The file object that was removed.
   */
  const handleFileRemoved = (removedFile) => {
    // Remove the file from the uploadedFiles state
    setUploadedFiles((prevFiles) =>
      prevFiles.filter(
        (uploadedFile) => uploadedFile.file !== removedFile.file.name
      )
    );

    // Ensure the file is removed from the Upload module's tracker
    Upload.removeUploadedFile(removedFile.file.name);
  };

  const clearAllFiles = () => {
    const fileInputElement = document.querySelector('tds-file-input');
    if (fileInputElement) {
      const event = new CustomEvent('clear-file-uploads', {
        bubbles: true,
        composed: true,
      });
      fileInputElement.dispatchEvent(event);
    }
  };

  /**
   * Closes the import flyout and clears all related states, including uploaded files.
   *
   * @function
   */
  const closeFlyout = () => {
    // Hide the Flyout
    effects.setCustomState({ key: 'importFlyout', value: { show: false } });

    // Clear all related states
    setVendor(''); // Clear vendor state
    setVendorProgram(''); // Clear vendor program state
    setVendorOptions([]); // Clear vendor options
    setVendorProgramOptions([]); // Clear vendor program options
    setFileSelected(false); // Clear file input state
    setUploadedFiles([]); // Clear uploaded files

    // Clear all files
    clearAllFiles();
    Upload.resetUploadedFiles();
  };

  useEffect(() => {
    const dropdownElement = document.getElementById('vendorProgram');
    if (dropdownElement) {
      const listener = (event) => handleVendorProgramChange(event);
      dropdownElement.addEventListener('value-changed', listener);

      return () => {
        dropdownElement.removeEventListener('value-changed', listener);
      };
    }
  }, [vendorProgramOptions]);

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

    if (!selectedProgram) {
      console.log('No vendorProgram value detected in event:', event);
      return;
    }

    setVendorProgram(selectedProgram);
  };

  /**
   * Enables or disables the import button based on selected
   * vendor, vendor program, and file.
   *
   * @function
   */
  useEffect(() => {
    // Check if all required conditions are met
    const isImportEnabled =
      vendor.length > 0 && vendorProgram.length > 0 && uploadedFiles.length > 0; // Only enable if there are uploaded files

    setEnableImport(isImportEnabled);
  }, [vendor, vendorProgram, uploadedFiles]);

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
    const dropdownElement = document.getElementById('vendor');
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
    <>
      {/* Toast */}
      {toastVisible && (
        <Toast
          id="import-toast"
          variant={toastVariant}
          placement="top-right"
          size="medium"
          onClose={() => setToastVisible(false)} // Close the Toast
        >
          <ToastHeader>{toastMessage}</ToastHeader>
        </Toast>
      )}

      {/* Flyout */}
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
                  id="vendor"
                  required
                  optionTextKey="text"
                  optionValueKey="id"
                  value={vendor}
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
                  id="vendorProgram"
                  required
                  optionTextKey="text"
                  optionValueKey="text"
                  value={vendorProgram}
                  options={JSON.stringify(
                    vendorProgramOptions.map(({ text }) => ({
                      text,
                    }))
                  )}
                  {...(vendor ? {} : { disabled: true })}
                  onValueChanged={(event) => handleVendorProgramChange(event)}
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
                onFileSelected={handleFileSelected}
                onFileRemoved={handleFileRemoved}
              />
            </div>
          </div>
        </FlyoutBody>
        <FlyoutFooter>
          <FlyoutButton
            {...(!enableImport ? { disabled: '' } : {})}
            type="button"
            variant="primary"
            theme="light"
            label={
              getDictionaryValueOrKey(importFlyout?.importTitle) || 'Import'
            }
            color="teal"
            onClick={async () => {
              const selectedVendor = vendorOptions.find(
                (option) => String(option.id) === String(vendor)
              );
              const vendorName = selectedVendor ? selectedVendor.text : '';

              if (!vendorName || !vendorProgram) {
                setToastMessage(
                  'Please select a valid vendor and program before importing.'
                );
                setToastVariant('alert');
                setToastVisible(true);
                return;
              }

              const filesWithVendorInfo = uploadedFiles.map((file) => ({
                Id: file.id,
                FileName: file.file,
                VendorName: vendorName,
                ProgramName: vendorProgram,
              }));

              try {
                const response = await Export.submitFiles(
                  filesWithVendorInfo,
                  importFlyout.importQuoteDocumentEndpointExport
                );

                // Show success toast
                setToastMessage('Files imported successfully!');
                setToastVariant('confirmation');
                setToastVisible(true);

                closeFlyout();
              } catch (error) {
                console.error('Failed to import files:', error);

                // Show error toast
                setToastMessage('Failed to import files. Please try again.');
                setToastVariant('error');
                setToastVisible(true);
              }
            }}
          >
            {getDictionaryValueOrKey(importFlyout?.importButton) || 'Import'}
          </FlyoutButton>
        </FlyoutFooter>
      </Flyout>
    </>
  );
}
