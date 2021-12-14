import React,{useCallback} from "react";

function ProductLinesItemInformation({ line, shopDomainPage="", emptyImageUrl }) {

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

  const ProductImage = () =>
  (
    <img
          alt=""
          src={line.urlProductImage ? line.urlProductImage : emptyImageUrl}
        />
  );
  return (
    <section>
      <div className="cmp-product-lines-grid__item-information">
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
              line.annuity &&
                <div className="cmp-product-lines-grid__subscription-terms">
                  <p>
                    <b>Start Date:</b>
                    <span>{ line.annuity.startDate }</span>
                  </p>
                  <p>
                    <b>Auto Renew:</b>
                    <span>{ line.annuity.isAnnuity }</span>
                  </p>
                  <p>
                    <b>Duration:</b>
                    <span>{ line.annuity.duration }</span>
                  </p>
                  <p>
                    <b>Billing:</b>
                    <span>{ line.annuity.billingFrequency }</span>
                  </p>
                </div>
            }
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductLinesItemInformation;
