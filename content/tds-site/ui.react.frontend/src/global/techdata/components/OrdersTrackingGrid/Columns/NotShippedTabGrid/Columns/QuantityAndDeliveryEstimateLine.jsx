import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../../../utils/utils';
import { WarningTriangleLarge } from '../../../../../../../fluentIcons/FluentIcons';
import { useOrderTrackingStore } from '../../../../OrdersTrackingGrid/store/OrderTrackingStore';
import { usGet } from '../../../../../../../utils/api';

function QuantityAndDeliveryEstimateLine({
  line,
  el,
  index,
  config,
  id,
  isSeeOptionsButtonVisible,
}) {
  const multiple = line?.lineDetails?.length > 1;
  const isSingleElement = !multiple;
  const isLastElement = multiple && index === line?.lineDetails?.length - 1;
  const isEOL = line?.isEOL;
  const effects = useOrderTrackingStore((state) => state.effects);
  const { setCustomState } = effects;

  const shipDateText = el.shipDateDetailsTranslated || el.shipDateFormatted;
  const getValidationData = async () => {
    try {
      const result = await usGet(
        `${
          config.uiCommerceServiceDomain +
          `/v3/ordervalidation/${id}/${line.line}`
        }`
      );
      return result;
    } catch (error) {
      console.error(error);
    }
  };

  const toasterError = {
    isOpen: true,
    origin: 'fromUpdate',
    isAutoClose: true,
    isSuccess: false,
    message: getDictionaryValueOrKey(config?.eolUpdateErrorMessage),
  };

  const handleSeeOptionsClick = () => {
    getValidationData()
      .then((result) => {
        const orderEditable = result.data.content.orderEditable;
        const enableReplace = result.data.content.replace;
        orderEditable
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

  const EOLStatus = (
    <>
      <span className="line-status">
        <WarningTriangleLarge />
        {getDictionaryValueOrKey(config?.endOfLife)}
      </span>
      {isSeeOptionsButtonVisible && (
        <p className="line-status-link">
          {getDictionaryValueOrKey(config?.eolSeeOptions)}
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
        className={`order-line-details__content__innerTableNotShipped${
          isSingleElement || isLastElement
            ? '__separateLine'
            : '__separateLineMultiple'
        }`}
      >
        <span className="order-line-details__content__innerTableNotShipped__separateLineText">
          {el.quantity}/{line.orderQuantity}
        </span>
      </div>
      <div
        className={`order-line-details__content__innerTableNotShipped${
          isSingleElement || isLastElement
            ? '__separateLine'
            : '__separateLineMultiple'
        } order-line-details__content__innerTableNotShipped__delivery-column`}
      >
        {shipDateText ? (
          <span className="order-line-details__content__innerTableNotShipped__separateLineText">
            {el.shipDateFormatted ? el.shipDateFormatted : ''}
            <br />
            {el.shipDateDetailsTranslated ? el.shipDateDetailsTranslated : ''}
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
