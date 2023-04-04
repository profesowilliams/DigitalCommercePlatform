import React from 'react';
import { getDictionaryValueOrKey } from '../../../utils/utils';

function useTableFlyout({selected, setSelected, columnList, config}) {

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };
  const createData = (dataObj) => {
    return {
      ...dataObj,
    };
  };
  const getRows = (config, ...headTags) => {
    if (!config?.data || !Array.isArray(config.data)) {
      return [];
    }
    return config.data
      .filter(
        (e) =>
          e &&
          typeof e === 'object' &&
          headTags.every((tag) => e.hasOwnProperty(tag))
      )
      .map((e) =>
        createData(
          headTags.reduce((acc, tag) => ({ ...acc, [tag]: e[tag] }), {})
        )
      );
  };

  const headTags = columnList.map((e) => e.columnKey);
  const rows = getRows(config, ...headTags);
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n[headTags[0]]);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  const useHeadCells = (list) =>
    list.map((e) => ({
      id: e.columnKey,
      label: e.columnLabel,
    }));
  const headCells = useHeadCells(columnList);

  const SecondaryButton = (selectedParam, secondaryParam) => {
    if (selectedParam.length > 0) {
      return (
        <button
          className="cmp-flyout__footer-button--secondary"
          onClick={handleSelectAllClick}
        >
          {getDictionaryValueOrKey(secondaryParam)}
        </button>
      );
    }
    return null;
  };
  return { handleClick, handleSelectAllClick, rows, headCells, SecondaryButton};
}

export default useTableFlyout;
