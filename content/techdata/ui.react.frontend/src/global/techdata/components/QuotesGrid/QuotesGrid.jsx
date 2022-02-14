import React, { useState } from "react";
import Grid from "../Grid/Grid";
import GridSearchCriteria from "../Grid/GridSearchCriteria";
import useGridFiltering from "../../hooks/useGridFiltering";
import QuotesGridSearch from "./QuotesGridSearch";
import Checkout from "./Checkout";
import Modal from "../Modal/Modal";
import { getSingleQueryStringParameterFromUrl } from "../../../../utils/utils";
import { pushEventAnalyticsGlobal } from "../../../../utils/dataLayerUtils";
import {
  ADOBE_DATA_LAYER_CLICK_EVENT,
  ADOBE_DATA_LAYER_LINK_TYPE,
  ADOBE_DATA_LAYER_QUOTE_CHECKOUT_NAME,
  ADOBE_DATA_LAYER_QUOTE_CLICKINFO_CATEGORY
} from "../../../../utils/constants";

function QuotesGrid(props) {
  const componentProp = JSON.parse(props.componentProp);

  const filteringExtension = useGridFiltering();
  const [modal, setModal] = useState(null);
  const [queryStringIdValue, setQueryStringIdValue] = useState(getSingleQueryStringParameterFromUrl("id"));
  const { spaDealsIdLabel } = componentProp;

  const getDateTransformed = (dateUTC) => {
    const formatedDate = new Date(dateUTC).toLocaleDateString();
    return formatedDate;
  };

  const uiServiceEndPoint = componentProp.uiServiceEndPoint
    ? componentProp.uiServiceEndPoint
    : "";

  const errorMessage = componentProp.gridErrorMessage;  

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
    setModal((previousInfo) => ({
      content: (
        <div>
          {errorMessage}
        </div>
      ),
      properties: {
        title: `Error`,
      },
      ...previousInfo,
    }));
  };

  const handleOnSearchRequest = (query) => {
    filteringExtension.onQueryChanged(query);
  };

  /**
   * handler event that push a click event
   * information to adobeDataLayer
   * @param {string} param
   */
  const handlerAnalyticsClickEvent = (param = "") => {
    const clickInfo = {
      type: ADOBE_DATA_LAYER_LINK_TYPE,
      name: param,
    };
    const click = {
      category: ADOBE_DATA_LAYER_QUOTE_CLICKINFO_CATEGORY,
    };
    const objectToSend = {
      event: ADOBE_DATA_LAYER_CLICK_EVENT,
      clickInfo,
      click,
    };
    pushEventAnalyticsGlobal(objectToSend);
  };

  const enableLinkAndCheckout = (data) => {
    return data?.status?.toUpperCase() !== "IN_PIPELINE";
  }

  const columnDefs = [
    {
      headerName: "TD Quote ID",
      field: "id",
      sortable: true,
      cellRenderer: (props) => {
        const enableLink = enableLinkAndCheckout(props.data);

        return (
          <div onClick={() => enableLink && handlerAnalyticsClickEvent(props.value)}>
            {enableLink && <a
              className="cmp-grid-url-underlined"
              href={`${
                window.location.origin + componentProp.quoteDetailUrl
              }?id=${props.value}`}
            >
              {props.value}
            </a>}
            {!enableLink && props.value}
          </div>
        );
      },
    },
    {
      headerName: "Quote Reference",
      field: "quoteReference",
      sortable: false,
      cellRenderer: (props) => {
        return <div>{props.value}</div>;
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
        const enableLink = enableLinkAndCheckout(props.data);
        return (
          enableLink && <div
            className="cmp-quotes-grid__checkout-icon"
            onClick={() =>
              handlerAnalyticsClickEvent(ADOBE_DATA_LAYER_QUOTE_CHECKOUT_NAME)
            }
          >
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

  const contextMenuItems = (params) => {
    const quoteDetailsUrl = `${componentProp.quoteDetailUrl}?id=${params.node.data.id}`;
    return params.column.colId === "id"
      ? [
          "separator",
          {
            name: componentProp.menuOpenLink,
            action: function () {
              window.open(quoteDetailsUrl);
            },
          },
          {
            name: componentProp.menuCopyLink,
            action: function () {
              navigator.clipboard.writeText(
                window.location.origin + quoteDetailsUrl
              );
            },
            icon: '<span class="ag-icon ag-icon-copy" unselectable="on" role="presentation"></span>',
          },
        ]
      : [];
  };

  async function detailRedirectHandler(request) {
    let response = await filteringExtension.requestInterceptor(request);
    if (queryStringIdValue && response?.data?.content?.items?.length === 1) {
      const detailsRow = response.data.content.items[0];
      const redirectUrl = `${
        window.location.origin + componentProp.quoteDetailUrl
      }?id=${detailsRow.id}`;
      window.location.href = redirectUrl;
    } else {
      return response;
    }
  }

  return (
    <section>
      <div className="cmp-quotes-grid">
        <GridSearchCriteria
          Filters={QuotesGridSearch}
          label={componentProp.searchCriteria?.title ?? "Filter Quotes"}
          componentProp={componentProp.searchCriteria}
          onSearchRequest={handleOnSearchRequest}
          onClearRequest={filteringExtension.onQueryChanged}
          uiServiceEndPoint={uiServiceEndPoint}
          category={ADOBE_DATA_LAYER_QUOTE_CLICKINFO_CATEGORY}
        ></GridSearchCriteria>
        <Grid
          columnDefinition={columnDefs}
          options={options}
          contextMenuItems={contextMenuItems}
          config={componentProp}
          onAfterGridInit={(config) => {
            filteringExtension.onAfterGridInit(config);
          }}
          requestInterceptor={(request) => detailRedirectHandler(request)}
        ></Grid>
      </div>
      {modal && (
        <Modal
          modalAction={modal.action}
          modalContent={modal.content}
          modalProperties={modal.properties}
          modalAction={modal.modalAction}
          actionErrorMessage={modal.errorMessage}
          onModalClosed={() => setModal(null)}
        ></Modal>
      )}
    </section>
  );
}

export default QuotesGrid;
