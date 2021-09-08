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

  const quotesModal = {
    title: componentProp.quotesModal?.title ?? 'Config ID',
    content:
      componentProp.quotesModal?.content ??
      'There are multiple items associated with this Config ID. Please choose the item you would like to review:',
  };

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
  function getQuoteCellConfiguration(line) {
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
                  info={quotesModal.content}
                  line={line}
                  statusLabelsList={componentProp.statusLabelsList}
                  configDetailUrl={componentProp.configDetailUrl}
                ></DetailsInfo>
              ),
              properties: {
                title: `${quotesModal.title}: ${line.configId} `,
                buttonIcon: quotesModal.buttonIcon,
                buttonLabel: quotesModal.buttonLabel,
              },
            });
          }}
        >
          {labelList.find((label) => label.labelKey === 'multiple').labelValue}
        </div>
      );
    } else {
      if (line.quotes[0]?.status === 'Pending') {
        return labelList.find((label) => label.labelKey === 'pending').labelValue;
      } else if (line.quotes[0]?.id) {
        return (
          <a
            className="cmp-grid-url-underlined"
            href={
              componentProp.quoteDetailUrl?.replace('{id}', line.quotes[0]?.id)
            }
          >
            {line.quotes[0]?.id}
          </a>
        )
      } else {
        return '';
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
          <a
            className="cmp-grid-url-underlined"
            href={
              componentProp.configDetailUrl?.replace('{id}', props.value)
            }
          >
            {props.value}
          </a>
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
        return <div className='cmp-grid-url-underlined'>{getQuoteCellConfiguration(props.data)}</div>;
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
      <div className="cmp-configurations-grid">
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
        {modal}
      </div>
    </section>
  );
}

export default ConfigurationGrid;
