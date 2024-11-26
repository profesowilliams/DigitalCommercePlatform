import React, { memo, useEffect, useState } from 'react';
import { useStore } from '../../../../utils/useStore';
import Grid from '../Grid/Grid';
import ErrorBoundaryBaseGrid from './utils/ErrorBoundaryBaseGrid';
import { getBaseColumnDefinitions } from './utils/GenericColumnTypes';
import { useRenewalGridState } from '../RenewalsGrid/store/RenewalsStore';

const _BaseGrid = ({
  columnList,
  definitions,
  DetailRenderers,
  ...extendedConfig
}) => {
  const [gridKey, setGridKey] = React.useState(0);
  const userData = useStore(state => state.userData);
  const columnDefs = getBaseColumnDefinitions(columnList, definitions, userData);
  const renewalsGridRefreshIndex = useRenewalGridState((state) => state.renewalsGridRefreshIndex);

  useEffect(() => {
    setGridKey(gridKey + 1);
  }, [userData]);

  return (
    <div className="cmp-base-grid">
      <Grid key={gridKey + renewalsGridRefreshIndex}
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
