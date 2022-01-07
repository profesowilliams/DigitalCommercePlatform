import React, { useEffect, useState, useRef, Fragment } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import { LicenseManager } from 'ag-grid-enterprise';
import { get } from "../../../../utils/api";

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
    onModelUpdateFinished,
    requestInterceptor,
    onSortChanged,
    handlerIsRowMaster,
  } = Object.assign({}, props);
  let isLicenseSet = false;
  const componentVersion = "1.2.0";
  const gridData = data;
  const [agGrid, setAgGrid] = useState(null);
  const [actualRange, setActualRange] = useState({
    from: null,
    to: null,
    total: null,
  });
  const pagination =
    config?.paginationStyle &&
    config?.paginationStyle !== "none" &&
    config?.paginationStyle !== "scroll";
  const serverSide = config?.serverSide ?? true;
  const gridNodeRef = useRef(null);
  const gridId = useRef(null);
  const gridApi = useRef(null);
  const DEFAULT_ROW_HEIGHT = 25;

  const updatingFinished =
    typeof onModelUpdateFinished === "function"
      ? debouncer(200, () => onModelUpdateFinished())
      : null;

  const getAgGridDomLayout = () => {
    if (serverSide) {
      return pagination ? "autoHeight" : "normal";
    }
    return "autoHeight";
  };

  const CustomNoRowsOverlay = (props) => {
    return (
      <div className=" customErrorNoRows">
        {props.noRowsMessageFunc()}
        <i className="far info-circle errorIcon"></i>
      </div>
    );
  };

  const noRowMsg = {
    noRowsMessageFunc: () => 'Sorry - no rows to display!'
  }

  /*
    function that returns AG grid vnode outside main return function to keep that
    node on useState hook and set it once per component lifecycle or on demand
  */
  const AgGrid = () => (
    <AgGridReact
      masterDetail={true}
      isRowMaster={function (dataItem) {
        if (typeof handlerIsRowMaster === "function") {
          return handlerIsRowMaster(dataItem);
        }
      }}
      key={Math.floor(1000 * Math.random()).toString()}
      frameworkComponents={renderers}
      noRowsOverlayComponent={'CustomNoRowsOverlay'}
      noRowsOverlayComponentParams={noRowMsg}
      pagination={pagination}
      paginationPageSize={config.itemsPerPage}
      cacheBlockSize={config.itemsPerPage}
      maxBlocksInCache={config.itemsPerPage}
      rowModelType={serverSide ? "serverSide" : "clientSide"}
      rowData={gridData}
      onGridReady={onGridReady}
      serverSideDatasource={serverSide && createDataSource()}
      serverSideStoreType={serverSide ? "partial" : "full"}
      rowSelection="single"
      rowHeight={DEFAULT_ROW_HEIGHT}
      onViewportChanged={onViewportChanged}
      blockLoadDebounceMillis={100}
      masterDetail={true}
      detailCellRenderer={"$$detailRenderer"}
      detailRowAutoHeight={true}
      animateRows={false}
      domLayout={getAgGridDomLayout()}
      onFirstDataRendered={onFirstDataRendered}
      onRowGroupOpened={onRowGroupOpened}
      onExpandOrCollapseAll={onExpandOrCollapseAll}
      onRowSelected={onRowSelected}
      onSelectionChanged={onSelectionChanged}
      rowSelection={"multiple"}
      getRowHeight={getRowHeight}
      getRowClass={getRowClass}
      getRowNodeId={getRowIdCallback}
      suppressRowClickSelection={true}
      suppressPropertyNamesCheck={true}
      onCellValueChanged={onModelUpdated}
      onModelUpdated={onModelUpdated}
      onSortChanged={onSortChanged}
    >
      {filteredColumns.map((column) => {
        return (
          <AgGridColumn
            {...column}
            cellRenderer={
              column.expandable
                ? "agGroupCellRenderer"
                : renderers[column.field] && column.field
            }
            suppressMenu={true}
            key={column.field}
          ></AgGridColumn>
        );
      })}
    </AgGridReact>
  );

  const setLicenseKey = () => {
    if (isLicenseSet != true) {
      LicenseManager.setLicenseKey(config.agGridLicenseKey);
      isLicenseSet = true;
    }
  };

  const renderers = {
    CustomNoRowsOverlay: CustomNoRowsOverlay
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

  // overwrite options with options from AEM
  if (options) {
    for (let key in options) {
      config.options[key] && (options[key] = config.options[key]);
    }
  } else {
    options = config.options;
  }

  function resetGrid() {
    setAgGrid(<AgGrid />);
  }

  function createDataSource() {
    return {
      getRows: (params) => {
        const pageNo = params.request.endRow / config.itemsPerPage;
        const sortKey = params.request.sortModel?.[0]?.colId;
        const sortDir = params.request.sortModel?.[0]?.sort;

        const handleNoRowMsg = (response) => {
          if (!response?.items || response?.items.length === 0) {
            gridApi.current.showNoRowsOverlay();
          }
        }

        getGridData(config.itemsPerPage, pageNo, sortKey, sortDir, handleNoRowMsg).then(
          (response) => {
            params.success({
              rowData: response?.items ?? 0,
              lastRow: response?.totalItems ?? 0,
              rowCount: response?.totalItems ?? 0,
            });
            handleNoRowMsg(response)
          }
        );
      },
    };
  }

  async function getGridData(pageSize, pageNumber, sortKey, sortDir) {
    if (gridId.current) {
      // check if there are additional query params in url, append grid specific params
      const url = new URL(config.uiServiceEndPoint);
      const pages = `PageSize=${pageSize}&PageNumber=${pageNumber}`;
      const sortParams =
        sortKey && sortDir
          ? `&SortDirection=${sortDir}&SortBy=${sortKey}&WithPaginationInfo=true`
          : "&SortDirection=desc&SortBy=id&WithPaginationInfo=true"; // For some reason the sortKey and sortDir is coming like undefined so force the Sortparam to don't break the component
      let pathName = url.pathname ?? "";
      pathName.slice(-1) === "/" && (pathName = pathName.slice(0, -1));
      const apiUrl = `${url.origin}${pathName ?? ""}${url.search ?? ""}${url.search !== "" ? "&" : "?"
        }${pages}${sortParams}`;
      let response = null;
      // check if request interceptor is attached and use it.
      // otherwise get data according to grid state
      if (typeof requestInterceptor === "function") {
        response = await requestInterceptor({
          url: apiUrl,
          get: async (_url) => {
            globalThis[`$$tdGrid${gridId.current}`]?.onAjaxCall(_url);
            return get(_url);
          },
        });
      } else {
        globalThis[`$$tdGrid${gridId.current}`]?.onAjaxCall(apiUrl);
        response = await get(apiUrl);
      }
      globalThis[`$$tdGrid${gridId.current}`]?.onNewGridDataLoaded(response);
      return response?.data?.content;
    }
  }

  function onModelUpdated(_) {
    updatingFinished && updatingFinished.call(true);
  }

  function onGridReady(_) {
    if (!gridId.current) {
      let str = Math.floor(1000 * Math.random()).toString();
      let pad = "0000";
      gridId.current = pad.substring(0, pad.length - str.length) + str;
    }
    _.api.sizeColumnsToFit();
    gridApi.current = _.api;
    // apply default sorting
    if (options?.defaultSortingColumnKey) {
      _.columnApi.applyColumnState({
        state: [
          {
            colId: options.defaultSortingColumnKey,
            sort: options.defaultSortingDirection ?? "desc",
          },
        ],
        defaultState: { sort: null },
      });
    }
    // expose this instance of grid object globally for debug purposes
    // keep custom hooks after grid refresh
    globalThis[`$$tdGrid${gridId.current}`] = {
      version: componentVersion,
      node: gridNodeRef.current,
      api: _.api,
      props: props,
      onAjaxCall: globalThis[`$$tdGrid${gridId.current}`]?.onAjaxCall
        ? globalThis[`$$tdGrid${gridId.current}`].onAjaxCall
        : (apiUrl) => null,
      onNewGridDataLoaded: globalThis[`$$tdGrid${gridId.current}`]
        ?.onNewGridDataLoaded
        ? globalThis[`$$tdGrid${gridId.current}`].onNewGridDataLoaded
        : (response) => null,
    };
    // fire onAfterGridInit callback and pass AG grid object to parent
    if (typeof onAfterGridInit === "function") {
      onAfterGridInit({
        node: gridNodeRef.current,
        api: _.api,
        columnApi: _.columnApi,
        gridResetRequest: () => resetGrid(),
      });
    }
  }

  function onResize() {
    gridApi?.current?.sizeColumnsToFit();
  }

  function onViewportChanged(_) {
    if (config.paginationStyle === "scroll") {
      const renderedNodes = _.api.getRenderedNodes();
      const applyRange = () => {
        const rowContainer =
          gridNodeRef.current.querySelector(".ag-body-viewport");
        const bbox = rowContainer.getBoundingClientRect();
        // DEFAULT_ROW_HEIGHT / 2 is fix for FireFox
        // FF is unable to get element from bottom bbox coords
        // so margin has to be applied
        const firstRowIndex = parseInt(
          document
            .elementFromPoint(bbox.x, bbox.y)
            ?.closest(".ag-row")
            ?.getAttribute("row-index")
        );
        const lastRowIndex = parseInt(
          document
            .elementFromPoint(bbox.x, bbox.bottom - DEFAULT_ROW_HEIGHT / 2)
            ?.closest(".ag-row")
            ?.getAttribute("row-index")
        );

        setActualRange({
          from: isNaN(firstRowIndex) ? "" : firstRowIndex + 1,
          to: isNaN(firstRowIndex) ? "" : lastRowIndex + 1,
          total: _.api.getDisplayedRowCount(),
        });
      };
      renderedNodes.length > 0 && applyRange();
    }
  }

  function onFirstDataRendered() {
    gridApi?.current?.sizeColumnsToFit();
  }

  function onRowExpandOrCollapse(row) {
    const columnKeys = Object.keys(row.data);
    columnKeys.forEach((key) => {
      const columnDef = filteredColumns.find((el) => {
        return el.field === key;
      });
      switch (row.expanded) {
        case true:
          if (typeof columnDef?.onDetailsShown === "function") {
            columnDef.onDetailsShown(row);
          }
          break;
        case false:
          if (typeof columnDef?.onDetailsHidden === "function") {
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
    onRowExpandOrCollapse(row);
  }

  function onExpandOrCollapseAll(_) {
    _.api.forEachNode((node) => {
      onRowExpandOrCollapse(node);
    });
  }

  function getRowHeight(row) {
    if (row?.data) {
      const heights = [];
      const columnKeys = Object.keys(row.data);
      columnKeys.forEach((key) => {
        const columnDef = filteredColumns.find((el) => {
          return el.field === key;
        });
        if (typeof columnDef?.cellHeight === "function") {
          heights.push(columnDef.cellHeight(row));
        }
      });
      const maxHeight = Math.max(...heights);
      return maxHeight > 0 ? maxHeight : DEFAULT_ROW_HEIGHT;
    }
  }

  function getRowClass(row) {
    if (row?.data) {
      const classes = [];
      const columnKeys = Object.keys(row.data);
      columnKeys.forEach((key) => {
        const columnDef = filteredColumns.find((el) => {
          return el.field === key;
        });
        if (typeof columnDef?.rowClass === "function") {
          classes.push(columnDef?.rowClass(row));
        }
      });
      return classes.join(" ");
    }
  }

  function debouncer(interval, done) {
    return (() => {
      let calls = 0;
      let awaiter = (fn, arg) => setTimeout(() => fn.call(this, arg), interval);
      return {
        call: (fn) => {
          if (typeof fn === "function") fn();
          calls++;
          awaiter((_calls) => {
            if (_calls === calls) {
              done && done();
            }
          }, calls);
        },
      };
    })();
  }

  useEffect(() => {
    !data && getGridData();
    setAgGrid(<AgGrid />);
    // set minimum height if height wasn't explicitly set in css
    if (getAgGridDomLayout() !== "autoHeight") {
      window.getComputedStyle(gridNodeRef.current).height === "0px" &&
        (gridNodeRef.current.style.height =
          DEFAULT_ROW_HEIGHT * config.itemsPerPage + "px");
    }
    window.addEventListener("resize", onResize);
    return () => {
      gridApi?.current?.destroy();
      delete globalThis[`$$tdGrid${gridId.current}`];
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className={`cmp-grid ag-theme-alpine`} ref={gridNodeRef}>
      <Fragment>
        <div
          className={`page-info ${config.paginationStyle === "scroll" ? "visible" : "hidden"
            }`}
        >
          {actualRange.from} - {actualRange.to} of {actualRange.total}
        </div>
        {agGrid}
      </Fragment>
    </div>
  );
}
export default Grid;
