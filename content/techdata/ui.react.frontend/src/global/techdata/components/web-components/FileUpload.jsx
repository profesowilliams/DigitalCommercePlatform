import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

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
  const [uploadedFiles, setUploadedFiles] = useState([]);

  /**
   * Handles file upload by sending a POST request to the File Upload API.
   * If the upload succeeds, appends the response data to the state.
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
            Site: 'VN',
            'Content-Type': 'multipart/form-data',
            Consumer: 'Postman',
            'Accept-Language': 'en-US',
            TraceId: '123456',
            Sessionid: 'YmQ0MmM5ZDMtYWQyZi00ZmEwLTk2NTQtMGMyNmYzZjgzOGJk',
          },
        }
      )
      .then((response) => {
        console.log('Upload successful:', response.data);

        // Append the response data to the uploadedFiles state
        setUploadedFiles((prevFiles) => [
          ...prevFiles,
          ...response.data.content.uploadStatus,
        ]);
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.error?.isError &&
          error.response.data.error.messages?.[0];

        console.log(
          'Dispatching error event for file:',
          file.name,
          'with error:',
          errorMessage
        );

        const errorEvent = new CustomEvent('file-upload-error', {
          detail: {
            fileName: file.name,
            error: errorMessage || 'An unknown error occurred.',
          },
          bubbles: true,
          composed: true,
        });
        document.dispatchEvent(errorEvent);
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

  // Log uploaded files to console whenever the state changes
  useEffect(() => {
    console.log('Updated uploadedFiles state:', uploadedFiles);
  }, [uploadedFiles]);

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
