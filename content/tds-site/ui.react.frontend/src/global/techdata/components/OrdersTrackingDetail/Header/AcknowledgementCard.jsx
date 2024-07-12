import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import { LoaderIcon } from '../../../../../fluentIcons/FluentIcons';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';

/**
 * AcknowledgementCard component displays order acknowledgement information.
 * @param {Object} orderData - Contains the order details.
 * @param {boolean} isLoading - Indicates if the data is still loading.
 */
function AcknowledgementCard({ orderData, isLoading }) {

  // Retrieve translations from the store
  const uiTranslations = useOrderTrackingStore((state) => state.uiTranslations);
  const translations = uiTranslations?.['OrderTracking.Details.Cards'];

  // State variables for storing order acknowledgement information
  const [reseller, setReseller] = useState('');
  const [createdFormatted, setCreatedFormatted] = useState('');
  const [customerPO, setCustomerPO] = useState('');
  const [docTypeText, setDocTypeText] = useState('');
  const [creator, setCreator] = useState('');

  // Effect hook to update order acknowledgement information when order data changes
  useEffect(() => {
    console.log('AcknowledgementCard::useEffect::orderData');

    // Check if orderData is available
    if (!orderData) return;

    // Update state variables with order acknowledgement information
    setReseller(orderData.reseller);
    setCreatedFormatted(orderData.createdFormatted);
    setCustomerPO(orderData.customerPO);
    setDocTypeText(orderData.docTypeText);
    setCreator(orderData.creator);

  }, [orderData]);

  // Display a loader icon if the data is still loading
  if (isLoading) {
    return (<Card className="card-container" variant="outlined"><LoaderIcon /></Card>);
  }

  return (
    <Card className="card-container" variant="outlined">
      <div className="card-container__title">
        {translations?.OrderAcknowledgementCard_OrderAcknowledgement}
      </div>
      <div className="acknowledgement-card">
        {reseller?.id && (
          <>
            <span>
              {translations?.OrderAcknowledgementCard_CustomerAccountCode}
            </span>
            <span>{reseller?.id}</span>
          </>
        )}
        {createdFormatted && (
          <>
            <span>
              {translations?.OrderAcknowledgementCard_OrderDate}
            </span>
            <span>{createdFormatted}</span>
          </>
        )}
        {customerPO && (
          <>
            <span>
              {translations?.OrderAcknowledgementCard_PurchaseOrderNo}
            </span>
            <span>{customerPO}</span>
          </>
        )}
        {docTypeText && (
          <>
            <span>
              {translations?.OrderAcknowledgementCard_OrderType}
            </span>
            <span>{docTypeText}</span>
          </>
        )}
        {creator && (
          <>
            <span>
              {translations?.OrderAcknowledgementCard_OrderCreatedBy}
            </span>
            <span>{creator}</span>
          </>
        )}
      </div>
    </Card>
  );
}

export default AcknowledgementCard;