import React from 'react';
import sanitizeHtml from 'sanitize-html';
import { getDictionaryValue } from '../../../../../utils/utils';
import { thousandSeparator } from '../../../helpers/formatting';

function GridSubTotal({ subtotal, data, gridProps, compProps, adobeVendor }) {
  const migrationQuoteType = data?.quoteType === 'Migration';
  const renewalQuoteType = data?.quoteType === 'Renewal';
  const autoRenewQuoteType = data?.quoteType === 'AutoRenew';
  const isRequestQuoteFlag =
    data?.canRequestQuote && compProps?.enableRequestQuote;
  return (
    <div className="cmp-renewal-preview__subtotal">
      {migrationQuoteType && adobeVendor ? (
        <div className="cmp-renewal-preview__subtotal--note">
          {getDictionaryValue(
            'details.renewal.label.migrationNote',
            'Note: Pricing displayed is subject to vendor price changes and exchange rate fluctuations. Adobe: price displayed in migration quotes is for reference purpose only. VIP and VIP MP Renewals pricing will differ.'
          )}
        </div>
      ) : (renewalQuoteType || autoRenewQuoteType) && adobeVendor ? (
        <div className="cmp-renewal-preview__subtotal--note">
          {getDictionaryValue(
            'details.renewal.label.adobeNote',
            'Please note that pricing is subject to change and is only valid in the same calendar month that this quote has been supplied. The vendor retains rights to implement pricing changes at the start of each month.'
          )}
        </div>
      ) : (
        <div
          className="cmp-renewal-preview__subtotal--note"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(gridProps?.note),
          }}
        ></div>
      )}
      <div className="cmp-renewal-preview__subtotal--price-note">
        <b className="cmp-renewal-preview__subtotal--description">
          {getDictionaryValue(
            'details.renewal.label.subtotal',
            'Quote Subtotal'
          )}
        </b>
        <span className="cmp-renewal-preview__subtotal--value">
          <span className="cmp-renewal-preview__subtotal--currency-symbol">
            {gridProps?.quoteSubtotalCurrencySymbol || ''}
          </span>
          <span>
            {isRequestQuoteFlag
              ? '-'
              : thousandSeparator(subtotal || data?.price)}
          </span>
          {gridProps?.quoteSubtotalCurrency?.length > 0 && (
            <span className="cmp-renewal-preview__subtotal--currency-code">
              {isRequestQuoteFlag
                ? ''
                : gridProps.quoteSubtotalCurrency?.replace(
                    '{currency-code}',
                    data?.currency || ''
                  )}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

export default GridSubTotal;
