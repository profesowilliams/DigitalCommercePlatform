import React from "react";

function ProductLinesItemInformation({ line }) {
  return (
    <section>
      <div className="cmp-product-lines-grid__item-information">
        <a href={line.urlProductImage} className="cmp-product-lines-grid__item-information__image-link">
          <img alt="No Image" src={line.urlProductImage} />
        </a>
        <div className="cmp-product-lines-grid__item-information__box-text">
          <div className="cmp-product-lines-grid__item-information__box-text__header">
            {line.description}
          </div>
          <div className="cmp-product-lines-grid__item-information__box-text__content">
            <b>MFR#:</b>{line.mfrNumber} |  <b>TD#:</b>{line.tdNumber}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductLinesItemInformation;


