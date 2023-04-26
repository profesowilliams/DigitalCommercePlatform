import React, { memo, useEffect, useState } from 'react';
import { useStore } from '../../../../utils/useStore';
import Grid from '../Grid/Grid';
import ErrorBoundaryBaseGrid from './utils/ErrorBoundaryBaseGrid';
import { getBaseColumnDefinitions } from './utils/GenericColumnTypes';

const _BaseGrid = ({
  columnList,
  definitions,
  DetailRenderers,
  ...extendedConfig
}) => {
  const [gridKey, setGridKey] = React.useState(0);
  const userData = useStore(state => state.userData);
  const columnDefs = getBaseColumnDefinitions(columnList, definitions);

  useEffect(() => {
    setGridKey(gridKey + 1);
  }, [userData]);

  return (
    <div className="cmp-base-grid">
      <Grid key={gridKey}
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
