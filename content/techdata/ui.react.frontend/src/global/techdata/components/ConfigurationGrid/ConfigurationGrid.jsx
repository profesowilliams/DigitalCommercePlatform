import React, { useState } from "react";
import Grid from "../Grid/Grid";
import GridSearchCriteria from "../Grid/GridSearchCriteria";
import useGridFiltering from "../../hooks/useGridFiltering";
import Modal from '../Modal/Modal';
import DetailsInfo from './DetailsInfo';
import ConfigurationGridSearch from "./ConfigurationGridSearch";

function ConfigurationGrid(props) {
  const componentProp = JSON.parse(props.componentProp);
  const filteringExtension = useGridFiltering();

	const [modal, setModal] = useState(null);

  const { spaDealsIdLabel } = componentProp;

  const getDateTransformed = (dateUTC) => {
    function isValidDate(d) {
      return d instanceof Date && !isNaN(d);
    }

    const dateValue = new Date(dateUTC);

    return isValidDate(dateValue) ? dateValue.toLocaleDateString() : dateUTC;
  };

	const labelList = [
		{
			labelKey: 'multiple',
			labelValue: componentProp.labelList?.find((label) => label.labelKey === 'multiple')?.labelValue ?? 'Multiple',
		},
		{
			labelKey: 'pending',
			labelValue: componentProp.labelList?.find((label) => label.labelKey === 'pending')?.labelValue ?? 'Pending',
		},
	];

	const invoicesModal = {
		title: componentProp.invoicesModal?.title ?? 'Order',
		content:
			componentProp.invoicesModal?.content ??
			'There are multiple Invoices associated with this Order. Click an invoice number to preview with the option to print or Download All for a zip file of all shown here',
		pendingInfo:
			componentProp.invoicesModal?.pendingInfo ?? 'Invoice is pending and will appear here after shipment is processed',
	};

  const getDealsIdLabel = (deals) =>
    deals && deals.length > 1
      ? spaDealsIdLabel
      : deals && deals.length === 1
      ? deals[0].id
      : null;

  const options = {
    defaultSortingColumnKey: "created",
    defaultSortingDirection: "asc",
  };

	function invokeModal(modal) {
		setModal(
			<Modal
				modalAction={modal.action}
				modalContent={modal.content}
				modalProperties={modal.properties}
				onModalClosed={() => setModal(null)}
			></Modal>
		);
	}
	function getInvoices(line) {
    if(!line.quotes) {
      return '';
    }
		else if (line.quotes.length && line.quotes.length > 1) {
			return (
				<div
					onClick={() => {
						invokeModal({
							content: (
								<DetailsInfo
									info={invoicesModal.content}
									line={line}
									pendingInfo={invoicesModal.pendingInfo}
									pendingLabel={labelList.find((label) => label.labelKey === 'pending').labelValue}
								></DetailsInfo>
							),
							properties: {
								title: `${invoicesModal.title}: ${line.id} `,
								buttonIcon: invoicesModal.buttonIcon,
								buttonLabel: invoicesModal.buttonLabel,
							},
						});
					}}
				>
					{labelList.find((label) => label.labelKey === 'multiple').labelValue}
				</div>
			);
		} else {
			if (line.quotes[0]?.id === 'Pending') {
				return labelList.find((label) => label.labelKey === 'pending').labelValue;
			} else {
				return line.quotes[0]?.id ?? null;
			}
		}
	}

  const columnDefs = [
    {
      headerName: "Config ID",
      field: "configId",
      sortable: true,
      cellRenderer: (props) => {
        return (
          <div>
            <a
              className="cmp-grid-url-underlined"
              href={
                componentProp.configDetailUrl?.replace('{id}', props.value)
              }
            >
              {props.value}
            </a>
          </div>
        );
      },
    },
    {
      headerName: "Type",
      field: "configurationType",
      sortable: false,
      cellRenderer: (props) => {
        return (
          <div>
            <a className="cmp-grid-url-not-underlined">{props.value}</a>
          </div>
        );
      },
    },
    {
      headerName: "Vendor",
      field: "vendor",
      sortable: false,
    },
    {
      headerName: "Created",
      field: "created",
      sortable: true,
      valueFormatter: (props) => {
        return getDateTransformed(props.value);
      },
    },
    {
      headerName: "Expires",
      field: "expires",
      sortable: false,
      valueFormatter: (props) => {
        return getDateTransformed(props.value);
      },
    },
    {
      headerName: "End User Name",
      field: "endUserName",
      sortable: false,
    },
    {
      headerName: "Config Name",
      field: "configName",
      sortable: false,
    },
    {
      headerName: "Quote Id",
      field: "quotes",
      sortable: false,
			cellRenderer: (props) => {
				return <div className='cmp-grid-url-underlined'>{getInvoices(props.data)}</div>;
			},
    },
    {
      headerName: "Action",
      field: "action",
      sortable: true,
      valueFormatter: (props) => {
        return props.value;
      },
    },
  ];

  return (
    <section>
      <div className="cmp-configurations-grid cmp-quotes-grid">
        <GridSearchCriteria
          Filters={ConfigurationGridSearch}
          label={componentProp.searchCriteria?.title ?? "Filter Configurations"}
          componentProp={componentProp.searchCriteria}
          onSearchRequest={filteringExtension.onQueryChanged}
          onClearRequest={filteringExtension.onQueryChanged}
        ></GridSearchCriteria>
        <Grid
          columnDefinition={columnDefs}
          options={options}
          config={componentProp}
          onAfterGridInit={(config) =>
            filteringExtension.onAfterGridInit(config)
          }
          requestInterceptor={(request) =>
            filteringExtension.requestInterceptor(request)
          }
        ></Grid>
      </div>
			{modal}
    </section>
  );
}

export default ConfigurationGrid;
