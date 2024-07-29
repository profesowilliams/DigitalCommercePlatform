import React, { useEffect, useState, useRef, Fragment, useMemo } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import { LicenseManager } from "ag-grid-enterprise";
import { getDictionaryValue, getDictionaryValueOrKey, hasSearchOrFilterPresent, } from '../../../../../utils/utils';

import { LoaderIcon } from '../../../../../fluentIcons/FluentIcons';

function Grid(props) {
  let {
    columnDefinition,
    options,
    config,
    data,
    onAfterGridInit,
    onRowSelected,
    onSelectionChanged,
    getRowIdCallback,
    onSortChanged,
    handlerIsRowMaster,
    icons,
    customizedDetailedRender,
    onExpandAnalytics,
    onCollapseAnalytics,
    onCellMouseOver,
    onCellMouseOut,
    suppressPaginationPanel = false,
    suppressRowTransform = true,
    getRowId,
    responseError = null,
    rowClassRules,
    gridRef,
    customErrorMessage = null,
    suppressMultiSort = false,
  } = Object.assign({}, props);
  let isLicenseSet = false;
  const gridData = data;
  const [agGrid, setAgGrid] = useState(null);
  const noRowsErrorMessage = useRef(null);
  const popupParent = useMemo(() => document.querySelector('body'), []);
  const pagination =
    config?.paginationStyle &&
    config?.paginationStyle !== 'none' &&
    config?.paginationStyle !== 'scroll';
  const serverSide = config?.serverSide ?? true;
  const suppressContextMenu = config?.suppressContextMenu ?? false;
  const enableCellTextSelection = config?.enableCellTextSelection ?? false;
  const ensureDomOrder = config?.ensureDomOrder ?? false;
  const gridNodeRef = useRef(null);
  const gridApi = useRef(null);
  const DEFAULT_ROW_HEIGHT = 25;

  const getAgGridDomLayout = () => {
    if (config?.domLayout) return config.domLayout;
    if (serverSide) {
      return pagination ? 'autoHeight' : 'normal';
    }
    return 'autoHeight';
  };

  const CustomNoRowsOverlay = (props) => {
    const configInfo = hasSearchOrFilterPresent()
      ? {
        src: config.searchResultsError?.noResultsImage,
        title: config.searchResultsError?.noResultsTitle,
        description: config.searchResultsError?.noResultsDescription,
      }
      : {
        src: config.searchResultsError?.noDataImage,
        title: config.searchResultsError?.noDataTitle,
        description: config.searchResultsError?.noDataDescription,
      };

    if (customErrorMessage) {
      return (
        <div className=" customErrorNoRows">
          {getDictionaryValue(
            'techdata.grids.message.noRows',
            'No rows found.'
          )}
          <i className="far info-circle errorIcon"></i>
        </div>
      );
    }

    return (
      <>
        {config.searchResultsError ? (
          <div className="cmp-renewal-search-error">
            <div>
              <img
                className="cmp-renewal-search-error__image"
                src={configInfo.src}
              />
            </div>
            <div className="cmp-renewal-search-error__title">
              {getDictionaryValueOrKey(configInfo.title)}
            </div>
            <div className="cmp-renewal-search-error__description">
              {getDictionaryValueOrKey(configInfo.description)}
            </div>
          </div>
        ) : (
          <div className=" customErrorNoRows">
            {getDictionaryValueOrKey(props.noRowsMessageFunc(props))}
            <i className="far info-circle errorIcon"></i>
          </div>
        )}
      </>
    );
  };

  const noRowMsg = {
    noRowsMessageFunc: (props) => {
      return noRowsErrorMessage.current;
    },
  };

  const CustomLoadingCellRenderer = (props) => {
    return (
      <div
        className="ag-custom-loading-cell"
        style={{ paddingLeft: '10px', paddingTop: '50px', lineHeight: '25px' }}
      >
        <LoaderIcon />{' '}
        <span>{props.loadingMessage}</span>
      </div>
    );
  };

  const loadingCellRendererParams = useMemo(() => {
    return {
      loadingMessage: getDictionaryValueOrKey('Loading...'),
    };
  }, []);

  const setLicenseKey = () => {
    if (isLicenseSet != true) {
      LicenseManager.setLicenseKey(config.agGridLicenseKey);
      isLicenseSet = true;
    }
  };

  const renderers = {
    CustomNoRowsOverlay: CustomNoRowsOverlay,
    CustomLoadingCellRenderer,
  };
  let filteredColumns = [];

  setLicenseKey();

  // disable default behaviour of column being movable
  columnDefinition.forEach((column) => {
    if (column.movable !== true || column.suppressMovable === false)
      column.suppressMovable = true;
  });

  // overwrite config in column definitions with config from AEM
  config?.columnList?.forEach((column) => {
    const el = columnDefinition.find((_) => {
      return _.field === column.columnKey;
    });
    if (el) {
      // translation
      column.columnLabel !== undefined && (el.headerName = column.columnLabel);
      // sortable attribute
      column.sortable !== undefined && (el.sortable = column.sortable);
      // check for render function
      if (el.cellRenderer) renderers[el.field] = el.cellRenderer;
      // attach detail renderer if exist
      if (el.expandable && el.detailRenderer)
        renderers.$$detailRenderer = el.detailRenderer;
      filteredColumns.push(el);
    }
  });

  // fallback in case of lack of columnList from AEM
  if (filteredColumns.length === 0) {
    columnDefinition.forEach((column) => {
      if (column.cellRenderer) renderers[column.field] = column.cellRenderer;
      if (column.expandable && column.detailRenderer)
        renderers.$$detailRenderer = column.detailRenderer;
    });
    filteredColumns = columnDefinition;
  }

  if (typeof customizedDetailedRender === 'function')
    renderers.$$detailRenderer = customizedDetailedRender;
  // overwrite options with options from AEM
  if (options) {
    for (let key in options) {
      config.options[key] && (options[key] = config.options[key]);
    }
  } else {
    options = config.options;
  }

  const handleNoRowMsg = (itemsCount) => {
    console.log('Grid::handleNoRowMsg');
    if (!itemsCount) {
      console.log('Grid::handleNoRowMsg::noRows');
      noRowsErrorMessage.current = getDictionaryValue(
        'techdata.grids.message.noRows',
        'No rows found.'
      );
      gridApi.current.showNoRowsOverlay();
    }
  };

  function onGridReady(_) {
    console.log('Grid::onGridReady');

    _.api.sizeColumnsToFit();
    gridApi.current = _.api;

    // apply default sorting
    if (options?.defaultSortingColumnKey) {
      _.columnApi.applyColumnState({
        state: [
          {
            colId: options.defaultSortingColumnKey,
            sort: options.defaultSortingDirection ?? 'desc',
          },
        ],
        defaultState: { sort: null },
      });
    }

    // fire onAfterGridInit callback and pass AG grid object to parent
    if (typeof onAfterGridInit === 'function') {
      onAfterGridInit({
        node: gridNodeRef.current,
        api: _.api,
        columnApi: _.columnApi,
        gridResetRequest: () => resetGrid(),
        handleNoRowMsg: (itemsCount) => handleNoRowMsg(itemsCount)
      });
    }
  }

  function onFirstDataRendered() {
    console.log('Grid::onFirstDataRendered');
    gridApi?.current?.sizeColumnsToFit();
  }

  function onRowExpandOrCollapse(row) {
    console.log('Grid::onRowExpandOrCollapse');
    const columnKeys = Object.keys(row.data);
    columnKeys.forEach((key) => {
      const columnDef = filteredColumns.find((el) => {
        return el.field === key;
      });
      switch (row.expanded) {
        case true:
          if (typeof columnDef?.onDetailsShown === 'function') {
            columnDef.onDetailsShown(row);
          }
          break;
        case false:
          if (typeof columnDef?.onDetailsHidden === 'function') {
            columnDef.onDetailsHidden(row);
          }
          break;
        default:
          break;
      }
    });
    gridApi?.current?.sizeColumnsToFit();
  }

  function onRowGroupOpened(row) {
    console.log('Grid::onRowGroupOpened');
    if (onExpandAnalytics && onCollapseAnalytics)
      row.expanded ? onExpandAnalytics(row) : onCollapseAnalytics(row);
    onRowExpandOrCollapse(row);
  }

  function onExpandOrCollapseAll(_) {
    console.log('Grid::onExpandOrCollapseAll');
    _.api.forEachNode((node) => {
      onRowExpandOrCollapse(node);
    });
  }

  function getRowHeight(row) {
    console.log('Grid::getRowHeight');
    if (row?.data) {
      const heights = [];
      const columnKeys = Object.keys(row.data);
      columnKeys.forEach((key) => {
        const columnDef = filteredColumns.find((el) => {
          return el.field === key;
        });
        if (typeof columnDef?.cellHeight === 'function') {
          heights.push(columnDef.cellHeight(row));
        }
      });
      const maxHeight = Math.max(...heights);
      return maxHeight > 0 ? maxHeight : DEFAULT_ROW_HEIGHT;
    }
  }

  function getRowClass(row) {
    console.log('Grid::getRowClass');
    if (row?.data) {
      let classes = '';
      const columnKeys = Object.keys(row.data);
      columnKeys.forEach((key) => {
        const columnDef = filteredColumns.find((el) => {
          return el.field === key;
        });
        if (typeof columnDef?.rowClass === 'function') {
          classes = columnDef?.rowClass(row);
        }
      });
      return classes.trim();
    }
  }

  useEffect(() => {
    console.log('Grid::useEffect');
    setAgGrid(<AgGrid />);
  }, []);

  useEffect(() => {
    console.log('Grid::useEffect2');
    if (responseError) {
      gridApi.current?.showNoRowsOverlay();
    }
  }, [responseError, gridApi.current]);

  /*
    function that returns AG grid vnode outside main return function to keep that
    node on useState hook and set it once per component lifecycle or on demand
  */
  const AgGrid = () => (
    <AgGridReact
      masterDetail={true}
      isRowMaster={function (dataItem) {
        if (typeof handlerIsRowMaster === 'function') {
          return handlerIsRowMaster(dataItem);
        } else {
          return true;
        }
      }}
      key={Math.floor(1000 * Math.random()).toString()}
      frameworkComponents={renderers}
      noRowsOverlayComponent={'CustomNoRowsOverlay'}
      noRowsOverlayComponentParams={noRowMsg}
      loadingCellRenderer={'CustomLoadingCellRenderer'}
      loadingCellRendererParams={loadingCellRendererParams}
      loadingOverlayComponent={'CustomLoadingCellRenderer'}
      loadingOverlayComponentParams={loadingCellRendererParams}
      pagination={pagination}
      paginationPageSize={config.itemsPerPage}
      cacheBlockSize={config.itemsPerPage}
      maxBlocksInCache={config.itemsPerPage}
      rowModelType={serverSide ? 'serverSide' : 'clientSide'}
      rowData={gridData}
      onGridReady={onGridReady}
      serverSideStoreType={serverSide ? 'partial' : 'full'}
      rowHeight={DEFAULT_ROW_HEIGHT}
      detailCellRenderer={'$$detailRenderer'}
      detailRowAutoHeight={true}
      animateRows={false}
      domLayout={getAgGridDomLayout()}
      onFirstDataRendered={onFirstDataRendered}
      onRowGroupOpened={onRowGroupOpened}
      onExpandOrCollapseAll={onExpandOrCollapseAll}
      onRowSelected={onRowSelected}
      onCellMouseOver={onCellMouseOver}
      onCellMouseOut={onCellMouseOut}
      onSelectionChanged={onSelectionChanged}
      rowSelection={'multiple'}
      getRowHeight={getRowHeight}
      getRowClass={getRowClass}
      getRowNodeId={getRowIdCallback}
      suppressRowClickSelection={true}
      suppressPropertyNamesCheck={true}
      suppressPaginationPanel={suppressPaginationPanel}
      suppressRowTransform={suppressRowTransform}
      onSortChanged={onSortChanged}
      icons={icons}
      suppressContextMenu={suppressContextMenu}
      enableCellTextSelection={enableCellTextSelection}
      ensureDomOrder={ensureDomOrder}
      popupParent={popupParent}
      getRowId={getRowId}
      rowClassRules={rowClassRules}
      ref={gridRef}
      suppressMultiSort={suppressMultiSort}
    >
      {filteredColumns.map((column) => {
        return (
          <AgGridColumn
            {...column}
            cellRenderer={
              column.expandable
                ? 'agGroupCellRenderer'
                : renderers[column.field] && column.field
            }
            suppressMenu={true}
            key={column.field}
          ></AgGridColumn>
        );
      })}
    </AgGridReact>
  );

  return (
    <div className={`cmp-grid ag-theme-alpine`} ref={gridNodeRef}>
      {agGrid}
    </div>
  );
}

export default Grid;