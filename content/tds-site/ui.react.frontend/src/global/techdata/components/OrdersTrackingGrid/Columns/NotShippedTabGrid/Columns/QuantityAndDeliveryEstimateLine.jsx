import React from 'react';
import { WarningTriangleLarge } from '../../../../../../../fluentIcons/FluentIcons';
import { useOrderTrackingStore } from '../../../../OrdersTrackingCommon/Store/OrderTrackingStore';
import { usGet } from '../../../../../../../utils/api';
import { getOrderModificationFailedGoogle, pushDataLayerGoogle } from '../../../Utils/analyticsUtils';

/**
 * QuantityAndDeliveryEstimateLine component displays information about the quantity and delivery estimates 
 * for a line item in the order grid. It handles the display of shipping dates, status text, and End of Life (EOL) 
 * indicators. It also provides an option to view replacement or cancellation options if applicable.
 * 
 * @param {Object} props - The component properties.
 * @param {Object} props.line - The line item data, including details and quantities.
 * @param {Object} props.el - The individual element data within the line.
 * @param {number} props.index - The index of the current line detail element.
 * @param {Object} props.config - The configuration object with necessary URLs.
 * @param {string} props.id - The order ID.
 * @param {boolean} props.isSeeOptionsButtonVisible - Flag to determine if the "See Options" button should be visible.
 * @returns {JSX.Element} The rendered line item details including quantity, delivery estimates, and status.
 */
function QuantityAndDeliveryEstimateLine({ line, el, index, config, id, isSeeOptionsButtonVisible }) {
  // Fetch translations from the order tracking store
  const uiTranslations = useOrderTrackingStore((state) => state.uiTranslations);
  const translations = uiTranslations?.['OrderTracking.MainGrid.Expand.NotShippedTab'];

  // Determine if there are multiple line details and if the current one is the last element
  const multiple = line?.lineDetails?.length > 1;
  const isSingleElement = !multiple;
  const isLastElement = multiple && index === line?.lineDetails?.length - 1;

  // Check if the item is End of Life (EOL)
  const isEOL = line?.isEOL;

  // Fetch effects from the store, specifically to set custom state
  const effects = useOrderTrackingStore((state) => state.effects);
  const { setCustomState } = effects;

  // Determine the appropriate text for the ship date
  const shipDateText = el.shipDateDetailsTranslated || el.shipDateFormatted;

  /**
   * Fetches validation data to determine if the order can be modified or replaced.
   * Opens the product replacement flyout if options are available; otherwise, shows a toaster error.
   */
  const getValidationData = async () => {
    try {
      const result = await usGet(
        `${config.uiCommerceServiceDomain + `/v3/ordervalidation/${id}/${line.line}`}`
      );
      if (result?.content?.orderEditable === false) {
        pushDataLayerGoogle(getOrderModificationFailedGoogle('modify order'));
      }
      return result;
    } catch (error) {
      console.error(error);
    }
  };

  // Configuration for the toaster error message if modification fails
  const toasterError = {
    isOpen: true,
    origin: 'fromUpdate',
    isAutoClose: true,
    isSuccess: false,
    message: translations?.Modify_Fail_Text || 'It was not possible to complete your request at this time, please try again later.',
  };

  /**
   * Handles the click event to see replacement options for the item.
   * If the order is editable and options are available, it sets the custom state to show the product replacement flyout.
   * Otherwise, it displays a toaster error.
   */
  const handleSeeOptionsClick = () => {
    getValidationData()
      .then((result) => {
        const orderEditable = result.data.content.orderEditable;
        const enableReplace = result.data.content.replace;
        const enableCancel = result.data.content.cancel;
        const disableReplaceAndCancel = !(enableReplace || enableCancel);
        orderEditable && !disableReplaceAndCancel
          ? setCustomState({
            key: 'productReplacementFlyout',
            value: {
              data: { line },
              enableReplace,
              show: true,
              orderId: id,
            },
          })
          : effects.setCustomState({
            key: 'toaster',
            value: { ...toasterError },
          });
      })
      .catch((error) => {
        console.error('Error:', error);
        effects.setCustomState({
          key: 'toaster',
          value: { ...toasterError },
        });
      });
  };

  // End of Life (EOL) status and options display
  const EOLStatus = (
    <>
      <span className="line-status">
        <WarningTriangleLarge />
        {translations?.EOL || 'End of Life'}
      </span>
      {isSeeOptionsButtonVisible && (
        <p className="line-status-link">
          {translations?.EOL_SeeOptions || 'See options'}
        </p>
      )}
    </>
  );

  return (
    <div
      key={el.id}
      className={
        'order-line-details__content__innerTableNotShipped__container-row'
      }
    >
      <div
        className={`order-line-details__content__innerTableNotShipped${isSingleElement || isLastElement
          ? '__separateLine'
          : '__separateLineMultiple'
          }`}
      >
        <span className="order-line-details__content__innerTableNotShipped__separateLineText">
          {el.quantity}/{line.orderQuantity}
        </span>
      </div>
      <div
        className={`order-line-details__content__innerTableNotShipped${isSingleElement || isLastElement
          ? '__separateLine'
          : '__separateLineMultiple'
          } order-line-details__content__innerTableNotShipped__delivery-column`}
      >
        {shipDateText ? (
          <span className="order-line-details__content__innerTableNotShipped__separateLineText">
            {el.shipDateFormatted && <span>{el.shipDateFormatted}</span>}
            {el.shipDateFormatted && <br />}
            {el.shipDateDetailsTranslated && <span>{el.shipDateDetailsTranslated}</span>}
          </span>
        ) : (
          <span></span>
        )}
        {el.statusText ? (
          <span
            className="order-line-details__content__innerTableNotShipped__separateLineText"
            onClick={
              isEOL && isSeeOptionsButtonVisible ? handleSeeOptionsClick : null
            }
          >
            {isEOL ? EOLStatus : el.statusText || ''}
          </span>
        ) : (
          <span></span>
        )}
      </div>
    </div>
  );
}

export default QuantityAndDeliveryEstimateLine;