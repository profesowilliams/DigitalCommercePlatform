import React, { useEffect, useState } from "react";
import {
  ADOBE_DATA_LAYER_BUTTON_TYPE,
  ADOBE_DATA_LAYER_CLICK_EVENT,
  ADOBE_DATA_LAYER_EVENT_PAGE_VIEW,
  ADOBE_DATA_LAYER_LINK_TYPE,
  ADOBE_DATA_LAYER_QUANTITY_TYPE,
  ADOBE_DATA_LAYER_QUOTE_PREVIEW_CATEGORY,
  ADOBE_DATA_LAYER_COLLAPSE_LINE_ITEM,
  ADOBE_DATA_LAYER_COLLAPSE_ALL_LINE_ITEM,
  ADOBE_DATA_LAYER_OPEN_ALL_LINE_ITEM,
  ADOBE_DATA_LAYER_OPEN_LINE_ITEM
} from "../../../../../utils/constants";
import { pushEventAnalyticsGlobal } from "../../../../../utils/dataLayerUtils";
import { isNotEmptyValue } from "../../../../../utils/utils";
import { thousandSeparator } from "../../../helpers/formatting";
import Grid from "../../Grid/Grid";
import ProductLinesChildGrid from "./ProductLinesChildGrid";
import ProductLinesItemInformation from "./ProductLinesItemInformation";
import ProductLinesQuantityWidget from "./ProductLinesQuantityWidget";

/**
 * 
 * @param {Object} props 
 * @param {any} props.gridProps
 * @param {any} props.data
 * @param {() => void} props.onQuoteLinesUpdated
 * @param {boolean} props.isAllowedQuantityIncrease
 * @param {string} props.tier
 * @returns 
 */
