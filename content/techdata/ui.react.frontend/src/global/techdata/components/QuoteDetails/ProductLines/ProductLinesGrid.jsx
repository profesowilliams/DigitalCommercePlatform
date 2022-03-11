import React, { useEffect, useState } from "react";
import Grid from "../../Grid/Grid";
import ProductLinesChildGrid from "./ProductLinesChildGrid";
import ProductLinesItemInformation from "../../QuotePreview/ProductLines/ProductLinesItemInformation";
import ProductLinesMarkupGlobal from "./ProductLinesMarkupGlobal";
import ProductLinesMarkupRow from "./ProductLinesMarkupRow";
import isNotEmpty from "../../../helpers/IsNotNullOrEmpty";
import { thousandSeparator } from "../../../helpers/formatting";
import * as DataLayerUtils from "../../../../../utils/dataLayerUtils";
import { ADOBE_DATA_LAYER_QUOTE_CHECKOUT_CATEGORY } from "../../../../../utils/constants";

function ProductLinesGrid({
  gridProps,
  data,
  labels,
  quoteOption,
  quoteDetailColumns,
  whiteLabelColumns,
  onMarkupChanged,
  shopDomainPage,
  onChangeQuoteDetails,
}) {
  const [gridApi, setGridApi] = useState(null);
  const gridData = data.items.map((el) => {
    return {
      ...el,
      calculatedCost: Number(el.quantity) * Number(el.unitPrice),
      clientExtendedPrice: Number(el.quantity) * Number(el.unitPrice),
      children: el.children?.map((inner) => {
        return {
          ...inner,
          calculatedCost: Number(inner.quantity) * Number(inner.unitPrice),
          clientExtendedPrice: Number(inner.quantity) * Number(inner.unitPrice),
        };
      }),
    };
  });

  const mutableGridData = Object.assign([], gridData);

  const [whiteLabelMode, setWhiteLabelMode] = useState(false);

  const gridConfig = (whiteLabelMode) => {
    return {
      ...gridProps,
      serverSide: false,
      paginationStyle: "none",
      columnList: whiteLabelMode ? whiteLabelColumns : quoteDetailColumns,
    };
  };

  function expandAll() {
    DataLayerUtils.pushEvent(
      DataLayerUtils.ANALYTICS_TYPES.events.click,
      {
        name: DataLayerUtils.ANALYTICS_TYPES.name.openAll,
        type: DataLayerUtils.ANALYTICS_TYPES.types.link,
        category: ADOBE_DATA_LAYER_QUOTE_CHECKOUT_CATEGORY,
      },
    );
    gridApi?.forEachNode((node) => {
      node.expanded = true;
    });
    gridApi?.expandAll();
  }

  function collapseAll() {
    DataLayerUtils.pushEvent(
      DataLayerUtils.ANALYTICS_TYPES.events.click,
      {
        name: DataLayerUtils.ANALYTICS_TYPES.name.collapseAll,
        type: DataLayerUtils.ANALYTICS_TYPES.types.link,
        category: ADOBE_DATA_LAYER_QUOTE_CHECKOUT_CATEGORY,
      },
    );
    gridApi?.forEachNode((node) => {
      node.expanded = false;
    });
    gridApi?.collapseAll();
  }

  function onAfterGridInit({ node, api, gridResetRequest }) {
    setGridApi(api);
  }

  function markupChanged(data) {
    if (typeof onMarkupChanged === "function") {
      onMarkupChanged(data);
    }
  }

  const onExpandAnalytics = () => {
    DataLayerUtils.pushEvent(
      DataLayerUtils.ANALYTICS_TYPES.events.click,
      {
        name: DataLayerUtils.ANALYTICS_TYPES.name.openLineItem,
        type: DataLayerUtils.ANALYTICS_TYPES.types.button,
        category: ADOBE_DATA_LAYER_QUOTE_CHECKOUT_CATEGORY,
      },
    );
  };

  const onCollapseAnalytics = () => {
    DataLayerUtils.pushEvent(
      DataLayerUtils.ANALYTICS_TYPES.events.click,
      {
        name: DataLayerUtils.ANALYTICS_TYPES.name.collapseLineItem,
        type: DataLayerUtils.ANALYTICS_TYPES.types.button,
        category: ADOBE_DATA_LAYER_QUOTE_CHECKOUT_CATEGORY,
      },
    );
  };

  //default column defs
  const columnDefs = [
    {
      headerName: "Line Item",
      field: "displayLineNumber",
      width: "150px",
      sortable: false,
      expandable: true,
      rowClass: ({ node, data }) => {
        return `cmp-product-lines-grid__row ${
          !data?.children || data.children.length === 0
            ? "cmp-product-lines-grid__row--notExpandable"
            : ""
        }`;
      },
      detailRenderer: ({ data }) => (
        <section className="cmp-product-lines-grid__row cmp-product-lines-grid__row--expanded">
          <ProductLinesChildGrid
            gridProps={gridProps}
            license={gridProps.agGridLicenseKey}
            columnDefiniton={
              whiteLabelMode ? whiteLabelCols() : quoteDetailsCols()
            }
            data={data.children}
            onModelUpdateFinished={() => {
              markupChanged(mutableGridData);
            }}
          />
        </section>
      ),
    },
    {
      headerName: "Item Information",
      field: "displayName",
      sortable: false,
      width: "600px",
      cellHeight: (props) => props && (props?.data?.startDate || props?.data?.annuity) ? 160 : 80, // adjust row height for subscription items
      cellRenderer: (props) => {
        return <ProductLinesItemInformation
                  line={props.data}
                  shopDomainPage={shopDomainPage}
                  emptyImageUrl={gridProps.productEmptyImageUrl}/>;
      },
    },
    {
      headerName: "Unit List Price",
      field: "unitListPriceFormatted",
      sortable: false,
      valueFormatter: ({ value }) => {
        return "$" + value;
      },
    },
    {
      headerName: "% Off List Price",
      field: "discounts",
      sortable: false,
      valueFormatter: ({ value }) => {
        return (value && value[0]?.formattedValue) || 0;
      },
    },
    {
      headerName: "Quantity",
      field: "quantity",
      sortable: false,
    },
    {
      headerName: "MSRP",
      field: 'unitListPriceFormatted',
      sortable: false,
      valueFormatter: ({ value }) => {
        return "$" + value;
      },
    },
    {
      headerName: "Unit Price",
      field: "unitPrice",
      onDetailsShown: (row) => {},
      onDetailsHidden: (row) => {},
      cellClass: ({ node, data }) => {
        return whiteLabelMode
          ? "cmp-product-lines-grid__row__cell__your-cost"
          : "";
      },
      headerClass: ({ node, data }) => {
        return whiteLabelMode ? "cmp-product-lines-grid__th__your-cost" : "";
      },
      enableRowGroup: true,
      valueFormatter: ({ data }) => {
        return "$" + thousandSeparator(data.unitPrice);
      },
      sortable: false,
    },
    {
      headerName: "Extended Price",
      field: "extendedPriceFormatted",
      onDetailsShown: (row) => {},
      onDetailsHidden: (row) => {},
      cellClass: ({ node, data }) => {
        return whiteLabelMode
          ? "cmp-product-lines-grid__row__cell__your-cost"
          : "";
      },
      headerClass: ({ node, data }) => {
        return whiteLabelMode ? "cmp-product-lines-grid__th__your-cost" : "";
      },
      enableRowGroup: true,
      valueFormatter: ({ data }) => {
        return "$" + thousandSeparator(data.unitPrice * data.quantity);
      },
      sortable: false,
    },
    {
      headerName: "Markup",
      field: "appliedMarkup",
      suppressKeyboardEvent: function (params) {
        var key = params.event.key;
        return key === 'ArrowLeft' || key === 'ArrowRight';
      },
      onDetailsShown: (row) => {},
      onDetailsHidden: (row) => {},
      cellClass: ({ node, data }) => {
        return "cmp-product-lines-grid__row__cell__markup";
      },
      headerClass: "cmp-product-lines-grid__th__markup",
      cellRenderer: (props) => {
        const { node, api, value, setValue, data } = props;
        return (
          <ProductLinesMarkupRow
            onMarkupValueChanged={({ value, unit, source }) => {
              setValue(value);
              node.setDataValue(
                "clientUnitPrice",
                Number(value) + Number(data.unitPrice)
              );
              const detailsObject = data;
              detailsObject.clientExtendedPrice = (Number(value) + Number(data.unitPrice)) * Number(data.quantity);
              onChangeQuoteDetails(detailsObject);
              node.setDataValue(
                "clientExtendedPrice",
                (Number(value) + Number(data.unitPrice)) * Number(data.quantity)
              );
            }}
            initialMarkup={value || 0}
            resellerUnitPrice={data.unitPrice}
            labels={labels}
          />
        );
      },
      sortable: false,
    },
    {
      headerName: "Client Unit Price",
      field: "clientUnitPrice",
      onDetailsShown: (row) => {},
      onDetailsHidden: (row) => {},
      cellClass: ({ node, data }) => {
        return "cmp-product-lines-grid__row__cell__client-cost";
      },
      headerClass: "cmp-product-lines-grid__th__client-cost",
      cellRenderer: ({ node, api, value, setValue, data }) => {
        return "$" + thousandSeparator(value);
      },
      sortable: false,
    },
    {
      headerName: "Client Extended Price",
      field: "clientExtendedPrice",
      onDetailsShown: (row) => {},
      onDetailsHidden: (row) => {},
      cellClass: ({ node, data }) => {
        return "cmp-product-lines-grid__row__cell__client-cost";
      },
      headerClass: "cmp-product-lines-grid__th__client-cost",
      cellRenderer: ({ node, api, value, setValue, data }) => {
        return "$" + thousandSeparator(value);
      },
      sortable: false,
    },
  ];

  //whitelabel column defs
  const whiteLabelCols = () => {
    const cols = isNotEmpty(whiteLabelColumns)
    
      ? whiteLabelColumns.map((el) => el.columnKey)
      : [
          "displayLineNumber",
          "displayName",
          "quantity",
          "msrp",
          'unitListPriceFormatted',
          "unitPrice",
          "extendedPriceFormatted",
          "appliedMarkup",
          "clientUnitPrice",
          "clientExtendedPrice",
        ];
    //get whitelabel columns
    const _ = cols
      .map((col) => {
        return columnDefs.find((el) => col === el.field);
      })
      .filter((e) => e);
    //decrease width for second column and return final columns
    return _.map((col) => {
      if (col.field === "displayName") {
        col.width = "400px";
      }
      return col;
    });
  };

  //quoteDetails column defs
  const quoteDetailsCols = () => {
    const cols = isNotEmpty(quoteDetailColumns)
      ? quoteDetailColumns.map((el) => el.columnKey)
      : [
          "displayLineNumber",
          "displayName",
          "unitListPriceFormatted",
          "discounts",
          "quantity",
          "unitPrice",
          "extendedPriceFormatted",
        ];
    //get quoteDetails columns
    return cols
      .map((col) => {
        return columnDefs.find((el) => col === el.field);
      })
      .filter((e) => e);
  };

  useEffect(() => {
    quoteOption &&
      setWhiteLabelMode(quoteOption.key === "whiteLabelQuote");
  }, [quoteOption]);

  return (
    <section>
      {whiteLabelMode && (
        <ProductLinesMarkupGlobal labels={labels} />
      )}
      <div className="cmp-product-lines-grid">
        <section className="cmp-product-lines-grid__header">
          <span className="cmp-product-lines-grid__header__title">
            {gridProps?.label || "Line Item Details"}
          </span>
          <span className="cmp-product-lines-grid__header__expand-collapse">
            <span onClick={() => expandAll()}>
              {" "}
              {gridProps?.expandAllLabel || "Expand All"}
            </span>{" "}
            |
            <span onClick={() => collapseAll()}>
              {" "}
              {gridProps?.collapseAllLabel || "Collapse All"}
            </span>
          </span>
        </section>
        <Grid
          key={whiteLabelMode}
          columnDefinition={
            whiteLabelMode ? whiteLabelCols() : quoteDetailsCols()
          }
          config={gridConfig(whiteLabelMode)}
          data={mutableGridData}
          onAfterGridInit={onAfterGridInit}
          onModelUpdateFinished={() => {
            markupChanged(mutableGridData);
          }}
          onExpandAnalytics={onExpandAnalytics}
          onCollapseAnalytics={onCollapseAnalytics}
        />
      </div>
    </section>
  );
}

export default ProductLinesGrid;
