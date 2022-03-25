import React,{useCallback} from "react";
import { dateToString } from "../../../helpers/formatting";
import { pushEvent } from "../../../../../utils/dataLayerUtils";
import { showAnnuity } from "../../../../../utils/utils";
import {
  ADOBE_DATA_LAYER_CLICK_EVENT,
  ADOBE_DATA_LAYER_LINK_TYPE,
  ADOBE_DATA_LAYER_ORDER_DETAILS_CLICKINFO_CATEGORY,
} from "../../../../../utils/constants";

function ProductLinesItemInformation({ headerName, line, shopDomainPage="", emptyImageUrl }) {
  const formatShopDomainUrl = useCallback(() => {
    if (shopDomainPage.length > 1 && line.tdNumber ){
      const hasHttp = /^(http|https):/gm.test(shopDomainPage);
      const tdNumber = line.tdNumber.replace(/^0+/gm,"");
      if (!hasHttp){
        const hasSlash = /^\//gm.test(shopDomainPage)
        const shopUrlFormatted = hasSlash ? shopDomainPage.replace('/','') : shopDomainPage;

        return `https://${shopUrlFormatted}/${tdNumber}/?P=${tdNumber}`
      }else{
        return `${shopDomainPage}/${tdNumber}/?P=${tdNumber}`
      }
    }
    return null
  },[])

  /**
   * Handler event that add the analytic click info when
   * the user click some Product Item with the information
   */
  const handleClick = (name="") => {
    pushEvent(
      ADOBE_DATA_LAYER_CLICK_EVENT,
      {
        name: name,
        type: ADOBE_DATA_LAYER_LINK_TYPE,
        category: ADOBE_DATA_LAYER_ORDER_DETAILS_CLICKINFO_CATEGORY,
      },
      {
        products: {
          productInfo: { parentSKU: line.tdNumber, name: line.displayName },
        },
      }
    );
  };

  const ProductImage = () =>
  (
    <img
          alt=""
          src={line.urlProductImage ? line.urlProductImage : emptyImageUrl}
        />
  );

  return (
    <section>
      <div onClick={() => handleClick(headerName)} className="cmp-product-lines-grid__item-information">
        <a
          href={formatShopDomainUrl()}
          target="_blank"
          className="cmp-product-lines-grid__item-information__image-link"
        >
          <ProductImage/>
        </a>

        <div className="cmp-product-lines-grid__item-information__box-text">
          <div className="cmp-product-lines-grid__item-information__box-text__header">
            <a
              href={formatShopDomainUrl()}
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
            {
              showAnnuity(line) &&
                <div className="cmp-product-lines-grid__subscription-terms">
                  {line.annuity.startDate && <p>
                    <b>Start Date:</b>
                    <span>{ dateToString(line.annuity.startDate, "MM/dd/yy") }</span>
                  </p>}
                  {line.annuity.autoRenewal && <p>
                    <b>Auto Renew:</b>
                    <span>{ line.annuity.autoRenewal ? "Yes" : "No"}</span>
                  </p>}
                  {line.annuity.duration && line.annuity.duration !== '0' && <p>
                    <b>Duration:</b>
                    <span>{ "{duration} months".replace("{duration}", line.annuity.duration) }</span>
                  </p>}
                  {line.annuity.billingFrequency && <p>
                    <b>Billing:</b>
                    <span>{ line.annuity.billingFrequency }</span>
                  </p>}
                </div>
            }
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductLinesItemInformation;
