import React from 'react';
function DNoteColumn({ line, id, openFilePdf }) {
  const firstDeliveryNote = line;
  const isDeliveryNoteDownloadable = firstDeliveryNote?.canDownloadDocument;
  const handleDownload = () => {
    if (isDeliveryNoteDownloadable) {
      openFilePdf('DNote', id, firstDeliveryNote?.id);
    }
  };
  const renderContent = () => {
    return !isDeliveryNoteDownloadable ? (
      firstDeliveryNote?.id
    ) : (
      <div onClick={handleDownload}>
        <a>{firstDeliveryNote?.id}</a>
      </div>
    );
  };
  return line?.length === 0 ? '-' : renderContent();
}
export default DNoteColumn;
