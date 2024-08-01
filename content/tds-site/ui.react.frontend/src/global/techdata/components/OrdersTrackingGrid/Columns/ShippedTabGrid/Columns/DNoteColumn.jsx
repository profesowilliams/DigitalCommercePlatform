import React from 'react';
import { useOrderTrackingStore } from '../../../../OrdersTrackingCommon/Store/OrderTrackingStore';

/**
 * DNoteColumn component is responsible for rendering the delivery note information 
 * within a specific column of a grid or table. It handles the display of the delivery 
 * note ID and provides an option to download the delivery note PDF if available.
 * 
 * @param {Object} props - The component properties.
 * @param {Object} props.line - The data for the current line item, representing a delivery note.
 * @param {string} props.id - The unique ID of the line item.
 * @param {Function} props.openFilePdf - Function to handle opening the delivery note PDF.
 * @returns {JSX.Element} The rendered component.
 */
function DNoteColumn({ line, id, openFilePdf }) {
  // Retrieve translations from the order tracking store
  const translations = useOrderTrackingStore((state) => state.uiTranslations);
  const errorMessagesTranslations = translations?.['OrderTracking.Common.ErrorMessages'];

  // Access the first delivery note from the line item data
  const firstDeliveryNote = line;
  const isDeliveryNoteDownloadable = firstDeliveryNote?.canDownloadDocument;

  /**
   * Handles the download of the delivery note PDF.
   * Calls the `openFilePdf` function with the necessary parameters if the document is downloadable.
   */
  const handleDownload = () => {
    if (isDeliveryNoteDownloadable) {
      openFilePdf(errorMessagesTranslations, 'DNote', id, firstDeliveryNote?.id);
    }
  };

  /**
   * Renders the content for the delivery note column.
   * If the delivery note is not downloadable, it shows the delivery note ID.
   * Otherwise, it renders a clickable link that initiates the download.
   * 
   * @returns {JSX.Element} The content to render.
   */
  const renderContent = () => {
    return !isDeliveryNoteDownloadable ? (
      firstDeliveryNote?.id
    ) : (
      <div onClick={handleDownload}>
        <a>{firstDeliveryNote?.id}</a>
      </div>
    );
  };

  // Return '-' if there are no delivery notes, otherwise render the content
  return line?.length === 0 ? '-' : renderContent();
}

export default DNoteColumn;