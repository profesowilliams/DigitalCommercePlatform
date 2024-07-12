import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import { LoaderIcon } from '../../../../../fluentIcons/FluentIcons';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';

/**
 * SoldToCard component displays shipping information.
 * @param {Object} orderData - Contains the order details.
 * @param {boolean} isLoading - Indicates if the data is still loading.
 */
function SoldToCard({ orderData, isLoading }) {

  // Retrieve translations from the store
  const uiTranslations = useOrderTrackingStore((state) => state.uiTranslations);
  const translations = uiTranslations?.['OrderTracking.Details.Cards'];

  // Default template for the shipping information
  const shipToTemplateDefault = '{companyName}<br/>{line1}<br/>{line2} {houseNumber}<br/>{line3}<br/>{lineName3}<br/>{lineName4}<br/>{city} {state} {zip} {country}<br/>{phoneNumber}<br/>{email}';

  // State variables for storing the template and replacements
  const [template, setTemplate] = useState(shipToTemplateDefault);
  const [replacements, setReplacements] = useState({});

  /**
   * Renders individual elements of the template.
   * @param {string} el - The current element to render.
   * @param {number} idx - The index of the element.
   * @returns {JSX.Element} - The rendered element.
   */
  const renderElement = (el, idx) => {
    console.log('SoldToCard::renderElement');

    const email = replacements['{email}'];
    const phoneNumber = replacements['{phoneNumber}'];

    // Check if the element is an email or phone number and render accordingly
    if (el === phoneNumber || el === email) {
      return (
        <div key={idx} className="card-container__bottom">
          {el === phoneNumber && (
            <div>
              {translations?.SoldToCard_Phone}{' '}
              {phoneNumber}
              <br />
            </div>
          )}
          {el === email && (
            <div>
              {translations?.SoldToCard_Email}{' '}
              {email}
            </div>
          )}
        </div>
      );
    } else {
      // Render other elements as plain text
      return (
        <div key={idx} className="card-container__text">
          {el}
        </div>
      );
    }
  };

  /**
   * Replaces placeholders in the template with actual values.
   * @param {string} aemTemplate - The template string containing placeholders.
   * @returns {JSX.Element[]} - An array of rendered elements.
   */
  const renderTemplate = (aemTemplate) => {
    console.log('SoldToCard::renderTemplate');

    let replacedTemplate = aemTemplate;

    // Replace each placeholder with its corresponding value
    for (const [placeholder, val] of Object.entries(replacements)) {
      if (val !== undefined && val !== null) {
        replacedTemplate = replacedTemplate.replace(placeholder, val);
      } else {
        replacedTemplate = replacedTemplate.replace(placeholder, '');
      }
    }

    // Split the replaced template by <br/> and render each part
    const result = replacedTemplate.split('<br/>');

    return result.map((el, idx) => {
      return renderElement(el, idx);
    });
  };

  /**
   * Effect hook to update the template and replacements when order data changes.
   */
  useEffect(() => {
    console.log('SoldToCard::useEffect::orderData');

    // Check if shipTo and translations are available
    if (!orderData?.shipTo || !translations?.SoldToCard_ShipToTemplate) return;

    // Update the template with the translated template
    setTemplate(translations?.SoldToCard_ShipToTemplate);

    setReplacements({
      '{companyName}': orderData.shipTo.companyName,
      '{line1}': orderData.shipTo.line1,
      '{line2}': orderData.shipTo.line2,
      '{line3}': orderData.shipTo.line3,
      '{lineName3}': orderData.shipTo.lineName3,
      '{lineName4}': orderData.shipTo.lineName4,
      '{city}': orderData.shipTo.city,
      '{state}': orderData.shipTo.state,
      '{zip}': orderData.shipTo.zip,
      '{country}': orderData.shipTo.country,
      '{phoneNumber}': orderData.shipTo.phoneNumber,
      '{email}': orderData.shipTo.email,
      '{houseNumber}': orderData.shipTo.houseNumber,
    });
  }, [orderData, translations]);

  // Display a loader icon if the data is still loading
  if (isLoading) {
    return (<Card className="card-container" variant="outlined"><LoaderIcon /></Card>);
  }

  return (
    <Card className="card-container" variant="outlined">
      <div className="card-container__title">
        {translations?.SoldToCard_SoldTo}
      </div>
      <div className="shipto-card">{renderTemplate(template)}</div>
    </Card>
  );
}

export default SoldToCard;