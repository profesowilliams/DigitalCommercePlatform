import React from 'react';
import ActionButton from './ActionButton';

const ActionsColumn = ({
  line,
  config = {},
  openFilePdf,
  hasAIORights,
  sortedLineDetails,
}) => {
  return (
    <div className="cmp-order-tracking-grid-details__splitLine-column">
      {sortedLineDetails(line)?.map((el, index) => (
        <ActionButton
          key={line.tdNumber + index}
          line={line}
          element={el}
          index={index}
          config={config}
          openFilePdf={openFilePdf}
          hasAIORights={hasAIORights}
        />
      ))}
    </div>
  );
};

export default ActionsColumn;
