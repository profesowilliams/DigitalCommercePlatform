import React, { Fragment } from "react";
import { usGet } from "../../../../utils/api";
import IsNotNullOrEmpty from "../../helpers/IsNotNullOrEmpty";

function Checkout({ line, checkoutConfig }) {
  const config = {
    uiServiceEndPoint: IsNotNullOrEmpty(checkoutConfig?.uiServiceEndPoint)
      ? checkoutConfig.uiServiceEndPoint
      : "https://eastus-dit-ui.dc.tdebusiness.cloud/ui-content/v1/CreateByQuote",
    redirectUrl: IsNotNullOrEmpty(checkoutConfig?.uiServiceEndPoint)
      ? checkoutConfig.redirectUrl
      : "https://shop.techdata.com/cart",
  };

  async function redirectToCart(quoteId) {
    try {
      await usGet(config.uiServiceEndPoint + `?QuoteId=${quoteId}`);
      window.location.replace(config.redirectUrl);
    } catch (e) {
      console.error(`Quote ${quoteId} checkout failed:`);
      console.error(e);
    }
  }

  return (
    <div
      onClick={() => {
        line.canCheckOut && redirectToCart(line.id);
      }}
    >
      {line.canCheckOut && <i className="fas fa-shopping-cart"></i>}
    </div>
  );
}

export default Checkout;
