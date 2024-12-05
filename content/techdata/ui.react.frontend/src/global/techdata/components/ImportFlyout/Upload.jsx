import { post } from '../../../../utils/api'; // Assuming you have a generic POST utility

const Upload = {
  /**
   * Tracks uploaded file names to prevent duplicate uploads.
   * @type {Set<string>}
   */
  uploadedFileNames: new Set(),

  /**
   * Uploads selected files and updates the uploadedFiles state.
   * Deduplicates uploads by skipping files already uploaded.
   * @param {File[]} files - Array of files to be uploaded.
   * @param {Function} setUploadedFiles - Function to update the uploaded files state.
   * @param {string} endpoint - The API endpoint for file validation.
   */
  uploadFiles: async (files, setUploadedFiles, validateEndpoint) => {
    if (!validateEndpoint) {
      console.error('Validation endpoint is missing.');
      return;
    }

    const validFiles = [];

    for (const file of files) {
      if (Upload.uploadedFileNames.has(file.name)) {
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        // Validate file using the validation endpoint
        const validationResponse = await post(validateEndpoint, formData);

        // Log the response for debugging
        console.log(
          `Validation response for ${file.name}:`,
          validationResponse
        );

        // Extract uploadStatus array from the response
        const uploadStatus = validationResponse.data?.content?.uploadStatus;

        if (!uploadStatus || uploadStatus.length === 0) {
          console.error(
            `Validation failed: No upload status returned for file: ${file.name}`
          );
          continue;
        }

        const fileStatus = uploadStatus[0]; // Get the first file status
        if (!fileStatus.id) {
          console.error(`Validation failed: Missing ID for file: ${file.name}`);
          continue;
        }

        console.log(`File validated successfully: ${file.name}`);
        validFiles.push({
          file: fileStatus.file,
          id: fileStatus.id,
        });

        // Add the file name to the tracker to prevent duplicate uploads
        Upload.uploadedFileNames.add(file.name);
      } catch (error) {
        console.error('Error validating file:', file.name, error);
      }
    }

    if (Array.isArray(validFiles) && validFiles.length > 0) {
      // Resolve the array before passing to setUploadedFiles
      const updatedFiles = (prevFiles) => [
        ...(Array.isArray(prevFiles) ? prevFiles : []),
        ...validFiles,
      ];

      // Apply the resolved array
      setUploadedFiles(updatedFiles([]));
    } else {
      console.warn('No valid files to add to uploadedFiles:', validFiles);
    }
  },

  /**
   * Removes a file from the uploaded file tracker.
   * @param {string} fileName - The name of the file to remove.
   */
  removeUploadedFile: (fileName) => {
    if (Upload.uploadedFileNames.has(fileName)) {
      Upload.uploadedFileNames.delete(fileName);
      console.log(`File removed from tracker: ${fileName}`);
    } else {
      console.log(`File not found in tracker: ${fileName}`);
    }
  },

  /**
   * Resets the uploaded file tracker. Useful when clearing state or retrying.
   */
  resetUploadedFiles: () => {
    Upload.uploadedFileNames.clear();
    console.log('Uploaded file tracker reset.');
  },
};

export default Upload;
