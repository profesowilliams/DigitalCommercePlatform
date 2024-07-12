import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import { LoaderIcon } from '../../../../../fluentIcons/FluentIcons';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';

/**
 * ContactCard component displays contact information of a sales agent.
 * @param {Object} orderData - Contains the order data.
 * @param {boolean} isLoading - Indicates if the data is still loading.
 */
function ContactCard({ orderData, isLoading }) {

  // Retrieve translations from the store
  const uiTranslations = useOrderTrackingStore((state) => state.uiTranslations);
  const translations = uiTranslations?.['OrderTracking.Details.Cards'];

  // State variables for storing contact information
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Effect hook to update contact information when order data changes
  useEffect(() => {
    console.log('ContactCard::useEffect::orderData');

    // Check if sales agent information is available
    if (!orderData?.salesAgent) return;

    // Update state variables with sales agent information
    setName(orderData.salesAgent.name);
    setPhoneNumber(orderData.salesAgent.phoneNumber);
    setEmail(orderData.salesAgent.email);
    setImageUrl(orderData.salesAgent.imageUrl);

  }, [orderData]);

  // Display a loader icon if the data is still loading
  if (isLoading) {
    return (<Card className="card-container" variant="outlined"><LoaderIcon /></Card>);
  }

  return (
    <Card className="card-container" variant="outlined">
      <div className="card-container__title">
        {translations?.ContactCard_Contact}
      </div>
      <div className="card-container__horizontal">
        {imageUrl && (
          <img className="card-container__image" src={imageUrl} alt="" />
        )}
        <div className="contact-card">
          {name && <span>{name}</span>}
          {phoneNumber && (
            <div>
              <span>
                {translations?.ContactCard_ContactPhone}
              </span>{' '}
              <span>{phoneNumber}</span>
            </div>
          )}
          {email && (
            <span className="card-container__email">
              {email}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

export default ContactCard;