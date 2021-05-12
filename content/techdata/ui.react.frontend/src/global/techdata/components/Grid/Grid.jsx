import React, { useEffect, useState, useRef, Fragment } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import { get } from '../../../../utils/api';

function Grid({ columnDefinition, options, config, data, onAfterGridInit }) {
	const gridData = data;
	const [actualRange, setActualRange] = useState({ from: null, to: null, total: null });

	const pagination = config.paginationStyle && config.paginationStyle !== 'none' && config.paginationStyle !== 'scroll';
	const serverSide = config.serverSide || true;
	const gridNodeRef = useRef(null);
	const domInfoRef = useRef(null);
	const gridId = useRef(null);

	// check for render functions in column definiton, add all of them to renderers object
	const renderers = {};
	columnDefinition.forEach((column) => {
		if (column.cellRenderer) {
			renderers[column.field] = column.cellRenderer;
		}
	});

	// overwrite config in column definitions with config from AEM
	config.columnList?.forEach((column) => {
		const el = columnDefinition.find((el) => {
			return el.field === column.columnKey;
		});
		if (el) {
			// translation
			column.columnLabel ? (el.headerName = column.columnLabel) : null;
			// sortable attribute
			column.sortable ? (el.sortable = column.sortable) : null;
		}
	});

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
			const pages = `PageSize=${pageSize ?? 10}&PageNumber=${pageNumber ?? 1}`;
			const sortParams =
				sortKey && sortDir ? `&SortDirection=${sortDir}&SortBy=${sortKey}&WithPaginationInfo=true` : '';
			let apiUrl = `${url.origin}${url.pathname ?? ''}${url.search ?? ''}`;
			url.search !== '' ? (apiUrl += `&${pages}${sortParams}`) : (apiUrl += `?${pages}${sortParams}`);
			console.log(apiUrl);
			const response = await get(apiUrl);
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
		// apply default sorting
		if (options?.defaultSortingColumnKey) {
			data.columnApi.applyColumnState({
				state: [{ colId: options.defaultSortingColumnKey, sort: options.defaultSortingDirection ?? 'desc' }],
				defaultState: { sort: null },
			});
		}
		// expose this instance of grid object globally for debug purposes
		globalThis[`$$tdGrid${gridId.current}`] = { node: gridNodeRef.current, api: data.api };
		// fire onAfterGridInit callback and pass AG grid object to parent
		if (typeof onAfterGridInit === 'function') {
			onAfterGridInit({ node: gridNodeRef.current, api: data.api });
		}
	}

	function onModelUpdated(data) {
		if (config.paginationStyle === 'scroll' && domInfoRef.current) {
			setActualRange({
				from: data.api.getFirstDisplayedRow() + 1,
				to: data.api.getLastDisplayedRow() + 1,
				total: data.api.getDisplayedRowCount(),
			});
			// 	domInfoRef.current.innerHTML = `${data.api.getFirstDisplayedRow() + 1} - ${
			// 		data.api.getLastDisplayedRow() + 1
			// 	} of ${data.api.getDisplayedRowCount()}`;
		}
	}

	useEffect(() => {
		getGridData();
	}, []);

	return (
		<div className={`cmp-grid ag-theme-alpine`} ref={gridNodeRef}>
			<Fragment>
				<div className={`page-info ${config.paginationStyle === 'scroll' ? 'visible' : 'hidden'}`}>
					<span ref={domInfoRef}>
						{actualRange.from} - {actualRange.to} of {actualRange.total}
					</span>
				</div>
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
					// onModelUpdated={onModelUpdated}
					blockLoadDebounceMillis={100}
				>
					{columnDefinition.map((column) => {
						return (
							<AgGridColumn
								headerName={column.headerName}
								field={column.field}
								suppressMenu={true}
								sortable={column.sortable}
								key={column.field}
								resizable={column.resizable}
								cellRenderer={renderers[column.field] ? column.field : null}
								valueFormatter={column.valueFormatter ?? null}
								suppressSizeToFit={column.suppressSizeToFit}
							></AgGridColumn>
						);
					})}
				</AgGridReact>
			</Fragment>
			)
		</div>
	);
}

export default Grid;
