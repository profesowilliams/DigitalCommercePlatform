import React from "react";
import { If } from "../../../helpers/If";

function ProductLinesItemInformation({ line, isChild=false }) {
  return (
    <section>
      <div className="cmp-product-lines-grid__item-information">
        <If condition={!isChild}>
        <a
          href={line.urlProductSpec}
          target="_blank"
          className="cmp-product-lines-grid__item-information__image-link"
        >
          <img alt={line.urlProductImage ? '' : 'No Image'} src={line.urlProductImage} />
        </a>
        </If>
        <div className="cmp-product-lines-grid__item-information__box-text">
          <div className="cmp-product-lines-grid__item-information__box-text__header">
            <a
              href={line.urlProductSpec}
              target="_blank"
              className="cmp-product-lines-grid__item-information__box-text__header__link"
            >
              {line.description}
            </a>
          </div>
          <div className="cmp-product-lines-grid__item-information__box-text__content">
            <b>MFR#:</b>
            {line.mfrNumber} | <b>TD#:</b>
            {line.tdNumber}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductLinesItemInformation;
