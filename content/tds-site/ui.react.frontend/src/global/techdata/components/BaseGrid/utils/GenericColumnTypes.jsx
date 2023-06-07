import React from 'react';
import { isHouseAccount } from '../../../../../utils/user-utils';

const createColumn = (definition, businessConfig = {}, userData) => {
  const { columnLabel, columnKey, sortable = false } = definition;
  if (!businessConfig?.createColumnComponent) {
    console.log('Object is missing required properties');
    return null;
  }
  const { columnOverrides = '', createColumnComponent = '' } = businessConfig;
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

const createPlainTextColumn = (definition, businessConfig = {}, userData) => createColumn(definition, businessConfig, userData);

const createButtonListColumn = (definition, businessConfig = {}, userData) => createColumn(definition, businessConfig, userData);

const createPlainResellerColumn = (definition, businessConfig = {}, userData) => {
  if (isHouseAccount(userData)) {
    return createColumn(definition, businessConfig, userData);
  } else {
    return null;
  }
};

const columnTypes = {
  plainText: withTryCatch(createPlainTextColumn),
  buttonList: withTryCatch(createButtonListColumn),
  plainResellerColumn: withTryCatch(createPlainResellerColumn),
};

export const getBaseColumnDefinitions = (originalDefinitions, businessConfig, userData) =>
  originalDefinitions
    .map((definition) => columnTypes[definition.type](definition, businessConfig, userData))
    .filter((c) => c !== null);
