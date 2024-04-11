import React from 'react';
import { useOrderTrackingStore } from '../../OrdersTrackingGrid/store/OrderTrackingStore';
import { WarningTriangle } from '../../../../../fluentIcons/FluentIcons';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { getUrlParams } from '../../../../../utils';
import { usGet } from '../../../../../utils/api';

function LineStatusColumn({ line, config, sortedLineDetails }) {
  const { id = '' } = getUrlParams();

  const multiple = line?.lineDetails?.length > 1;
  const isSingleElement = !multiple;
  const effects = useOrderTrackingStore((state) => state.effects);
  const { setCustomState } = effects;
  const orderModificationFlag = useOrderTrackingStore(
    (state) => state.featureFlags.orderModification
  );

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
    message: getDictionaryValueOrKey(
      config?.itemsLabels?.itemsUpdateErrorMessage
    ),
  };

  const handleSeeOptionsClick = (index) => {
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
                data: { line, index },
                enableReplace,
                show: true,
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
        <WarningTriangle />
        {getDictionaryValueOrKey(config?.itemsLabels?.endOfLife)}
      </span>
      {orderModificationFlag && (
        <p className="line-status-link">
          {getDictionaryValueOrKey(config?.itemsLabels?.seeOptions)}
        </p>
      )}
    </>
  );

  return (
    <div className="cmp-order-tracking-grid-details__splitLine-column">
      {sortedLineDetails(line)?.map((el, index) => {
        const isLastElement =
          multiple && index === line?.lineDetails?.length - 1;
        const isEOL = line?.lineDetails[index].isEOL;
        return (
          <div
            key={line.tdNumber + index}
            className={`cmp-order-tracking-grid-details__splitLine${
              isSingleElement || isLastElement
                ? '__separateLine'
                : '__separateLineMultiple'
            }`}
          >
            <span
              className="cmp-order-tracking-grid-details__splitLine__separateLineText"
              onClick={
                isEOL && orderModificationFlag
                  ? () => handleSeeOptionsClick(index)
                  : null
              }
            >
              {isEOL ? EOLStatus : el.statusText || ''}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default LineStatusColumn;
