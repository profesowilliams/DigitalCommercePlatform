import React from 'react';
import ActionButton from './ActionButton';

const ActionsColumn = ({
  line,
  config = {},
  openFilePdf,
  apiResponse,
  hasAIORights,
  sortedLineDetails,
}) => {
  return (
    <div className="cmp-order-tracking-grid-details__splitLine-column">
      {sortedLineDetails(line)?.map((el, index) => (
        <ActionButton
          key={el.id}
          line={line}
          element={el}
          index={index}
          config={config}
          openFilePdf={openFilePdf}
          apiResponse={apiResponse}
          hasAIORights={hasAIORights}
        />
      ))}
    </div>
  );
};

export default ActionsColumn;