function ProductLinesGrid({ gridProps, data, onQuoteLinesUpdated, isAllowedQuantityIncrease, tier}) {
  const [gridApi, setGridApi] = useState(null);
  const [analyticsProduct, setAnalyticsProduct] = useState([]);
  const [flagAnalytic, setFlagAnalytic] = useState(true);
  const gridData = data.items ?? [];
  /*
    grid data can be mutated intentionally by changing quantity in each row. 
    so in order to not mutate props, mutableGridData is clone of the data that is
    used in full component lifecycle and orignal data is kept for reference
  */
  const mutableGridData = JSON.parse(JSON.stringify(gridData));
  const selectedLinesModel = [];
  let isDataMutated = false;

  useEffect(() => {
    gridApi?.selectAll();
  }, [gridApi]);

  /**
   * function that map the products of the quote and
   * get the information to attach into the analytics info
   * @param {any} quoteDetailsParam 
   */
  const getPopulateProdutcsToAnalytics = (quoteDetailsParam) => {
    const productsToSend = quoteDetailsParam.items.map(item => {
      return {
        productInfo: {
          parentSKU : item.tdNumber,
          name: item.displayName
        }
      }
    });
    setAnalyticsProduct(productsToSend);
  };

  /**
   * Handler function that add info to the analytics
   * when the page load
   */
  const handlerAnalyticPageView = () => {
    const objectToSend = {
      event: ADOBE_DATA_LAYER_EVENT_PAGE_VIEW,
      quotePreview: {
        genTier : tier,
      },
      products: analyticsProduct
    };
    pushEventAnalyticsGlobal(objectToSend);
  };

  /**
   * Handler that is called when the item 
   * is collapsed
   */
   const handlerAnalyticCollapseAction = (item) => {
    const productInfo = {
      parentSKU : isNotEmptyValue(item?.data?.tdNumber) ? item?.data?.tdNumber : '',
      name: isNotEmptyValue(item?.data?.displayName) ? item?.data?.displayName : ''
    };
    const clickInfo = {
      type : ADOBE_DATA_LAYER_BUTTON_TYPE,
      category : ADOBE_DATA_LAYER_QUOTE_PREVIEW_CATEGORY,
      name : ADOBE_DATA_LAYER_COLLAPSE_LINE_ITEM,
    };
    const objectToSend = {
      event: ADOBE_DATA_LAYER_CLICK_EVENT,
      products: productInfo,
      clickInfo,
    };
    pushEventAnalyticsGlobal(objectToSend);
  };

  /**
   * Handler that is called when the item 
   * is expanded
   */
   const handlerAnalyticExpandAction = (item) => {
    const clickInfo = {
      type : ADOBE_DATA_LAYER_BUTTON_TYPE,
      category : ADOBE_DATA_LAYER_QUOTE_PREVIEW_CATEGORY,
      name : ADOBE_DATA_LAYER_OPEN_LINE_ITEM,
    };
    const productInfo = {
      parentSKU : isNotEmptyValue(item?.data?.tdNumber) ? item?.data?.tdNumber : '',
      name: isNotEmptyValue(item?.data?.displayName) ? item?.data?.displayName : ''
    };
    const objectToSend = {
      event: ADOBE_DATA_LAYER_CLICK_EVENT,
      products: productInfo,
      clickInfo
    };
    pushEventAnalyticsGlobal(objectToSend);
  };
  
  /**
   * Handler that is called when the quantity
   * item is clicked
   */
  const  handlerAnalyticQuantity = () => {
    const clickInfo = {
      type : ADOBE_DATA_LAYER_BUTTON_TYPE,
      category : ADOBE_DATA_LAYER_QUOTE_PREVIEW_CATEGORY,
      name : ADOBE_DATA_LAYER_QUANTITY_TYPE,
    };
    const objectToSend = {
      event: ADOBE_DATA_LAYER_CLICK_EVENT,
      clickInfo
    };
    pushEventAnalyticsGlobal(objectToSend);
  };

  const handlerAnalyticCollapsedAll = () => {
    const clickInfo = {
      type : ADOBE_DATA_LAYER_LINK_TYPE,
      category : ADOBE_DATA_LAYER_QUOTE_PREVIEW_CATEGORY,
      name : ADOBE_DATA_LAYER_COLLAPSE_ALL_LINE_ITEM,
    };
    const objectToSend = {
      event: ADOBE_DATA_LAYER_CLICK_EVENT,
      clickInfo
    };
    pushEventAnalyticsGlobal(objectToSend);
  };

  const handlerAnalyticExpandeddAll = () => {
    const clickInfo = {
      type : ADOBE_DATA_LAYER_LINK_TYPE,
      category : ADOBE_DATA_LAYER_QUOTE_PREVIEW_CATEGORY,
      name : ADOBE_DATA_LAYER_OPEN_ALL_LINE_ITEM,
    };
    const objectToSend = {
      event: ADOBE_DATA_LAYER_CLICK_EVENT,
      clickInfo
    };
    pushEventAnalyticsGlobal(objectToSend);
  };

  useEffect(() => {
    if (data) {
      getPopulateProdutcsToAnalytics(data);    
    }
  }, [data]);

  useEffect(() => {
    if (analyticsProduct?.length > 0 && flagAnalytic) {
      setFlagAnalytic(false);
      handlerAnalyticPageView();
    }
  }, [analyticsProduct]);

  const gridConfig = {
    ...gridProps,
    serverSide: false,
    paginationStyle: "none",
  };

  const columnDefs = [
    {
      headerName: "Select All",
      field: "id",
      width: "160px",
      // sortable: false,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      expandable: true,
      
      rowClass: ({ node, data }) => {
        if (data?.children && data.children.length > 0) {
          node.setExpanded(true);
        }
        return `${
          !data?.children || data.children.length === 0
              ? "`cmp-product-lines-grid__row`"
              : ""
        }`
      },
      cellClass: ({ node, data }) => {
        return `${
          !data?.children || data.children.length === 0
              ? "cmp-product-lines-grid__row--notExpandable--orders"
              : ""
        }`
      },
      showRowGroup: true,
      detailRenderer: ({ node, api, setValue, data, value }) => {
      return (
          <section className="cmp-product-lines-grid__row cmp-product-lines-grid__row--expanded">
            <ProductLinesChildGrid
              license={gridProps.agGridLicenseKey}
              columns={columnDefs}
              data={data.children}
            ></ProductLinesChildGrid>
          </section>
        );
      },
    },
    
    {
      headerName: "Item Information",
      field: "shortDescription",
      sortable: false,
      width: "600px",
      cellHeight: () => 80,
      cellRenderer: (props) => {
        return <ProductLinesItemInformation
                  line={props.data}
                  emptyImageUrl={gridProps.productEmptyImageUrl}
                />;
      },
    },
    {
      headerName: "MSRP/Unit List Price",
      field: "unitListPriceFormatted",
      sortable: false,
      valueFormatter: ({ value }) => {
        return "$" + value;
      },
    },
    {
      headerName: "Quantity",
      field: "quantity",
      width: "120px",
      sortable: false,
      cellRenderer: ({ node, api, setValue, data }) => {
        return (
          <ProductLinesQuantityWidget
            isAllowedQuantityIncrease={isAllowedQuantityIncrease}
            initialValue={gridData.find((row) => row.id === data.id)?.quantity}
            selectedValue={data.quantity}
            onValueChanged={(_val) => {
              isDataMutated = true;
              setValue(_val);
              api.refreshCells({
                columns: ["extendedPriceFormatted"],
                force: true,
              });
              node.selected && onSelectionChanged({ api });
            }}
            handlerAnalyticQuantityEvent={handlerAnalyticQuantity}
          ></ProductLinesQuantityWidget>
        );
      },
    },
    {
      headerName: "Extended Price",
      field: "extendedPriceFormatted",
      onDetailsShown: (row) => {},
      onDetailsHidden: (row) => {},
      valueFormatter: ({ data }) => {
        return "$" + thousandSeparator(data.unitListPrice * data.quantity);
      },
      sortable: false,
    },
  ];

  function onSelectionChanged({ api }) {
    selectedLinesModel.length = 0;
    api.forEachNode((rowNode) => {
      const _price = rowNode.data.quantity * rowNode.data.unitListPrice;
      rowNode.data.extendedPrice = _price;
      const _row = Object.assign({}, rowNode.data);
      delete _row.extendedPriceFormatted;
      rowNode.selected && selectedLinesModel.push(_row);
    });
    if (typeof onQuoteLinesUpdated === "function") {
      const didQuantitiesChange = !!gridData.find((row, index) => row.quantity !== mutableGridData[index].quantity);

      onQuoteLinesUpdated(selectedLinesModel, didQuantitiesChange);
    }
  }

  function expandAll() {
    gridApi?.forEachNode((node) => {
      node.expanded = true;
    });
    handlerAnalyticExpandeddAll();
    gridApi?.expandAll();
  }

  function collapseAll() {
    gridApi?.forEachNode((node) => {
      node.expanded = false;
    });
    handlerAnalyticCollapsedAll();
    gridApi?.collapseAll();
  }

  function onAfterGridInit({ node, api, gridResetRequest }) {
    setGridApi(api);
  }

  return (
    <section>
      <div className="cmp-product-lines-grid">
        <section className="cmp-product-lines-grid__header">
          <span className="cmp-product-lines-grid__header__title">
            {gridProps.label}
          </span>
          <span className="cmp-product-lines-grid__header__expand-collapse">
            <span onClick={() => expandAll()}> {gridProps.expandAllLabel}</span>{" "}
            |
            <span onClick={() => collapseAll()}>
              {" "}
              {gridProps.collapseAllLabel}
            </span>
          </span>
        </section>
        <Grid
          columnDefinition={columnDefs}
          config={gridConfig}
          data={mutableGridData}
          onSelectionChanged={onSelectionChanged}
          onAfterGridInit={onAfterGridInit}
          onExpandAnalytics={handlerAnalyticExpandAction}
          onCollapseAnalytics={handlerAnalyticCollapseAction}
        ></Grid>
      </div>
    </section>
  );
}

export default ProductLinesGrid;
