import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

export default function FlyoutTableWithRedirectLinks({
  config,
  data,
  handleButtonClick,
  handleButtonField,
  idLabel,
  buttonLabel,
}) {
  return (
    <div>
      <div className="cmp-flyout-with-links__content__tableHeader">
        <span className="cmp-flyout-with-links__content__bold">
          {getDictionaryValueOrKey(idLabel)}
        </span>
        <span className="cmp-flyout-with-links__content__bold">
          {getDictionaryValueOrKey(config?.shipDateColumn)}
        </span>
        <span className="cmp-flyout-with-links__content__bold"></span>
      </div>
      <div>
        {data?.map((line) => {
          const fieldValue = line[handleButtonField];
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
                {line?.dateFormatted}
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
