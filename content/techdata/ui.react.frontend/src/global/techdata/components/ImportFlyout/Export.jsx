import { post } from '../../../../utils/api'; 

const Export = {
  /**
   * Submits uploaded files to the server.
   * @param {Object[]} uploadedFiles - Array of uploaded files with `Id`, `FileName`, `VendorName`, and `ProgramName`.
   * @param {string} endpoint - The API endpoint for submitting files.
   * @returns {Promise<Object>} - The server response.
   */
  submitFiles: async (uploadedFiles, endpoint) => {
    if (!endpoint) {
      console.error('Invalid API endpoint.');
      throw new Error('API endpoint is required.');
    }

    try {
      // Use the post utility to send the request
      const response = await post(endpoint, uploadedFiles);

      // Return response content or error
      if (response.error && response.error.isError) {
        console.error('Submission failed with error:', response.error);
        return response.error;
      }

      return response.content;
    } catch (error) {
      console.error('An unexpected error occurred during submission:', error);
      throw error;
    }
  },
};

export default Export;
