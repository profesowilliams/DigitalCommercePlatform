import React from "react";

function ProductLinesItemInformation({ line }) {
  return (
    <section>
      <div className="cmp-product-lines-grid__item-information">
        <a
          href={line.urlProductSpec}
          target="_blank"
          className="cmp-product-lines-grid__item-information__image-link"
        >
          <img
            alt={line.urlProductImage ? "" : "No Image"}
            src={line.urlProductImage}
          />
        </a>

        <div className="cmp-product-lines-grid__item-information__box-text">
          <div className="cmp-product-lines-grid__item-information__box-text__header">
            <a
              href={line.urlProductSpec}
              target="_blank"
              className="cmp-product-lines-grid__item-information__box-text__header__link"
            >
              {line.displayName}
            </a>
          </div>
          <div className="cmp-product-lines-grid__item-information__box-text__content">
            <b>MFR#:</b>
            {line.mfrNumber || " N/A "} | <b>TD#:</b>
            {line.tdNumber || " N/A "}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductLinesItemInformation;
