import React, { memo } from 'react';
import Grid from '../Grid/Grid';
import ErrorBoundaryBaseGrid from './utils/ErrorBoundaryBaseGrid';
import { getBaseColumnDefinitions } from './utils/GenericColumnTypes';

const _BaseGrid = ({
  columnList,
  definitions,
  DetailRenderers,
  ...extendedConfig
}) => {
  const columnDefs = getBaseColumnDefinitions(columnList, definitions);
  return (
    <div className="cmp-base-grid">
      <Grid
        columnDefinition={columnDefs}
        customizedDetailedRender={DetailRenderers}
        suppressPaginationPanel={true}
        {...extendedConfig}
      />
    </div>
  );
};

function BaseGridWithErrorBoundary(props) {
  return (
    <ErrorBoundaryBaseGrid>
      <_BaseGrid {...props} />
    </ErrorBoundaryBaseGrid>
  );
}

export default memo(BaseGridWithErrorBoundary);
