import React,{useCallback} from "react";

function ProductLinesItemInformation({ line, shopDomainPage="" }) {

  const formatShopDomainUrl = useCallback(() => {
    if (shopDomainPage.length > 1 ){
      const hasHttp = /^(http|https):/gm.test(shopDomainPage); 
      if (!hasHttp){
        const hasSlash = /^\//gm.test(shopDomainPage)
        const shopUrlFormatted = hasSlash ? shopDomainPage.replace('/','') : shopDomainPage;
        return `https://${shopUrlFormatted}/${line.id}/?P=${line.id}`
      }else{
        return `${shopDomainPage}/${line.id}/?P=${line.id}` 
      }      
    }
    return null
  },[])
  
  return (
    <section>
      <div className="cmp-product-lines-grid__item-information">
        <a
          href={formatShopDomainUrl(line)}
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
              href={formatShopDomainUrl(line)}
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
