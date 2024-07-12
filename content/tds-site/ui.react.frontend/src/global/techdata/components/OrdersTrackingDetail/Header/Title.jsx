import React, { useState, useEffect } from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { LoaderIcon } from '../../../../../fluentIcons/FluentIcons';

/**
 * Title component to display the status and order number.
 * @param {Object} props - The properties object.
 * @param {Object} props.content - The content object containing order details.
 * @param {Object} props.labels - The labels object containing text labels.
 * @param {boolean} props.isLoading - Boolean indicating if the data is loading.
 * @returns {JSX.Element} The rendered Title component.
 */
const Title = ({ content, labels, isLoading }) => {

  // State variables to hold the status text, order number, and delivery availability
  const [statusText, setStatusText] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [completeDeliveryOnlyAvailable, setCompleteDeliveryOnlyAvailable] = useState(false);

  // TODO:REMOVE!
  // Destructuring labels for easier access
  const { orderNo, completeDeliveryOnly } = labels;

  // useEffect hook to update the state variables when content changes
  useEffect(() => {
    console.log('Title::useEffect::content');

    // If no content is provided, exit early
    if (!content) return;

    // Update the state variables based on the content object
    setStatusText(content.statusText);
    setOrderNumber(content.orderNumber);
    setCompleteDeliveryOnlyAvailable(content.shipComplete === true);
  }, [content]);

  // If data is loading, render a loading state (this part should be completed with actual loading logic)
  if (isLoading) {
    return (<div className="quote-preview-title"><LoaderIcon /></div>);
  }

  return (
    <div className="quote-preview-title">
      <span className="quote-preview-bold">
        {`${getDictionaryValueOrKey(orderNo)}: `}
      </span>
      <span className="quote-preview">{orderNumber}</span>
      <span className="quote-preview-bold quote-preview-offset">|</span>
      <span className="quote-preview-bold quote-preview-offset">
        {statusText}
      </span>
      {completeDeliveryOnlyAvailable && (
        <span className="quote-preview">
          {` ${getDictionaryValueOrKey(completeDeliveryOnly)}`}
        </span>
      )}
    </div>
  );
};

export default Title;