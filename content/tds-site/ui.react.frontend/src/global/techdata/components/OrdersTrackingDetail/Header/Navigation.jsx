import React, { useState, useEffect } from 'react';
import Link from '../../Widgets/Link';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';
import { getUrlParamsCaseInsensitive } from '../../../../../utils';
import { ArrowLeftIcon } from '../../../../../fluentIcons/FluentIcons';
import { fetchCriteriaData, fetchNavigationData } from '../Utils/fetchUtils';
import { renderBackButton, createBackUrl } from '../Utils/utils';
import { prevNextOrder, pushDataLayerGoogle } from '../Utils/analyticsUtils';

/**
 * Navigation component to handle the navigation within the order tracking details.
 * @param {Object} props - The properties object.
 * @param {Object} props.config - Configuration object.
 * @param {Object} props.content - Content object containing order details.
 * @param {Function} props.onProductChange - Function to handle product change.
 * @param {boolean} props.isLoading - Boolean indicating if the data is loading.
 * @returns {JSX.Element} The rendered Navigation component.
 */
const Navigation = ({ config, content, onProductChange, isLoading }) => {
  // Extract URL parameters
  const params = getUrlParamsCaseInsensitive();
  const saleslogin = params.get('saleslogin');
  const queryCacheKeyParam = params.get('q');

  // Retrieve translations from the store
  const uiTranslations = useOrderTrackingStore((state) => state.uiTranslations);
  const detailsTranslations = uiTranslations?.['OrderTracking.Details'];

  // State variables for navigation and back button data
  const [backButton, setBackButton] = useState(null);
  const [previousOrder, setPreviousOrder] = useState(null);
  const [nextOrder, setNextOrder] = useState(null);
  const [backUrl, setBackUrl] = useState(null);
  const [id, setId] = useState(null);

  /**
   * Handle click event on navigation links.
   * @param {string} type - Prev or Next.
   * @param {Event} e - The click event.
   * @param {string} id - The order ID to navigate to.
   */
  const handleClick = (type, e, id) => {
    console.log('Navigation::handleClick');
    e.preventDefault();

    pushDataLayerGoogle(prevNextOrder(type, id));

    onProductChange(id);
  };

  // Effect to fetch navigation data when content changes
  useEffect(async () => {
    console.log('Navigation::useEffect::content');

    if (!content) return;

    setId(content.orderNumber);

    const navigationData = queryCacheKeyParam && (await fetchNavigationData(config, queryCacheKeyParam, content.orderNumber));
    setPreviousOrder(navigationData?.prevOrder);
    setNextOrder(navigationData?.nextOrder);

    const criteriaData = queryCacheKeyParam && (await fetchCriteriaData(config, queryCacheKeyParam, content.orderNumber));
    setBackUrl(createBackUrl(saleslogin, queryCacheKeyParam, criteriaData));
    setBackButton(renderBackButton(detailsTranslations, criteriaData));
  }, [content]);

  return (
    <>
      {backUrl && (<Link
        variant="back-to-orders"
        href={backUrl}
        underline="underline-none"
      >
        <ArrowLeftIcon className="arrow-left" />
        {backButton}
      </Link>)}
      {!isLoading && (<div className="navigation-container--right">
        {previousOrder && (
          <a
            href={window.location.href.replace(id, previousOrder)}
            className="tdr-link previous underline-none"
            onClick={(e) => handleClick('prev', e, previousOrder)}
          >
            <i className="fas fa-chevron-left"></i>
            {detailsTranslations?.Button_Prev || 'Previous order'}
          </a>
        )}
        {nextOrder && (
          <a
            href={window.location.href.replace(id, nextOrder)}
            className="tdr-link next underline-none"
            onClick={(e) => handleClick('next', e, nextOrder)}
          >
            {detailsTranslations?.Button_Next || 'Next order'}
            <i className="fas fa-chevron-right"></i>
          </a>
        )}
      </div>)}
    </>
  )
};

export default Navigation;