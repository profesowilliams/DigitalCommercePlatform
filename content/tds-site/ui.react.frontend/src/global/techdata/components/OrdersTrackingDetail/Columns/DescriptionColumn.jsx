import React, { useState } from 'react';
import {
  getDictionaryValueOrKey,
  getDictionaryValue,
} from '../../../../../utils/utils';
import { useOrderTrackingStore } from '../../OrdersTrackingGrid/store/OrderTrackingStore';
import { PeopleIcon } from '../../../../../fluentIcons/FluentIcons';
import Tooltip from '@mui/material/Tooltip';

function DescriptionColumn({ line, config }) {
  const [open, setOpen] = useState(false);

  const {
    name,
    firstName,
    lastName,
    email,
    phone,
    line1,
    line2,
    line3,
    city,
    state,
    zip,
    country,
  } = line?.endUser || {};
  const endUserInformationFlag = useOrderTrackingStore(
    (state) => state.featureFlags.endUserInformation
  );
  const endUserInfoTemplateDefault =
    '{name}<br/>{firstName} {lastName}<br/>{line1}<br/>{line2}<br/>{line3}<br/>{city} {state} {zip} {country}<br/>{phone}<br/>{email}';
  const template = getDictionaryValue(
    config?.itemsLabels?.endUserInfoTemplate,
    endUserInfoTemplateDefault
  );
  const replacements = {
    '{name}': name,
    '{firstName}': firstName,
    '{lastName}': lastName,
    '{email}': email,
    '{phone}': phone,
    '{line1}': line1,
    '{line2}': line2,
    '{line3}': line3,
    '{city}': city,
    '{state}': state,
    '{zip}': zip,
    '{country}': country,
  };
  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };
  const renderTemplate = (aemTemplate) => {
    let replacedTemplate = aemTemplate;
    for (const [placeholder, val] of Object.entries(replacements)) {
      if (val != undefined) {
        replacedTemplate = replacedTemplate.replace(placeholder, val);
      } else {
        replacedTemplate = replacedTemplate.replace(placeholder, '');
      }
    }
    const result = replacedTemplate.split('<br/>');

    return (
      <div>
        {result.map((el, idx) => {
          return <div key={idx}>{el}</div>;
        })}
        <button
          className="cmp-order-tracking-grid-details__description-button"
          onClick={handleTooltipClose}
        >
          {getDictionaryValueOrKey(config?.itemsLabels?.endUserInfoClose)}
        </button>
      </div>
    );
  };

  return (
    <div className="cmp-order-tracking-grid-details__description-row">
      <div className="cmp-order-tracking-grid-details__description-image">
        <img
          className={'cmp-order-tracking-grid-details__description-image-child'}
          src={line?.urlProductImage}
          alt=""
        />
      </div>
      <div className="cmp-order-tracking-grid-details__description-right">
        <Tooltip
          title={line?.displayName ?? ''}
          placement="top"
          arrow
          disableInteractive={true}
        >
          {line?.displayName &&
            (line?.urlProductDetailsPage ? (
              <a
                href={line?.urlProductDetailsPage}
                target="_blank"
                className="cmp-order-tracking-grid-details__description-link"
              >
                {line?.displayName}
              </a>
            ) : (
              <div className="cmp-order-tracking-grid-details__description-link--disabled">
                {line?.displayName}
              </div>
            ))}
        </Tooltip>
        <div className="cmp-order-tracking-grid-details__description-text">
          {line?.mfrNumber && (
            <div>{`${getDictionaryValueOrKey(config?.itemsLabels?.mfrPartNo)} ${
              line?.mfrNumber
            }`}</div>
          )}
          {line?.tdNumber && (
            <div>{`${getDictionaryValueOrKey(config?.itemsLabels?.tdsPartNo)} ${
              line?.tdNumber
            }`}</div>
          )}
          {endUserInformationFlag && line?.endUser && (
            <Tooltip
              title={renderTemplate(template)}
              placement="top"
              arrow
              PopperProps={{
                disablePortal: true,
              }}
              onClose={handleTooltipClose}
              open={open}
              disableFocusListener
              disableHoverListener
              disableTouchListener
            >
              <div
                className="cmp-order-tracking-grid-details__description-user-info-row"
                onClick={handleTooltipOpen}
              >
                <PeopleIcon />
                <div className="cmp-order-tracking-grid-details__description-user-info-link">
                  {renderTemplate(template)}
                </div>
              </div>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
}

export default DescriptionColumn;
