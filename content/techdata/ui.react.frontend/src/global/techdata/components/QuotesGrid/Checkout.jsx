import React, { Fragment } from "react";
import { usPut } from "../../../../utils/api";
import IsNotNullOrEmpty from "../../helpers/IsNotNullOrEmpty";

export async function redirectToCart(quoteId, config, onErrorHandler) {
  try {
    const response = await usPut(
      config.uiServiceEndPoint + `?Id=${quoteId}&type=quote`
    );
    const statusCode = response.status;
    
    if (statusCode === 200) {
      const isSuccess = response.data.content.isSuccess;
      if (isSuccess) {
        window.location.replace(config.redirectUrl);
      } else {
        onErrorHandler(response);
        console.error(`Quote ${quoteId} checkout isSuccess failed:`);
      }
    } else {
      const error = response.data.error;
      const isError = error.isError;
      if (isError) {
        console.error(`Quote ${quoteId} checkout failed:`);
        onErrorHandler(response);
      } else {
        console.error(`Quote ${quoteId} checkout failed:`);
      }
    }
  } catch (e) {
    onErrorHandler(e);
    console.error(`Quote ${quoteId} checkout failed:`);
    console.error(e);
  }
}

function Checkout({ line, checkoutConfig, onErrorHandler }) {
  const config = {
    uiServiceEndPoint: IsNotNullOrEmpty(checkoutConfig?.uiServiceEndPoint)
      ? checkoutConfig.uiServiceEndPoint
      : "https://eastus-dit-ui.dc.tdebusiness.cloud/ui-content/v1/replaceCart",
    redirectUrl: IsNotNullOrEmpty(checkoutConfig?.uiServiceEndPoint)
      ? checkoutConfig.redirectUrl
      : "https://shop.techdata.com/cart",
  };

  return (
    <div
      onClick={() => {
        line.canCheckOut && redirectToCart(line.id, config, onErrorHandler);
      }}
    >
      {line.canCheckOut && <i className="fas fa-shopping-cart"></i>}
    </div>
  );
}

export default Checkout;
