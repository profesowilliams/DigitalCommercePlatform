import React, { Fragment, useState } from "react";
import { usPut } from "../../../../utils/api";
import { verifyQuote, formatUanErrorMessage } from "../../../../utils/utils";
import IsNotNullOrEmpty from "../../helpers/IsNotNullOrEmpty";

export async function redirectToCart(checkoutSystem, quoteId, config, onErrorHandler) {
    if (checkoutSystem === '4.6') {
        system46Checkout(quoteId, config, onErrorHandler);
    } else if(checkoutSystem === '4.6-checkout') {
        window.location.replace(config.checkoutRedirectUrl.replace("{quote-id}", quoteId));        
    } else {
        window.location.replace(config.expressCheckoutRedirectUrl.replace("{quote-id}", quoteId));
    }
}

const system46Checkout = async (quoteId, config, onErrorHandler) => {
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

function Checkout({ line, checkoutConfig, onErrorHandler, modal, setModal }) {
  const config = {
    uiServiceEndPoint: IsNotNullOrEmpty(checkoutConfig?.uiServiceEndPoint)
      ? checkoutConfig.uiServiceEndPoint
      : "https://eastus-dit-ui.dc.tdebusiness.cloud/ui-content/v1/replaceCart",
    redirectUrl: IsNotNullOrEmpty(checkoutConfig?.uiServiceEndPoint)
      ? checkoutConfig.redirectUrl
      : "https://shop.techdata.com/cart",
    expressCheckoutRedirectUrl: checkoutConfig?.expressCheckoutRedirectUrl,
    checkoutRedirectUrl: checkoutConfig?.checkoutRedirectUrl,
    verifyUanEndpoint: checkoutConfig?.verifyUanEndpoint,
    uanErrorMessage: checkoutConfig?.uanErrorMessage
  };

  async function onQuoteCheckout(checkoutSystem, quoteId, config, onErrorHandler) {
    const quoteVerification = await verifyQuote(config.uanErrorMessage, config.verifyUanEndpoint, quoteId);
    if (!quoteVerification.hasOwnProperty(`uanErrorMessage`)) {
      redirectToCart(checkoutSystem, quoteId, config, onErrorHandler);
    } else {
      // Display modal with detail of lines that are not valid
      setModal((previousInfo) => (
        {
          content: (
            formatUanErrorMessage(quoteVerification)
          ),
          properties: {
            title: `Error`,
          },
          ...previousInfo,
        }
      ));
    }
  }

  return (
    <div
      onClick={() => {
        line.canCheckOut && onQuoteCheckout(line.checkoutSystem, line.id, config, onErrorHandler);
      }}
    >
      {line.canCheckOut && <i className="fas fa-shopping-cart"></i>}
    </div>
  );
}

export default Checkout;
