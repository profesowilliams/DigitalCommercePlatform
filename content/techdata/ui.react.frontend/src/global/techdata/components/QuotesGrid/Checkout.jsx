import React, { Fragment } from "react";
import { usPut } from "../../../../utils/api";
import IsNotNullOrEmpty from "../../helpers/IsNotNullOrEmpty";

function Checkout({ line, checkoutConfig }) {
  const config = {
    uiServiceEndPoint: IsNotNullOrEmpty(checkoutConfig?.uiServiceEndPoint)
      ? checkoutConfig.uiServiceEndPoint
      : "https://eastus-dit-ui.dc.tdebusiness.cloud/ui-content/v1/replaceCart",
    redirectUrl: IsNotNullOrEmpty(checkoutConfig?.uiServiceEndPoint)
      ? checkoutConfig.redirectUrl
      : "https://shop.techdata.com/cart",
  };

  async function redirectToCart(quoteId) {
    try {
      const response = await usPut(
        config.uiServiceEndPoint + `?Id=${quoteId}&type=quote`
      );
      const statusCode = response.status;
      const statusText = response.statusText;
      if (statusCode === 200 && statusText === "OK") {
        const isSuccess = response.data.content.isSuccess;
        if (isSuccess) {
          window.location.replace(config.redirectUrl);
        } else {
          console.error(`Quote ${quoteId} checkout isSuccess failed:`);
        }
      } else {
        const error = response.data.error;
        const isError = error.isError;
        if (isError) {
          console.error(`Quote ${quoteId} checkout failed:`);
        } else {
          console.error(`Quote ${quoteId} checkout failed:`);
        }
      }
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
