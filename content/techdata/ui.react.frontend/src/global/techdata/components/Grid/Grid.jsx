import React, { useEffect, useState, Fragment } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import { get } from '../../../../utils/api';

function Grid({ columnDefinition, config, data }) {
	const [gridData, setGridData] = useState(data ?? null);
	const [totalCount, setTotalCount] = useState(null);
	const [actualRange, setActualRange] = useState({ from: null, to: null });

	const pagination = config.paginationStyle && config.paginationStyle !== 'none' && config.paginationStyle !== 'scroll';
	const serverSide = config.serverSide || true;

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

	function createDataSource() {
		return {
			getRows: (params) => {
				const pageNo = params.request.endRow / config.itemsPerPage;
				const sortKey = params.request.sortModel?.[0]?.colId;
				const sortDir = params.request.sortModel?.[0]?.sort;
				getGridData(config.itemsPerPage, pageNo, sortKey, sortDir).then((response) => {
					setTotalCount(response.totalItems);

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
		// check if there are additional query params in url, append grid specific params
		const url = new URL(config.uiServiceEndPoint);
		const pages = `PageSize=${pageSize ?? 10}&PageNumber=${pageNumber ?? 1}`;
		const sortParams = sortKey && sortDir ? `&SortDirection=${sortDir}&SortBy=${sortKey}&WithPaginationInfo=true` : '';
		let apiUrl = `${url.origin}${url.pathname}${url.search}`;
		url.search !== '' ? (apiUrl += `&${pages}${sortParams}`) : (apiUrl += `?${pages}${sortParams}`);
		const response = await get(apiUrl);
		console.log(apiUrl);
		if (!gridData) setGridData(response.data.content.items);
		return response.data.content;
	}

	function onGridReady(data) {
		data.api.sizeColumnsToFit();
	}

	function onBodyScroll(data) {
		const renderedNodes = data.api.getRenderedNodes();
		const firstIndex = renderedNodes[0].rowIndex;
		const lastIndex = renderedNodes[renderedNodes.length - 1].rowIndex;
		setActualRange({
			from: firstIndex + 1,
			to: lastIndex + 1,
		});
	}

	useEffect(() => {
		getGridData();
	}, []);

	useEffect(() => {
		if (gridData && !gridData.error?.isError) {
			console.log(gridData);
		}
	}, [gridData]);

	return (
		<div className={`cmp-grid ag-theme-alpine`}>
			{gridData ? (
				<Fragment>
					<div className={`page-info ${config.paginationStyle === 'scroll' ? 'visible' : 'hidden'}`}>
						{config.paginationStyle === 'pages' ? (<span>
							{actualRange.from} - {actualRange.to} of {totalCount}
						</span>) : <></>
						}
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
			) : (
					<Fragment> Loading... </Fragment>
				)}
		</div>
	);
}

export default Grid;
