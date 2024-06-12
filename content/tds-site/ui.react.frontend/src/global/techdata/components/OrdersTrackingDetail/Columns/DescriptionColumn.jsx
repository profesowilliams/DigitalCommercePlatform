import React, { useState } from 'react';
import {
  getDictionaryValueOrKey,
  getDictionaryValue,
} from '../../../../../utils/utils';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';
import { PeopleIcon } from '../../../../../fluentIcons/FluentIcons';
import Tooltip from '@mui/material/Tooltip';
import { getEngUserDataAnalyticsGoogle, getSelectItemAnalyticsGoogle, pushDataLayerGoogle } from '../../OrdersTrackingGrid/utils/analyticsUtils';

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

  const lineNotEmpty = () => {
    for (const value of Object.values(line?.endUser || {})) {
      if (typeof value === 'string' && value.trim() !== '') {
        return true;
      }
    }
    return false;
  };
  const enableTooltip =
    endUserInformationFlag && line?.endUser && lineNotEmpty();
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
    pushDataLayerGoogle(getEngUserDataAnalyticsGoogle());
  };

  const renderTemplate = (aemTemplate, isRow) => {
    let replacedTemplate = aemTemplate;
    for (const [placeholder, val] of Object.entries(replacements)) {
      if (val != undefined) {
        replacedTemplate = replacedTemplate.replace(placeholder, val);
      } else {
        replacedTemplate = replacedTemplate.replace(placeholder, '');
      }
    }
    const result = replacedTemplate.split('<br/>');
    const nonEmptyResults = result.filter((el) => el.trim() !== '');
    return isRow ? (
      <div className="cmp-order-tracking-grid-details__description__user-info-ellipsis">
        {nonEmptyResults.map((el, idx) => {
          return (
            <React.Fragment key={idx}>
              <span>{el}</span>
              {idx !== nonEmptyResults.length - 1 && <span>&nbsp;</span>}
            </React.Fragment>
          );
        })}
      </div>
    ) : (
      <div>
        {nonEmptyResults.map((el, idx) => {
          return <div key={idx}>{el}</div>;
        })}
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
        {line?.displayName && (
          <Tooltip
            title={line.displayName}
            placement="top"
            arrow
            disableInteractive={true}
            disableHoverListener={line.displayName.length < 50}
          >
            {line.urlProductDetailsPage ? (
              <a
                href={line?.urlProductDetailsPage}
                target="_blank"
                className="cmp-order-tracking-grid-details__description-link"
              >
                <span
                  onClick={() => {
                    const params = new URL(line?.urlProductDetailsPage)
                      .searchParams;
                    const productId = params.get('productId');
                    pushDataLayerGoogle(
                      getSelectItemAnalyticsGoogle(
                        line?.displayName,
                        productId,
                        line?.unitPrice,
                        line?.line
                      )
                    );
                  }}
                >
                  {line.displayName}
                </span>
              </a>
            ) : (
              <div className="cmp-order-tracking-grid-details__description-link--disabled">
                {line.displayName}
              </div>
            )}
          </Tooltip>
        )}
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
          {enableTooltip && (
            <Tooltip
              title={
                <>
                  <div>{renderTemplate(template)}</div>
                  <button
                    className="cmp-order-tracking-grid-details__description-button"
                    onClick={handleTooltipClose}
                  >
                    {getDictionaryValueOrKey(
                      config?.itemsLabels?.endUserInfoClose
                    )}
                  </button>
                </>
              }
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
                  {renderTemplate(template, true)}
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
