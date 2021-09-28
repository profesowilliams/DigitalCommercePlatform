import React, { useEffect, useState } from "react";
import thousandSeparator from "../../../helpers/thousandSeparator";
import Grid from "../../Grid/Grid";
import ProductLinesChildGrid from "./ProductLinesChildGrid";
import ProductLinesItemInformation from "../../QuotePreview/ProductLines/ProductLinesItemInformation";
import ProductLinesMarkupGlobal from "./ProductLinesMarkupGlobal";
import ProductLinesMarkupRow from "./ProductLinesMarkupRow";
import isNotEmpty from "../../../helpers/IsNotNullOrEmpty";

function ProductLinesGrid({
  gridProps,
  data,
  labels,
  quoteOption,
  quoteDetailColumns,
  whiteLabelColumns,
  onMarkupChanged,
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
    gridApi?.forEachNode((node) => {
      node.expanded = true;
    });
    gridApi?.expandAll();
  }

  function collapseAll() {
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

  //default column defs
  const columnDefs = [
    {
      headerName: "Line Item",
      field: "id",
      width: "100px",
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
            columnDefiniton={
              whiteLabelMode ? whiteLabelCols() : quoteDetailsCols()
            }
            data={data.children}
            onModelUpdateFinished={() => {
              markupChanged(mutableGridData);
            }}
          ></ProductLinesChildGrid>
        </section>
      ),
    },
    {
      headerName: "Item Information",
      field: "shortDescription",
      sortable: false,
      width: "600px",
      cellHeight: () => 80,
      cellRenderer: (props) => {
        return <ProductLinesItemInformation line={props.data} />;
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
        return value || 0;
      },
    },
    {
      headerName: "Quantity",
      field: "quantity",
      sortable: false,
    },
    {
      headerName: "MSRP",
      field: "msrp",
      sortable: false,
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
              node.setDataValue(
                "clientExtendedPrice",
                (Number(value) + Number(data.unitPrice)) * Number(data.quantity)
              );
            }}
            initialMarkup={value || 0}
            resellerUnitPrice={data.unitPrice}
            labels={labels}
          ></ProductLinesMarkupRow>
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
          "id",
          "shortDescription",
          "quantity",
          "msrp",
          "unitPrice",
          "extendedPriceFormatted",
          "appliedMarkup",
          "clientUnitPrice",
          "clientExtendedPrice",
        ];
    //get whitelabel columns
    const _ = cols.map((col) => {
      return columnDefs.find((el) => col === el.field);
    });
    //decrease width for second column and return final columns
    return _.map((col) => {
      if (col.field === "shortDescription") {
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
          "id",
          "shortDescription",
          "unitListPriceFormatted",
          "discounts",
          "quantity",
          "unitPrice",
          "extendedPriceFormatted",
        ];
    //get quoteDetails columns
    return cols.map((col) => {
      return columnDefs.find((el) => col === el.field);
    });
  };

  useEffect(() => {
    quoteOption &&
      setWhiteLabelMode(quoteOption.key === "whiteLabelQuote" ? true : false);
  }, [quoteOption]);

  return (
    <section>
      {whiteLabelMode && (
        <ProductLinesMarkupGlobal labels={labels}></ProductLinesMarkupGlobal>
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
        ></Grid>
      </div>
    </section>
  );
}

export default ProductLinesGrid;
