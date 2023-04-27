import React from 'react';
import { isHouseAccount } from '../../../../../utils/user-utils';

const createColumn = (definition, bussinesConfig = {}) => {
  const { columnLabel, columnKey, sortable = false } = definition;
  if (!bussinesConfig?.createColumnComponent) {
    console.log('Object is missing required properties');
    return null;
  }
  const { columnOverrides = '', createColumnComponent = '' } = bussinesConfig;
  return {
    headerName: columnLabel,
    field: columnKey,
    sortable,
    ...(typeof createColumnComponent === 'function'
      ? { cellRenderer: (e) => createColumnComponent(e, definition) }
      : { cellRenderer: (e) => null }),
    ...(typeof columnOverrides === 'function'
      ? { ...columnOverrides(definition) }
      : {}),
  };
};

const withTryCatch = (fn) => (...args) => {
  try {
    return fn(...args);
  } catch (error) {
    console.log(`Error in ${fn.name}:`, error);
    throw `Error in ${fn.name}`;
  }
};

const createPlainTextColumn = (definition, bussinesConfig = {}) => createColumn(definition, bussinesConfig);

const createButtonListColumn = (definition, bussinesConfig = {}) => createColumn(definition, bussinesConfig);

const createPlainResellerColumn = (definition, bussinesConfig = {}) => {
  if (isHouseAccount()) {
    return createColumn(definition, bussinesConfig);
  } else {
    return null;
  }
};

const columnTypes = {
  plainText: withTryCatch(createPlainTextColumn),
  buttonList: withTryCatch(createButtonListColumn),
  plainResellerColumn: withTryCatch(createPlainResellerColumn),
};

window.getSessionInfo && window.getSessionInfo().then((data) => {
  columnTypes.plainResellerColumn = withTryCatch(createPlainResellerColumn);
});

export const getBaseColumnDefinitions = (originalDefinitions, bussinesConfig) =>
  originalDefinitions
    .map((definition) => columnTypes[definition.type](definition, bussinesConfig))
    .filter((c) => c !== null);
