import React, { useState , useRef } from "react";
import Grid from "../Grid/Grid";
import GridSearchCriteria from "../Grid/GridSearchCriteria";
import useGridFiltering from "../../hooks/useGridFiltering";
import Modal from "../Modal/Modal";
import ConfigurationGridSearch from "./ConfigurationGridSearch";
import {
  QuoteDetailsLink,
  MultipleQuotesInvokeModal,
  SingleQuotesInvokeModal,
} from "./QuotesModals";
import { ANALYTICS_TYPES, pushEventAnalyticsGlobal } from "../../../../utils/dataLayerUtils";
import { isNotEmptyValue } from "../../../../utils/utils";
import { 
  ADOBE_DATA_LAYER_LINK_TYPE,
  ADOBE_DATA_LAYER_CLICK_EVENT,
  ADOBE_DATA_LAYER_CONFIGURATION_QUOTES_OPTIONS,
  ADOBE_DATA_LAYER_CONFIGURATION_CLICKINFO_CATEGORY,
  ADOBE_DATA_LAYER_CONFIGURATION_CLICKINFO_NAME_ACTION,
} from "../../../../utils/constants";

function ConfigurationGrid(props) {
  const componentProp = JSON.parse(props.componentProp);
  const filteringExtension = useGridFiltering();
  const [modal, setModal] = useState(null);

  const { spaDealsIdLabel } = componentProp;
  const analyticModel = useRef(null)
  const getDateTransformed = (dateUTC) => {
    function isValidDate(d) {
      return d instanceof Date && !isNaN(d);
    }

    const dateValue = new Date(dateUTC);

    return isValidDate(dateValue) ? dateValue.toLocaleDateString() : dateUTC;
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
    if (!line.quotes) {
      return "";
    } else if (line.quotes.length && line.quotes.length > 1) {
      return (
        <MultipleQuotesInvokeModal
          invokeModal={invokeModal}
          quotesModal={componentProp.quotesModal}
          quoteDetailUrl={componentProp.quoteDetailUrl}
          statusLabelsList={componentProp.statusLabelsList}
          line={line}
        ></MultipleQuotesInvokeModal>
      );
    } else {
      const status = componentProp.statusLabelsList.find(
        (label) => label.labelKey === line.quotes[0]?.status
      );
      if (status || line.quotes[0]?.status === "Pending") {
        return (
          <SingleQuotesInvokeModal
            invokeModal={invokeModal}
            quotesModal={componentProp.quotesModal}
            quoteDetailUrl={componentProp.quoteDetailUrl}
            statusLabelsList={componentProp.statusLabelsList}
            line={line}
            status={status}
          ></SingleQuotesInvokeModal>
        );
      } else if (line.quotes[0]?.id) {
        return (
          <QuoteDetailsLink
            quote={line.quotes[0]}
            quoteDetailUrl={componentProp.quoteDetailUrl}
          ></QuoteDetailsLink>
        );
      } else {
        return "";
      }
    }
  }

  const getQuotePreviewUrl = (props) => {
    return componentProp.createQuoteUrl
      ?.replace("{id}", props.data.configId)
      .replace(
        "{type}",
        props.data.configurationType
      )
      .replace("{vendor}", props.data.vendor);
  };

  const getConfigurationDetailsUrl = (props) => {
    return componentProp.configDetailUrl?.replace("{id}", props.value);
  };


  /**
   * handler event that push a click event
   * information to adobeDataLayer
   * @param {string} param 
   */
  const handlerAnalyticsClickEvent = (param = '') => {
    const clickInfo = {
      type : ADOBE_DATA_LAYER_LINK_TYPE,
      category : ADOBE_DATA_LAYER_CONFIGURATION_CLICKINFO_CATEGORY,
      name : param,
    };
    const quotes = {
      options: ADOBE_DATA_LAYER_CONFIGURATION_QUOTES_OPTIONS
    };
    const objectToSend = {
      event: ADOBE_DATA_LAYER_CLICK_EVENT,
      clickInfo,
      quotes,
    };
    pushEventAnalyticsGlobal(objectToSend);
  };

  const columnDefs = [
    {
      headerName: "Config ID",
      field: "configId",
      sortable: true,
      cellRenderer: (props) => {
        return (
          <div onClick={() => handlerAnalyticsClickEvent(props.value)} >
            <a
              className="cmp-grid-url-underlined"
              href={getQuotePreviewUrl(props)}
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
        const configurationTypeLabel =
          componentProp.searchCriteria?.configurationTypesDropdown?.items?.find(
            (label) => label.key === props.value
          )?.value || props.value;

        return <div>{configurationTypeLabel}</div>;
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
        return (
          <div className="cmp-grid-url-underlined">
            {getQuoteCellConfiguration(props.data)}
          </div>
        );
      },
    },
    {
      headerName: "Action",
      field: "action",
      sortable: true,
      cellRenderer: (props) => {
        return (
          <div onClick={() => handlerAnalyticsClickEvent(ADOBE_DATA_LAYER_CONFIGURATION_CLICKINFO_NAME_ACTION)}>
            <a className="cmp-grid-url-not-underlined" href={getQuotePreviewUrl(props)}>
              {componentProp.actionColumnLabel}
            </a>
          </div>
        );
      },
    },
  ];

  const handleFilterComponent = (analyticObjectParam, responseLength) => {
    const configuration = {
      searchTerm: analyticObjectParam.searchTerm,
      searchOption: analyticObjectParam.searchOption ,
      configFilter: analyticObjectParam.configFilter ,
      fromDate: analyticObjectParam.fromDate ,
      toDate: analyticObjectParam.toDate ,
      nullSearch: responseLength === 0,
      
    };
    const objectToSend = {
      event: ANALYTICS_TYPES.events.configSearch,
      configuration,
    };
    pushEventAnalyticsGlobal(objectToSend);
  };
  
  const handleOnSearchRequest = (query) => {
    filteringExtension.onQueryChanged(query);
    analyticModel.current = query.analyticsData;
  };

  async function handleRequestInterceptor(request) {
    const response = await filteringExtension.requestInterceptor(request);
    if (analyticModel.current !== null ) {
      handleFilterComponent(
        analyticModel.current,
        isNotEmptyValue(response?.data?.content?.items?.length) ? 
          response?.data?.content?.items?.length :
          0
      );
    }
    return response;
  }

  return (
    <section>
      <div className="cmp-configurations-grid">
        <GridSearchCriteria
          Filters={ConfigurationGridSearch}
          label={componentProp.searchCriteria?.title ?? "Filter Configurations"}
          componentProp={componentProp.searchCriteria}
          onSearchRequest={handleOnSearchRequest}
          onClearRequest={filteringExtension.onQueryChanged}
          category={ADOBE_DATA_LAYER_CONFIGURATION_CLICKINFO_CATEGORY}
        ></GridSearchCriteria>
        <Grid
          columnDefinition={columnDefs}
          options={options}
          config={componentProp}
          onAfterGridInit={(config) =>
            filteringExtension.onAfterGridInit(config)
          }
          requestInterceptor={handleRequestInterceptor}
        ></Grid>
        {modal}
      </div>
    </section>
  );
}

export default ConfigurationGrid;
