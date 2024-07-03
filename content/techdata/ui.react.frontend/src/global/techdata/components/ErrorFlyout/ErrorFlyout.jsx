
import React, { useState, useEffect } from 'react';
import BaseFlyout from '../BaseFlyout/BaseFlyout';
import { useRenewalGridState } from '../RenewalsGrid/store/RenewalsStore';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import {useStore} from '../../../../utils/useStore';

export function ErrorFlyout({ store, subheaderReference }) {
  const errorFlyoutConfig = store((st) => st.errorFlyout);
  const effects = store((st) => st.effects);
  const errorFlyoutData = errorFlyoutConfig?.data?.details || '';
  const [commentInput , setCommentInput] = useState('');
  const closeFlyout = () => effects.setCustomState({ key: 'errorFlyout', value: {show:false} });
  const [isLoading, setIsLoading] = useState(false);

  const formBoxStyle = {
    '& > :not(style)': { width: '100%' },
    '& > div': { marginBottom: '16px' },
    '&.MuiBox-root': { marginTop: '20px' },
  };

  return (
    <BaseFlyout
      open={errorFlyoutConfig?.show}
      onClose={closeFlyout}
      width="360px"
      anchor="right"
      subheaderReference={subheaderReference}
      titleLabel={getDictionaryValueOrKey('Error details')}
      secondaryButton={false}
      primaryButton={false}
      classText="share-flyout error-flyout"
      isLoading={false}
    >
      <section className="cmp-flyout__content">
        <p>{getDictionaryValueOrKey(errorFlyoutData)}</p>
      </section>
    </BaseFlyout>
  );
}

export default ErrorFlyout;
