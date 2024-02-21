import React from 'react';
import { CobaltInfoIcon } from '../../../../../fluentIcons/FluentIcons';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { getUrlParamsCaseInsensitive } from '../../../../../utils';

function MigrationInfoBox({ id, migrationInfoBoxLabel, viewOrderLabel }) {
  const { saleslogin = '' } = getUrlParamsCaseInsensitive();
  const salesLoginParam = saleslogin ? `&saleslogin=${saleslogin}` : '';
  return (
    <div className="order-line-details__info-box">
      <CobaltInfoIcon />
      <div className="order-line-details__info-box__content">
        <div className="order-line-details__info-box__content__text">
          {getDictionaryValueOrKey(migrationInfoBoxLabel)}
        </div>
        <a
          className="order-line-details__info-box__content__link"
          href={`${location.href.substring(
            0,
            location.href.lastIndexOf('.')
          )}/order-details.html?id=${id}${salesLoginParam}`}
        >
          {getDictionaryValueOrKey(viewOrderLabel)} {id}
        </a>
      </div>
    </div>
  );
}

export default MigrationInfoBox;
