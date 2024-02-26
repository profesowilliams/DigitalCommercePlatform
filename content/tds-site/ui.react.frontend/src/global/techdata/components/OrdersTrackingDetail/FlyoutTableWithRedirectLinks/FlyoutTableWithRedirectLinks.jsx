import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { getReturnAnalyticsGoogle, pushDataLayerGoogle } from '../../OrdersTrackingGrid/utils/analyticsUtils';
import { useOrderTrackingStore } from '../../OrdersTrackingGrid/store/OrderTrackingStore';

export default function FlyoutTableWithRedirectLinks({
  data,
  handleButtonClick,
  handleButtonField,
  idLabel,
  buttonLabel,
  shipDateLabel,
  shipDateField,
}) {
  const returnCounter = useOrderTrackingStore((state) => state.returnCounter);
  const { setReturnCounter } = useOrderTrackingStore((st) => st.effects);
  return (
    <div>
      <div className="cmp-flyout-with-links__content__tableHeader">
        <span className="cmp-flyout-with-links__content__bold">
          {getDictionaryValueOrKey(idLabel)}
        </span>
        <span className="cmp-flyout-with-links__content__bold">
          {getDictionaryValueOrKey(shipDateLabel)}
        </span>
        <span className="cmp-flyout-with-links__content__bold"></span>
      </div>
      <div>
        {data?.map((line) => {
          const fieldValue = line[handleButtonField];
          const shipDateValue = shipDateField ? line[shipDateField] : '';
          const handleClick = () => {
            handleButtonClick(fieldValue);
            pushDataLayerGoogle(getReturnAnalyticsGoogle(returnCounter));
            setReturnCounter(returnCounter+1);
          };
          return (
            <div
              key={line?.id}
              className="cmp-flyout-with-links__content__tableContent"
            >
              <span className="cmp-flyout-with-links__content__tableValue">
                {line?.id}
              </span>
              <span className="cmp-flyout-with-links__content__tableValue">
                {shipDateValue}
              </span>
              <div
                className="cmp-flyout-with-links__content__button"
                onClick={handleClick}
              >
                {getDictionaryValueOrKey(buttonLabel)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
