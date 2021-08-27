import React, { useEffect, useState, useRef, Fragment } from 'react';
import { 
	AgGridColumn, 
	AgGridReact,
	fullWidthCellRenderer,
	agDetailCellRenderer
} from 'ag-grid-react';
import 'ag-grid-enterprise';
import { get } from '../../../../utils/api';

function Grid(props) {
	let { columnDefinition, options, config, data, onAfterGridInit, onRowSelected, onSelectionChanged, requestInterceptor } 
		= Object.assign({}, props);
	const componentVersion = '1.1.4';
	const gridData = data;
	const [agGrid, setAgGrid] = useState(null);
	const [actualRange, setActualRange] = useState({ from: null, to: null, total: null });

	const pagination = config?.paginationStyle && config?.paginationStyle !== 'none' && config?.paginationStyle !== 'scroll';
	const serverSide = config?.serverSide ?? true;
	const gridNodeRef = useRef(null);
	const gridId = useRef(null);
	const gridApi = useRef(null);

	/*
			function that returns AG grid vnode outside main return function to keep that
			node on useState hook and set it once per component lifecycle or on demand
	*/
	const AgGrid = () => (
		<AgGridReact
			key={Math.floor(1000 * Math.random()).toString()}
			frameworkComponents={renderers}
			pagination={pagination}
			paginationPageSize={config.itemsPerPage}
			cacheBlockSize={config.itemsPerPage}
			maxBlocksInCache={config.itemsPerPage}
			rowModelType={serverSide ? 'serverSide' : 'clientSide'}
			rowData={gridData}
			onGridReady={onGridReady}
			serverSideDatasource={serverSide && createDataSource()}
			serverSideStoreType={serverSide ? 'partial' : 'full'}
			rowSelection='single'
			onViewportChanged={onViewportChanged}
			blockLoadDebounceMillis={100}
			masterDetail= {true}
			detailCellRenderer={'__detailRenderer'}
			detailRowAutoHeight= {true}
			animateRows={false}
			domLayout={serverSide? 'normal' : 'autoHeight'}
			onFirstDataRendered={onFirstDataRendered}
			onRowGroupOpened={onRowGroupOpened}
			onExpandOrCollapseAll={onExpandOrCollapseAll}
			onRowSelected={onRowSelected}
			onSelectionChanged={onSelectionChanged}
			rowSelection={'multiple'}
			getRowHeight={getRowHeight}
			getRowClass={getRowClass}
			suppressRowClickSelection={true}
			suppressPropertyNamesCheck= {true}
		>
			{filteredColumns.map((column) => {
				return (
					<AgGridColumn
						{...column}
						cellRenderer={column.expandable? 'agGroupCellRenderer'
						: renderers[column.field] ? column.field 
						: null}
						suppressMenu={true}
						key={column.field}
					></AgGridColumn>
				);
			})}
		</AgGridReact>
	);

	const renderers = {};
	let filteredColumns = [];

	// overwrite config in column definitions with config from AEM
	config.columnList?.forEach((column) => {
		const el = columnDefinition.find((el) => {
			return el.field === column.columnKey;
		});
		if (el) {
			// translation
			column.columnLabel !== undefined ? (el.headerName = column.columnLabel) : null;
			// sortable attribute
			column.sortable !== undefined ? (el.sortable = column.sortable) : null;
			// check for render function
			if (el.cellRenderer || el.detailRenderer) {
				renderers[el.field] = el.cellRenderer;
				el.expandable? renderers['__detailRenderer'] = el.detailRenderer : null;
			}
			filteredColumns.push(el);
		}
	});

	// fallback in case of lack of columnList from AEM
	if (filteredColumns.length === 0) {
		columnDefinition.forEach((column) => {
			if (column.cellRenderer) {
				renderers[column.field] = column.cellRenderer;
			}
		});
		filteredColumns = columnDefinition;
	}

	// overwrite options with options from AEM
	if (options) {
		for (let key in options) {
			config.options[key] ? (options[key] = config.options[key]) : null;
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
				getGridData(config.itemsPerPage, pageNo, sortKey, sortDir).then((response) => {
						params.success({
							rowData: response?.items ?? 0,
							lastRow: response?.totalItems ?? 0,
							rowCount: response?.totalItems ?? 0
						});
				});
			},
		};
	}

	async function getGridData(pageSize, pageNumber, sortKey, sortDir) {
		if (gridId.current) {
			// check if there are additional query params in url, append grid specific params
			const url = new URL(config.uiServiceEndPoint);
			const pages = `PageSize=${pageSize}&PageNumber=${pageNumber}`;
			const sortParams =
				sortKey && sortDir ? `&SortDirection=${sortDir}&SortBy=${sortKey}&WithPaginationInfo=true` : '';
			let pathName = url.pathname ?? '';
			pathName.slice(-1) === '/' ? (pathName = pathName.slice(0, -1)) : null;
			let apiUrl = `${url.origin}${pathName ?? ''}${url.search ?? ''}`;
			url.search !== '' ? (apiUrl += `&${pages}${sortParams}`) : (apiUrl += `?${pages}${sortParams}`);
			let response = null;
			// check if request interceptor is attached and use it.
			// otherwise get data according to grid state
			if (typeof requestInterceptor === 'function') {
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

	function onGridReady(data) {
		if (!gridId.current) {
			let str = Math.floor(1000 * Math.random()).toString();
			let pad = '0000';
			gridId.current = pad.substring(0, pad.length - str.length) + str;
		}
		data.api.sizeColumnsToFit();
		gridApi.current = data.api;
		// apply default sorting
		if (options?.defaultSortingColumnKey) {
			data.columnApi.applyColumnState({
				state: [{ colId: options.defaultSortingColumnKey, sort: options.defaultSortingDirection ?? 'desc' }],
				defaultState: { sort: null },
			});
		}
		// expose this instance of grid object globally for debug purposes
		// keep custom hooks after grid refresh
		globalThis[`$$tdGrid${gridId.current}`] = {
			version: componentVersion,
			node: gridNodeRef.current,
			api: data.api,
			props: props,
			onAjaxCall: globalThis[`$$tdGrid${gridId.current}`]?.onAjaxCall
				? globalThis[`$$tdGrid${gridId.current}`].onAjaxCall
				: (apiUrl) => {},
			onNewGridDataLoaded: globalThis[`$$tdGrid${gridId.current}`]?.onNewGridDataLoaded
				? globalThis[`$$tdGrid${gridId.current}`].onNewGridDataLoaded
				: (response) => {},
		};
		// fire onAfterGridInit callback and pass AG grid object to parent
		if (typeof onAfterGridInit === 'function') {
			onAfterGridInit({ 
				node: gridNodeRef.current, 
				api: data.api, 
				gridResetRequest: () => resetGrid()});
		}
	}

	function onResize() {
		gridApi?.current?.sizeColumnsToFit();
	}

	function onViewportChanged(data) {
		if (config.paginationStyle === 'scroll') {
			const renderedNodes = data.api.getRenderedNodes();
			if (renderedNodes.length > 0) {
				const firstIndex = renderedNodes[0].rowIndex;
				const lastIndex = renderedNodes[renderedNodes.length - 1].rowIndex;
				setActualRange({ from: firstIndex + 1, to: lastIndex + 1, total: data.api.getDisplayedRowCount() });
			} else {
				setActualRange({ from: 0, to: 0, total: 0 });
			}
		}
	}

	function onFirstDataRendered() {
		gridApi?.current?.sizeColumnsToFit();
	}

	function onRowExpandOrCollapse(row){
		const columnKeys = Object.keys(row.data);
		columnKeys.forEach(key => {
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
		})
		gridApi?.current?.sizeColumnsToFit();
	}

	function onRowGroupOpened(row) {
		onRowExpandOrCollapse(row);
	}

	function onExpandOrCollapseAll(data) {
		data.api.forEachNode((node)=>{
			onRowExpandOrCollapse(node);
		})
	}

	function getRowHeight(row) {
		if(row?.data){
			const heights = [];
			const columnKeys = Object.keys(row.data);
			columnKeys.forEach(key => {
				const columnDef = filteredColumns.find((el) => {
					return el.field === key;
				});
				if (typeof columnDef?.cellHeight === 'function') {
					heights.push(columnDef.cellHeight(row));
				}
			})
			const maxHeight = Math.max(...heights);
			return maxHeight > 0 ? maxHeight : null;
		}
	}

	function getRowClass(row) {
		if(row?.data){
			const classes = [];
			const columnKeys = Object.keys(row.data);
			columnKeys.forEach(key => {
				const columnDef = filteredColumns.find((el) => {
					return el.field === key;
				});
				if (typeof columnDef?.rowClass === 'function') {
					classes.push(columnDef?.rowClass(row));
				}
			})
			return classes.join(" ");
		}	
	}

	useEffect(() => {
		!data && getGridData();
		setAgGrid(<AgGrid />);
		window.addEventListener('resize', onResize);
		return () => {
			gridApi?.current?.destroy();
			delete globalThis[`$$tdGrid${gridId.current}`];
			window.removeEventListener('resize', onResize);
		};
	}, []);

	return (
		<div className={`cmp-grid ag-theme-alpine`} ref={gridNodeRef}>
			<Fragment>
				<div className={`page-info ${config.paginationStyle === 'scroll' ? 'visible' : 'hidden'}`}>
					{actualRange.from} - {actualRange.to} of {actualRange.total}
				</div>
				{agGrid}
			</Fragment>
		</div>
	);
	
}
export default Grid;
