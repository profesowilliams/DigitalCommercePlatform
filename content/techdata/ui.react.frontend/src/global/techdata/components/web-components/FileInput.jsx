import React, { forwardRef, useEffect, useRef, useCallback } from 'react';

/**
 * A React wrapper component for the `tds-file-input` web component.
 *
 * This component acts as a bridge between the `tds-file-input` custom web component
 * and React applications. It provides a simplified interface for managing file uploads
 * while supporting event handling for file selection, upload errors, and file removal.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.headingText - The main heading text displayed within the file input area.
 * @param {string} props.secondaryText - The secondary text displayed below the heading.
 * @param {string} props.buttonText - The text displayed on the file browse button.
 * @param {string} props.iconName - The name of the icon displayed within the file input area.
 * @param {string} props.iconState - The state of the icon (e.g., default, error).
 * @param {string} props.maxFileSize - The maximum allowed file size for uploads (e.g., "2MB").
 * @param {string[]} props.allowedFileTypes - An array of allowed MIME types for uploads (e.g., `['application/pdf']`).
 * @param {Function} props.onFileSelected - Callback function invoked when files are selected.
 *   Receives the selected files as a parameter.
 * @param {Function} props.onFileUploadError - Callback function invoked when a file upload error occurs.
 *   Receives an error object detailing the issue.
 * @param {Function} props.onFileRemoved - Callback function invoked when a file is removed.
 *   Receives the details of the removed file as a parameter.
 * @param {React.ReactNode} props.children - React nodes to be rendered inside the `tds-file-input` component.
 * @param {Object} rest - Additional props to be passed directly to the `tds-file-input` element.
 * @param {React.Ref} ref - A React reference to the `tds-file-input` web component instance.
 * @returns {JSX.Element} - A React component wrapping the `tds-file-input` web component.
 */
const FileInput = forwardRef(
  (
    {
      headingText,
      secondaryText,
      buttonText,
      iconName,
      iconState,
      maxFileSize,
      allowedFileTypes,
      onFileSelected,
      onFileUploadError,
      onFileRemoved,
      children,
      ...rest
    },
    ref
  ) => {
    const fileInputRef = useRef();
    const combinedRef = ref || fileInputRef;

    // Use stable callbacks
    const handleFileSelected = useCallback(
      (e) => {
        onFileSelected?.(e.detail.files);
      },
      [onFileSelected]
    );

    const handleFileUploadError = useCallback(
      (e) => {
        onFileUploadError?.(e.detail);
      },
      [onFileUploadError]
    );

    const handleFileRemoved = useCallback(
      (e) => {
        onFileRemoved?.(e.detail.removedFile);
      },
      [onFileRemoved]
    );

    useEffect(() => {
      const fileInputElement = combinedRef.current;

      if (fileInputElement) {
        // console.log('Attaching event listeners to FileInput');
        fileInputElement.addEventListener('file-selected', handleFileSelected);
        fileInputElement.addEventListener(
          'file-upload-error',
          handleFileUploadError
        );
        fileInputElement.addEventListener('file-removed', handleFileRemoved); // Attach the file-removed event
      }

      return () => {
        if (fileInputElement) {
          // console.log('Removing event listeners from FileInput');
          fileInputElement.removeEventListener(
            'file-selected',
            handleFileSelected
          );
          fileInputElement.removeEventListener(
            'file-upload-error',
            handleFileUploadError
          );
          fileInputElement.removeEventListener(
            'file-removed',
            handleFileRemoved
          ); // Remove the file-removed event
        }
      };
    }, [
      combinedRef,
      handleFileSelected,
      handleFileUploadError,
      handleFileRemoved,
    ]);

    return (
      <tds-file-input
        ref={combinedRef}
        headingText={headingText}
        secondaryText={secondaryText}
        buttonText={buttonText}
        iconName={iconName}
        iconState={iconState}
        maxFileSize={maxFileSize}
        allowedFileTypes={allowedFileTypes}
        {...rest}
      >
        {children}
      </tds-file-input>
    );
  }
);

export default FileInput;
