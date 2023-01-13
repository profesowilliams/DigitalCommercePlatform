import React from 'react';
import Grid from '../Grid/Grid';
import { renewalsDefinitions } from '../RenewalsGrid/utils/renewalsDefinitions';
import ErrorBoundaryBaseGrid from './utils/ErrorBoundaryBaseGrid';
import { getBaseColumnDefinitions } from './utils/GenericColumnTypes';

function BaseGrid_({
  columnList,
  definitions,
  DetailRenderers,
  ...extendedConfig
}) {
  const columnDefs = getBaseColumnDefinitions(columnList, definitions);
  console.log('🚀extendedConfig >>',extendedConfig);
  return (
    <ErrorBoundaryBaseGrid>
      <div className="cmp-base-grid">
        <Grid
          columnDefinition={columnDefs}
          customizedDetailedRender={DetailRenderers}
          {...extendedConfig}
          />
      </div>
    </ErrorBoundaryBaseGrid>
  );
}

export default function BaseGrid(props) {
  return <ErrorBoundaryBaseGrid><BaseGrid_ {...props} /></ErrorBoundaryBaseGrid>;
}
