import React from 'react';
function DNoteColumn({ line, id, openFilePdf }) {
  const handleDownload = () => {
    openFilePdf('DNote', id, line?.deliveryNotes[0]?.id);
  };
  return (
    <div
      className="order-line-details__content__downloadLink"
      onClick={handleDownload}
    >
      {line?.deliveryNotes[0]?.id || '-'}
    </div>
  );
}
export default DNoteColumn;
