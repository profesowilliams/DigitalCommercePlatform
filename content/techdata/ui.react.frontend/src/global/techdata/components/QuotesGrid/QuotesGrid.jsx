import React, { useState } from "react";
import Grid from "../Grid/Grid";
import GridSearchCriteria from "../Grid/GridSearchCriteria";
import useGridFiltering from "../../hooks/useGridFiltering";
import QuotesGridSearch from "./QuotesGridSearch";
import Checkout from "./Checkout";
import Modal from '../Modal/Modal';

function QuotesGrid(props) {
  const componentProp = JSON.parse(props.componentProp);
  const filteringExtension = useGridFiltering();

  const [modal, setModal] = useState(null);

  const { spaDealsIdLabel } = componentProp;

  const getDateTransformed = (dateUTC) => {
    const formatedDate = new Date(dateUTC).toLocaleDateString();
    return formatedDate;
  };

  const getDealsIdLabel = (deals) =>
    deals && deals.length > 1
      ? spaDealsIdLabel
      : deals && deals.length === 1
      ? deals[0].id
      : null;

  const options = {
    defaultSortingColumnKey: "id",
    defaultSortingDirection: "asc",
  };
  function invokeModal(modal) {
      setModal(modal);
  }

  const onErrorHandler = (error) => {
    setModal((previousInfo) => (
        {
          content: (
            <div>There has been an error creating your quote. Please try again later or contact your sales representative.</div>
          ),
          properties: {
              title: `Error`,
          },
            ...previousInfo,
        }
    ));
  }

  const columnDefs = [
    {
      headerName: "TD Quote ID",
      field: "id",
      sortable: true,
      cellRenderer: (props) => {
        return (
          <div>
            <a
              className="cmp-grid-url-underlined"
              href={`${
                window.location.origin + componentProp.quoteDetailUrl
              }?id=${props.value}`}
            >
              {props.value}
            </a>
          </div>
        );
      },
    },
    {
      headerName: "Quote Reference",
      field: "quoteReference",
      sortable: false,
      cellRenderer: (props) => {
        return (
          <div>
            {props.value}
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
      headerName: "End User Name",
      field: "endUserName",
      sortable: false,
    },
    {
      headerName: "SPA/Deal IDs",
      field: "deals",
      sortable: false,
      valueFormatter: (props) => {
        return getDealsIdLabel(props.value);
      },
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
      headerName: "Quote Value",
      field: "quoteValue",
      sortable: true,
      valueFormatter: (props) => {
        return props.data.currencySymbol + props.value;
      },
    },
    {
      headerName: "Checkout",
      field: "canCheckOut",
      sortable: false,
      cellRenderer: (props) => {
        return (
          <div className="cmp-quotes-grid__checkout-icon">
            {props.value && (
              <Checkout
                line={props.data}
                checkoutConfig={componentProp.checkout}
                onErrorHandler={onErrorHandler}
              ></Checkout>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <section>
      <div className="cmp-quotes-grid">
        <GridSearchCriteria
          Filters={QuotesGridSearch}
          label={componentProp.searchCriteria?.title ?? "Filter Quotes"}
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
            {modal && <Modal
                modalAction={modal.action}
                modalContent={modal.content}
                modalProperties={modal.properties}
                modalAction={modal.modalAction}
                actionErrorMessage={modal.errorMessage}
                onModalClosed={() => setModal(null)}
            ></Modal>}
    </section>
  );
}

export default QuotesGrid;
