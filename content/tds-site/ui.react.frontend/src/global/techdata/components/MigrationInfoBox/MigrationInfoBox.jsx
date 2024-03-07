import React, { useState, useEffect } from 'react';
import { CobaltInfoIcon } from '../../../../fluentIcons/FluentIcons';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import { getUrlParamsCaseInsensitive } from '../../../../utils';

function MigrationInfoBox({ config, id, referenceType }) {
  const saleslogin = getUrlParamsCaseInsensitive().get("saleslogin");
  const salesLoginParam = saleslogin ? `&saleslogin=${saleslogin}` : '';
  const [description, setDescription] = useState('');
  const { migrationInfoBoxText, originalInfoBoxText, viewOrderText } = config;

  const handleReferenceTypechange = (type) => {
    switch (type) {
      case 'Migrated':
        setDescription(migrationInfoBoxText);
        break;
      case 'Original':
        setDescription(originalInfoBoxText);
        break;
      default:
        break;
    }
  };
  const handleHref = () => {
    const baseUrl = window.location.href.substring(
      0,
      window.location.href.lastIndexOf('.')
    );
    const orderDetailsUrl = window.location.href.includes('order-details.html')
      ? '.html'
      : '/order-details.html';
    return `${baseUrl}${orderDetailsUrl}?id=${id}${salesLoginParam}`;
  };

  useEffect(() => {
    handleReferenceTypechange(referenceType);
  }, [referenceType]);

  return (
    <div className="order-line-details__info-box">
      <CobaltInfoIcon />
      <div className="order-line-details__info-box__content">
        <div className="order-line-details__info-box__content__text">
          {getDictionaryValueOrKey(description)}
        </div>
        <a
          className="order-line-details__info-box__content__link"
          href={handleHref()}
        >
          {getDictionaryValueOrKey(viewOrderText)} {id}
        </a>
      </div>
    </div>
  );
}

export default MigrationInfoBox;
