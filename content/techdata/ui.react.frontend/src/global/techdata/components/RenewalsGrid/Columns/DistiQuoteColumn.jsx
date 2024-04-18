import React from 'react';
import Link from '../../Widgets/Link';
import { useRenewalGridState } from '../store/RenewalsStore';
import { getRowAnalytics, ANALYTIC_CONSTANTS } from '../../Analytics/analytics';

function DistiQuoteColumn({ id = '', type = 'renewal' }) {
  const { detailUrl = '' } = useRenewalGridState((state) => state.aemConfig);
  const analyticsCategory = useRenewalGridState((state) => state.analyticsCategory);
  const orderType = type.toLowerCase();
  const renewalDetailsURL = encodeURI(
    `${window.location.origin}${detailUrl}.html?id=${id ?? ''}&type=${orderType}`
  );
  let analyticsData = {
    source: { id: id },
    vendor: undefined,
    reseller: undefined,
    link: renewalDetailsURL,
  };
  return (
    <Link
      href={renewalDetailsURL}
      variant="renewal-links__secondary"
      underline="hover"
      analyticsCallback={getRowAnalytics.bind(null,
        analyticsCategory,
        ANALYTIC_CONSTANTS.Grid.RowActions.ViewDetail,
        analyticsData)}
    >
      {id}
    </Link>
  );
}

export default DistiQuoteColumn;
