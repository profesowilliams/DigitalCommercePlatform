import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

export default function FlyoutTableWithRedirectLinks({
  data,
  handleButtonClick,
  handleButtonField,
  idLabel,
  buttonLabel,
  shipDateLabel,
  shipDateField,
}) {
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
