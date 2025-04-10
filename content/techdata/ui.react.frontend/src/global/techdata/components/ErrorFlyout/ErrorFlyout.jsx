
import React, { useState, useEffect } from 'react';
import BaseFlyout from '../BaseFlyout/BaseFlyout';
import { useRenewalGridState } from '../RenewalsGrid/store/RenewalsStore';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import {useStore} from '../../../../utils/useStore';

export function ErrorFlyout({ store, subheaderReference }) {
  const errorFlyoutConfig = store((st) => st.errorFlyout);
  const effects = store((st) => st.effects);
  let errorFlyoutData = errorFlyoutConfig?.data?.details ?
    JSON.parse(errorFlyoutConfig?.data?.details) : '';
  errorFlyoutData = JSON.stringify(errorFlyoutData, undefined, 2);
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
      width="1080px"
      anchor="right"
      subheaderReference={subheaderReference}
      titleLabel={getDictionaryValueOrKey('Error details')}
      secondaryButton={false}
      hidePrimaryButton={true}
      classText="share-flyout error-flyout"
      isLoading={false}
    >
      <section className="cmp-flyout__content">
        <pre>{getDictionaryValueOrKey(errorFlyoutData)}</pre>
      </section>
    </BaseFlyout>
  );
}

export default ErrorFlyout;
