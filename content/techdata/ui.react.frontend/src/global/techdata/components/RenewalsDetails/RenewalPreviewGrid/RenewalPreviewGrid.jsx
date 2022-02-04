import React from "react";
import Grid from "../../Grid/Grid";
import { downloadClicked } from "../../PDFWindow/PDFRenewalWindow";
import columnDefs from "./columnDefinitions";

function GridHeader({ gridProps, data }) {
  const downloadPDFClickHandler = () => {
    downloadClicked(
      data,
      true,
      'logo',
      'link text',
    )
  }
  

  return (
    <div className="cmp-product-lines-grid__header">
      <span className="cmp-product-lines-grid__header__title">
        {gridProps.label}
      </span>
      <div className="cmp-renewal-preview__download">
        <span id="pdfDownloadLink" onClick={() => downloadPDFClickHandler()}>{gridProps.pdf || 'Donload PDF'}</span>
        <span>{gridProps.xls}</span>
      </div>
    </div>
  );
}

function GridSubTotal() {
  return (
    <div className="cmp-renewal-preview__subtotal">
      <span className="cmp-renewal-preview__subtotal--description">
        Quote SubTotal:
      </span>
      <span className="cmp-renewal-preview__subtotal--value">$8,760.00</span>
    </div>
  );
}

function Note() {
  return (
    <p className="note">
      <b>Note: </b>Pricing displayed is subject to vendor price changes and exchange
      rate fluctuations.
    </p>
  );
}

function ProductDetails({data}) {
  /**
   * serial № and instance is hardcoded for now.
   * Replace with actual key from API res once there's clarity.
   */
  return (
    <div className="cmp-renewal-preview__prod-details">
      <p className="short-desc">{data.shortDescription}</p>
      <span><b>Serial №: </b>0N417-0V3EH-38V8A-092KM-CHQM5</span>
      <span><b>Instance: </b>185956778</span>
    </div>
  );
}

function RenewalPreviewGrid({ data, gridProps }) {
  const gridData = data.items ?? [];
  const gridConfig = {
    ...gridProps,
    serverSide: false,
    paginationStyle: "none",
  };

  columnDefs[2] = {
    ...columnDefs[2],
    cellHeight: () => 80,
    cellRenderer: ({ data }) => <ProductDetails data={data}/>,
  };

  /*
    mutableGridData is copied version of response that can be safely mutated,
    original state is preserved in gridData.
  */
  const mutableGridData = JSON.parse(JSON.stringify(gridData));

  return (
    <div className="cmp-product-lines-grid">
      <section>
        <GridHeader data={data} gridProps={gridProps} />
        <Grid
          columnDefinition={columnDefs}
          config={gridConfig}
          data={mutableGridData}
        ></Grid>
        <GridSubTotal />
        <Note />
      </section>
    </div>
  );
}

export default RenewalPreviewGrid;
