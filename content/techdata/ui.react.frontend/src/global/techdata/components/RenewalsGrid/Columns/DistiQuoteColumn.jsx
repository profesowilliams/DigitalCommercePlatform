import React from 'react';
import Link from '../../Widgets/Link';
import { useRenewalGridState } from '../store/RenewalsStore';

function DistiQuoteColumn({ id = '' }) {
  const { detailUrl = '' } = useRenewalGridState((state) => state.aemConfig);
  const renewalDetailsURL = encodeURI(
    `${window.location.origin}${detailUrl}.html?id=${id ?? ''}`
  );
  return (
    <Link
      href={renewalDetailsURL}
      variant="renewal-links__secondary"
      underline="hover"
    >
      {id}
    </Link>
  );
}

export default DistiQuoteColumn;
