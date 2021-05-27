import React, { useEffect, useState, useRef, Fragment } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import { get } from '../../../../utils/api';

function Grid({ columnDefinition, options, config, data, onAfterGridInit }) {
	const gridData = data;
	const [agGrid, setAgGrid] = useState(null);
	const [actualRange, setActualRange] = useState({ from: null, to: null, total: null });

	const pagination = config.paginationStyle && config.paginationStyle !== 'none' && config.paginationStyle !== 'scroll';
	const serverSide = config.serverSide || true;
	const gridNodeRef = useRef(null);
	const domInfoRef = useRef(null);
	const gridId = useRef(null);
	const gridApi = useRef(null);
	/*
			function that returns AG grid vnode outside main return function
			to keep that node on useState hook and set it once per component lifecycle
	*/
	const AgGrid = () => (
		<AgGridReact
			frameworkComponents={renderers}
			pagination={pagination}
			paginationPageSize={config.itemsPerPage}
			cacheBlockSize={config.itemsPerPage}
			maxBlocksInCache={config.itemsPerPage}
			rowModelType={serverSide ? 'serverSide' : 'clientSide'}
			rowData={gridData}
			onGridReady={onGridReady}
			serverSideDatasource={createDataSource()}
			serverSideStoreType={serverSide ? 'partial' : 'full'}
			rowSelection='single'
			onViewportChanged={onViewportChanged}
			blockLoadDebounceMillis={100}
		>
			{filteredColumns.map((column) => {
				return (
					<AgGridColumn
						headerName={column.headerName}
						field={column.field}
						suppressMenu={true}
						sortable={column.sortable}
						key={column.field}
						resizable={column.resizable}
						onCellClicked={column.onCellClicked}
						cellRenderer={renderers[column.field] ? column.field : null}
						valueFormatter={column.valueFormatter ?? null}
						suppressSizeToFit={column.suppressSizeToFit}
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
			if (el.cellRenderer) {
				renderers[el.field] = el.cellRenderer;
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

	function createDataSource() {
		return {
			getRows: (params) => {
				const pageNo = params.request.endRow / config.itemsPerPage;
				const sortKey = params.request.sortModel?.[0]?.colId;
				const sortDir = params.request.sortModel?.[0]?.sort;
				getGridData(config.itemsPerPage, pageNo, sortKey, sortDir).then((response) => {
					if (response)
						params.success({
							rowData: response.items,
							lastRow: response.totalItems,
							rowCount: response.totalItems,
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
			globalThis[`$$tdGrid${gridId.current}`]?.onAjaxCall(apiUrl);
			const response = await get(apiUrl);
			globalThis[`$$tdGrid${gridId.current}`]?.onNewGridDataLoaded(response);
			return response.data.content;
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
		globalThis[`$$tdGrid${gridId.current}`] = {
			node: gridNodeRef.current,
			api: data.api,
			onAjaxCall: (apiUrl) => {},
			onNewGridDataLoaded: (response) => {},
		};
		// fire onAfterGridInit callback and pass AG grid object to parent
		if (typeof onAfterGridInit === 'function') {
			onAfterGridInit({ node: gridNodeRef.current, api: data.api });
		}
	}

	function onResize() {
		gridApi?.current?.sizeColumnsToFit();
	}

	function onViewportChanged(data) {
		if (config.paginationStyle === 'scroll' && domInfoRef.current) {
			const renderedNodes = data.api.getRenderedNodes();
			const firstIndex = renderedNodes[0].rowIndex;
			const lastIndex = renderedNodes[renderedNodes.length - 1].rowIndex;
			/*
				  React "useState" inside AG grid callbacks causes unstable behaviour and refresh of component
					on some environments.
			*/
			// update page-info after scrolling in "scroll" pagination style
			domInfoRef.current.textContent = `${firstIndex + 1} - ${lastIndex + 1} of ${data.api.getDisplayedRowCount()}`;
		}
	}

	useEffect(() => {
		getGridData();
		setAgGrid(<AgGrid />);
		window.addEventListener('resize', onResize);
		return () => {
			window.removeEventListener('resize', onResize);
		};
	}, []);

	return (
		<div className={`cmp-grid ag-theme-alpine`} ref={gridNodeRef}>
			<Fragment>
				<div className={`page-info ${config.paginationStyle === 'scroll' ? 'visible' : 'hidden'}`}>
					<span ref={domInfoRef}>
						{actualRange.from} - {actualRange.to} of {actualRange.total}
					</span>
				</div>
				{agGrid}
			</Fragment>
		</div>
	);
}

export default Grid;
