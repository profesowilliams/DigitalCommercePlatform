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
  ToastHeader,
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
   * Handles the removal of a selected file from the uploaded files list.
   *
   * This function removes the specified file from the `uploadedFiles` state and
   * ensures that the file is also removed from the internal tracker in the `Upload` module.
   *
   * @function
   * @param {Object} removedFile - The file object that was removed.
   * @param {File} removedFile.file - The actual file object being removed.
   * @param {string} removedFile.file.name - The name of the file being removed.
   * @returns {void}
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

  /**
   * Clears all uploaded files from the file input element.
   *
   * This function dispatches a custom event, `clear-file-uploads`, on the
   * `tds-file-input` component to clear all files in the file input interface.
   * It ensures that the UI reflects the removal of all uploaded files.
   * The event bubbles and is composed to reach its target element.
   *
   * @function
   * @returns {void}
   */
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
   * This function hides the Flyout component by updating its state in the global
   * store, clears all local states related to the import process, and resets any
   * uploaded files both in the UI and the `Upload` module.
   *
   * **Actions Performed:**
   * - Hides the Flyout by setting `importFlyout.show` to `false`.
   * - Clears the selected vendor, vendor program, and their options.
   * - Resets the file selection state and uploaded files list.
   * - Dispatches a custom event to clear all files in the file input element.
   * - Calls the `Upload.resetUploadedFiles` method to reset file tracking.
   *
   * @function
   * @returns {void}
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

  /**
   * Adds an event listener to the vendor program dropdown for handling value changes.
   *
   * This effect runs whenever the `vendorProgramOptions` state changes. It attaches
   * a `value-changed` event listener to the dropdown element with the ID `vendorProgram`.
   * When a value change event is triggered, the `handleVendorProgramChange` function
   * is called to update the state. The event listener is removed during cleanup to
   * prevent memory leaks.
   *
   * **Behavior:**
   * - Listens for the `value-changed` event on the `vendorProgram` dropdown.
   * - Triggers the `handleVendorProgramChange` function with the event as its argument.
   * - Cleans up by removing the event listener when the component unmounts or the
   *   `vendorProgramOptions` dependency changes.
   *
   * @function
   * @returns {void}
   */
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
   * Handles vendor selection change.
   *
   * This function updates the selected vendor state (`vendor`) based on the
   * value provided in the selection event. It clears the existing vendor program
   * state (`vendorProgram`) and fetches the available vendor program options for
   * the newly selected vendor. The vendor program options are then updated in
   * the state (`vendorProgramOptions`).
   *
   * @function
   * @param {Event} event - The vendor selection event.
   * @param {Object} event.detail - Custom event detail containing the selected value.
   * @param {string} event.detail.value - The ID of the selected vendor.
   * @param {HTMLElement} [event.target] - The target element that triggered the event.
   * @returns {void}
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
   * This function is triggered when the vendor program dropdown value changes.
   * It updates the `vendorProgram` state with the newly selected program value.
   * If no valid program value is detected in the event, it logs an informational
   * message to the console and does not update the state.
   *
   * @function
   * @param {Event} event - The vendor program selection event.
   * @param {Object} event.detail - Custom detail object containing the selected value.
   * @param {string} event.detail.value - The value of the selected vendor program.
   * @param {HTMLElement} [event.target] - The target element from which the value is derived.
   * @returns {void}
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
   * Enables or disables the import button based on selected vendor, vendor program, and uploaded files.
   *
   * This effect runs whenever the `vendor`, `vendorProgram`, or `uploadedFiles` state changes.
   * It checks whether all required conditions for enabling the import button are met:
   * - A vendor is selected.
   * - A vendor program is selected.
   * - At least one file has been uploaded.
   *
   * If all conditions are satisfied, the `enableImport` state is set to `true`,
   * enabling the import button. Otherwise, it is set to `false`.
   *
   * @function
   * @returns {void}
   */
  useEffect(() => {
    // Check if all required conditions are met
    const isImportEnabled =
      vendor.length > 0 && vendorProgram.length > 0 && uploadedFiles.length > 0; // Only enable if there are uploaded files

    setEnableImport(isImportEnabled);
  }, [vendor, vendorProgram, uploadedFiles]);

  /**
   * Populates vendor options based on the import flyout configuration.
   *
   * This effect runs whenever the `importFlyoutConfig` changes. It sets the
   * `vendorOptions` state with the options provided by the `importFlyoutConfig`.
   * If there is exactly one vendor option available, it automatically selects
   * that vendor by updating the `vendor` state and triggering the
   * `handleVendorChange` function to ensure dependent states like `vendorProgramOptions`
   * are also updated.
   *
   * @function
   * @returns {void}
   */
  useEffect(() => {
    if (importFlyoutConfig?.options && importFlyoutConfig.options.length > 0) {
      setVendorOptions(importFlyoutConfig.options);

      // Automatically select vendor if there's only one option
      if (importFlyoutConfig.options.length === 1) {
        const singleVendor = importFlyoutConfig.options[0].id;
        setVendor(singleVendor); // Set vendor state
        handleVendorChange({ detail: { value: singleVendor } }); // Trigger onValueChanged logic
      }
    }
  }, [importFlyoutConfig]);

  /**
   * Automatically selects the vendor program if there is only one available option.
   *
   * This effect runs whenever the `vendorProgramOptions` array changes. If the array
   * contains exactly one item, it updates the `vendorProgram` state with the single
   * option's `text` and triggers the `handleVendorProgramChange` function to simulate
   * a value selection event.
   *
   * @function
   * @returns {void}
   */
  useEffect(() => {
    if (vendorProgramOptions.length === 1) {
      const singleProgram = vendorProgramOptions[0].text;
      setVendorProgram(singleProgram); // Automatically set vendor program
      handleVendorProgramChange({ detail: { value: singleProgram } }); // Trigger logic
    }
  }, [vendorProgramOptions]);

  /**
   * Adds an event listener to the vendor dropdown for handling value changes.
   *
   * This effect attaches a `value-changed` event listener to the `vendor` dropdown
   * element whenever the `vendorOptions` state changes. The listener triggers the
   * `handleVendorChange` function, which updates the selected vendor and its related
   * state. The event listener is cleaned up when the component unmounts or when the
   * `vendorOptions` state changes.
   *
   * @function
   * @returns {void}
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
   * Adds an event listener to handle the `flyoutClosed` event on the Flyout component.
   *
   * This effect attaches a `flyoutClosed` event listener to the Flyout component referenced
   * by `flyoutRef`. When the event is triggered, the `closeFlyout` function is called to
   * clear related states and perform cleanup. The event listener is removed during cleanup
   * to prevent memory leaks.
   *
   * @function
   * @returns {void}
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
      <Toast
        id="import-toast"
        {...(toastVisible ? { show: '' } : {})}
        variant={toastVariant}
        placement="custom"
        top="6.6rem"
        right="0"
        size="medium"
        onClose={() => setToastVisible(false)} // Close the Toast
      >
        <ToastHeader>{toastMessage}</ToastHeader>
      </Toast>

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
                  value={
                    vendor ||
                    (vendorOptions.length === 1 ? vendorOptions[0].id : '')
                  }
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
                  value={
                    vendorProgram ||
                    (vendorProgramOptions.length === 1
                      ? vendorProgramOptions[0].text
                      : '')
                  }
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
                setToastVisible(false); // Explicitly set to false first
                setTimeout(() => {
                  setToastMessage(
                    'Please select a valid vendor and program before importing.'
                  );
                  setToastVariant('alert');
                  setToastVisible(true); // Reapply show after reset
                }, 10);
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
                setToastVisible(false); // Reset visibility first
                setTimeout(() => {
                  setToastMessage('Files imported successfully!');
                  setToastVariant('confirmation');
                  setToastVisible(true); // Reapply show after reset
                }, 10);

                closeFlyout();
              } catch (error) {
                console.error('Failed to import files:', error);

                // Show error toast
                setToastVisible(false); // Reset visibility first
                setTimeout(() => {
                  setToastMessage('Failed to import files. Please try again.');
                  setToastVariant('error');
                  setToastVisible(true); // Reapply show after reset
                }, 10);
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
