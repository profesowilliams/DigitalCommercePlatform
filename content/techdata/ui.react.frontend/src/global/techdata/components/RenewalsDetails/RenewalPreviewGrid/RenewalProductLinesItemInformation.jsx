import React, { useCallback } from "react";
import * as DataLayerUtils from "../../../../../utils/dataLayerUtils";

function RenewalProductLinesItemInformation({ line, shopDomainPage = "" }) {
  const formatShopDomainUrl = useCallback(() => {
    if (shopDomainPage.length > 1 && line.tdNumber) {
      const hasHttp = /^(http|https):/gm.test(shopDomainPage);
      const tdNumber = line.tdNumber.replace(/^0+/gm, "");
      if (!hasHttp) {
        const hasSlash = /^\//gm.test(shopDomainPage);
        const shopUrlFormatted = hasSlash
          ? shopDomainPage.replace("/", "")
          : shopDomainPage;

        return `https://${shopUrlFormatted}/${tdNumber}/?P=${tdNumber}`;
      } else {
        return `${shopDomainPage}/${tdNumber}/?P=${tdNumber}`;
      }
    }
    return null;
  }, []);

  const handleClick = () => {
    DataLayerUtils.pushEvent(
      "click",
      {
        name: line.displayName,
        type: "link",
      },
      {
        click: {
          category: "Quote Detail Table Interactions",
        },
        products: {
          productInfo: { parentSKU: line.tdNumber, name: line.displayName },
        },
      }
    );
  };

  return (
    <section>
      <div
        onClick={handleClick}
        className="cmp-product-lines-grid__item-information"
      >
        <div className="cmp-product-lines-grid__item-information__box-text">
          <div className="cmp-product-lines-grid__item-information__box-text__header"></div>
          <div className="cmp-product-lines-grid__item-information__box-text__content">
            <div className="cmp-renewal-preview__prod-details">
              <a
                href={formatShopDomainUrl()}
                target="_blank"
                className="cmp-product-lines-grid__item-information__box-text__header__link"
              >
                <p className="short-desc">{line.shortDescription}</p>
              </a>

              <span>
                <b>Serial №: </b>
                {line.vendorPartNo || " N/A "}
              </span>
              <span>
                <b>Instance: </b>
                {line.instance || " N/A "}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RenewalProductLinesItemInformation;
