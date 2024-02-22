import React, { useState, useEffect } from 'react';
import { CobaltInfoIcon } from '../../../../../fluentIcons/FluentIcons';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { getUrlParamsCaseInsensitive } from '../../../../../utils';

function MigrationInfoBox({ config, id, referenceType }) {
  const { saleslogin = '' } = getUrlParamsCaseInsensitive();
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
          href={`${location.href.substring(
            0,
            location.href.lastIndexOf('.')
          )}/order-details.html?id=${id}${salesLoginParam}`}
        >
          {getDictionaryValueOrKey(viewOrderText)} {id}
        </a>
      </div>
    </div>
  );
}

export default MigrationInfoBox;
