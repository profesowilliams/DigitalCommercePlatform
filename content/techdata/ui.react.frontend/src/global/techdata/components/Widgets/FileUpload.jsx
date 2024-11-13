import React, { useEffect, useRef } from 'react';
import axios from 'axios';

/**
 * FileUpload component for uploading files.
 * @param {Object} props - Component properties.
 * @param {string} props.headingText - Heading text for the file upload component.
 * @param {string} props.secondaryText - Secondary text for additional information on file upload.
 * @param {string} props.buttonText - Text for the file selection button.
 * @param {string} props.iconName - Name of the icon to display.
 * @param {string} props.iconState - State of the icon (e.g., "default").
 * @param {string} props.maxFileSize - Maximum file size allowed for uploads.
 * @param {Function} props.onChange - Event handler function for file selection change.
 * @returns {JSX.Element} The rendered FileUpload component.
 */
export default function FileUpload({
  headingText,
  secondaryText,
  buttonText,
  iconName,
  iconState,
  maxFileSize,
  onChange,
}) {
  const isUploading = useRef(false);

  /**
   * Handles file upload by sending a POST request to the File Upload API.
   * If the upload fails, dispatch an event with the error details.
   * @param {File} file - The file to be uploaded.
   */
  const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);

    if (onChange) {
      onChange({ target: { files: [file] } });
    }

    axios
      .post(
        'https://uat-ui.dc.tdebusiness.cloud/ui-renewal/v1/ImportDocumentQuote/Validate',
        formData,
        {
          headers: {
            Site: 'EU',
            'Content-Type': 'multipart/form-data',
            Consumer: 'Postman',
            'Accept-Language': 'en-US',
            TraceId: '123456',
          },
        }
      )
      .then((response) => {
        console.log('Upload successful:', response.data);
      })
      .catch((error) => {
        // Check if the response has an error with "isError" set to true
        const errorMessage =
          error.response?.data?.error?.isError &&
          error.response.data.error.messages?.[0];

        // Log the error for debugging
        console.log(
          'Dispatching error event for file:',
          file.name,
          'with error:',
          errorMessage
        );

        // Dispatch an event to communicate the file error back to File.tsx
        const errorEvent = new CustomEvent('file-upload-error', {
          detail: {
            fileName: file.name,
            error: errorMessage || 'An unknown error occurred.',
          },
          bubbles: true,
          composed: true,
        });
        document.dispatchEvent(errorEvent); // Dispatch to be caught by File.tsx
      });
  };

  const handleFileSelected = (event) => {
    if (isUploading.current) return;

    isUploading.current = true;
    const files = event.detail.files;
    files.forEach(uploadFile);

    setTimeout(() => {
      isUploading.current = false;
    }, 1000);
  };

  useEffect(() => {
    const fileInputComponent = document.querySelector('tds-file-input');
    if (fileInputComponent) {
      fileInputComponent.addEventListener('file-selected', handleFileSelected);
    }

    return () => {
      if (fileInputComponent) {
        fileInputComponent.removeEventListener(
          'file-selected',
          handleFileSelected
        );
      }
    };
  }, []);

  return (
    <div className="file-upload-container">
      <tds-file-input
        headingText={headingText}
        secondaryText={secondaryText}
        buttonText={buttonText}
        iconName={iconName}
        iconState={iconState}
        maxFileSize={maxFileSize}
      ></tds-file-input>
    </div>
  );
}
