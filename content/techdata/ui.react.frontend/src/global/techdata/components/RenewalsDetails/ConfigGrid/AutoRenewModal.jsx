import React, { useState } from "react";
import { getDictionaryValue, getDictionaryValueOrKey } from "../../../../../utils/utils";
import { manageSubscription } from './Common/utils';
import Button from '@mui/material/Button';
import { CircularArrowIcon } from '../../../../../fluentIcons/FluentIcons';
import { getStatusLoopUntilStatusIsActive } from '../../RenewalsGrid/Orders/orderingRequests';

function AutoRenewModal({ data, isToggled, gridProps }) {

    const [saveLoader, setSaveLoader] = useState(false);

    const closeModal = (e) => {
        const modalClose = e.target.closest('.cmp-modal').querySelector('.cmp-modal_close');
        modalClose.click();
    };

    const manageSubscriptionAPI = async () => {
        setSaveLoader(true);
        const subscriptions = [];
        data?.itemsActive?.forEach((item) => {
            subscriptions.push({
              "AutorenewalEnabled": isToggled,
              "RenewalQuantity": item?.quantity,
              "SubscriptionId": item?.subscriptionId
            })
        });

        data?.items?.forEach((item) => {
            subscriptions.push({
              "AutorenewalEnabled": isToggled,
              "RenewalQuantity": item?.quantity,
              "SubscriptionId": item?.subscriptionId
            })
        });

        const payload = {
            data: {
                "CustomerId": data?.customerPO?.text || '',
                "QuoteId": data?.source?.id || '',
                "Subscriptions": subscriptions
            }
        }

        const response = await manageSubscription(gridProps?.manageSubscriptionEndpoint, payload);
        if (response?.isSuccess) {
        // set success message
            const isActiveQuote = await getStatusLoopUntilStatusIsActive({
                getStatusEndpoint: gridProps.getStatusEndpoint,
                id: data.source.id,
                delay: 2000,
                iterations: 7,
              });
              if(isActiveQuote) {
                window.location.reload();
              }
        } else {
            modalClose.click();
        }
        setSaveLoader(false);
    }

  return (
    <div className="cmp-auto-renew-modal--container">
        <p className="cmp-auto-renew-modal--desc">
            {isToggled ? `${gridProps?.productLines?.autoRenewOnDescription}` :
            `${gridProps?.productLines?.autoRenewOffDescription}`}
        </p>
        <div className="cmp-auto-renew-modal__button-section">
        {
            isToggled ? (
                <>
                    <button className="secondary"
                      onClick={closeModal}>
                      {getDictionaryValueOrKey(gridProps?.productLines?.noLeaveOffAutoRenew)}
                    </button>
                    {
                        saveLoader ? (
                            <Button
                                startIcon={<CircularArrowIcon className="circular-arrow-icon" />}
                                sx={{
                                  textTransform: 'none',
                                }}
                                disabled={true}
                                className="primary"
                            >
                                {getDictionaryValueOrKey(gridProps?.productLines?.savingAutoRenew)}
                            </Button>
                            ) : (
                                <button className="primary"
                                    onClick={manageSubscriptionAPI}
                                >
                                    {getDictionaryValueOrKey(gridProps?.productLines?.yesTurnOnAutoRenew)}
                                </button>
                            )
                    }
                </>
            ) : (
                <>
                    {
                        saveLoader ? (
                            <Button
                                startIcon={<CircularArrowIcon className="circular-arrow-icon" />}
                                sx={{
                                  textTransform: 'none',
                                }}
                                disabled={true}
                                className="secondary"
                            >
                                {getDictionaryValueOrKey(gridProps?.productLines?.savingAutoRenew)}
                            </Button>
                            ) : (
                            <button className="secondary"
                                onClick={manageSubscriptionAPI}
                            >
                              {getDictionaryValueOrKey(gridProps?.productLines?.yesTurnOffAutoRenew)}
                            </button>
                        )
                    }
                     <button className="primary"
                      onClick={closeModal}>
                        {getDictionaryValueOrKey(gridProps?.productLines?.noLeaveOnAutoRenew)}
                      </button>
                </>
            )
        }
        </div>
    </div>
  );
}

export default AutoRenewModal;
