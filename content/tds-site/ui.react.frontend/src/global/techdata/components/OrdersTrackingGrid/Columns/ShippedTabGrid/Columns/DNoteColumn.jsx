import React from 'react';
function DNoteColumn({ line, id, openFilePdf }) {
  const handleDownload = () => {
    openFilePdf('DNote', id, line?.id);
  };
  return (
    <div
      className="order-line-details__content__downloadLink"
      onClick={handleDownload}
    >
      {line?.id || '-'}
    </div>
  );
}
export default DNoteColumn;
