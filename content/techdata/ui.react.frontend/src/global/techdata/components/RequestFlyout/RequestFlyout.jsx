import React, { useState, useEffect } from 'react';
import {
  WarningTriangleIcon,
  ProhibitedIcon
} from '../../../../fluentIcons/FluentIcons';
import BaseFlyout from '../BaseFlyout/BaseFlyout';
import { Button, TextField, Autocomplete, Chip } from '@mui/material';
import Box from '@mui/material/Box';
import { CustomTextField } from '../Widgets/CustomTextField';
import { useRenewalGridState } from '../RenewalsGrid/store/RenewalsStore';
import { shareQuote } from './api';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import { getRowAnalytics, ANALYTIC_CONSTANTS } from '../Analytics/analytics';
import {useStore} from '../../../../utils/useStore';

export function RequestFlyout({ store, requestFlyoutContent, subheaderReference }) {
  const requestFlyoutConfig = store((st) => st.requestFlyout);
  const quoteType = getDictionaryValueOrKey('Renewal');
  const effects = store((st) => st.effects);
  const [enableShare, setEnableShare] = useState(false);
  const [count, setCount] = useState(getDictionaryValueOrKey(requestFlyoutContent.requestQuoteCommentCount));
  const closeFlyout = () => effects.setCustomState({ key: 'requestFlyout', value: {show:false} });
  const userData = useStore(state => state.userData);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [requestObj, setRequestObj] = useState({});

  useEffect(() => {
    resetCount();
    if (!requestFlyoutConfig?.show) {
      setRequestObj({});
    }
  }, [requestFlyoutConfig]);

  const onCloseToaster = () => {
    effects.setCustomState({ key: 'toaster', value: false });
  };

  const handleCommentChange = (e) => {
    const count = getDictionaryValueOrKey(requestFlyoutContent.requestQuoteCommentCount) || 300;
    setCount(parseInt(count) - e.target.value.length);
    updateRequestObject({
      'AdditionalComments': e.target.value
    });
  };

  const resetCount = () => {
    setCount(getDictionaryValueOrKey(requestFlyoutContent.requestQuoteCommentCount));
  };

  const formBoxStyle = {
    '& > :not(style)': { width: '100%' },
    '& > div': { marginBottom: '16px' },
    '&.MuiBox-root': { marginTop: '20px' },
  };

  return (
    <BaseFlyout
      open={requestFlyoutConfig?.show}
      onClose={closeFlyout}
      width="768px"
      anchor="right"
      subheaderReference={subheaderReference}
      titleLabel={getDictionaryValueOrKey(requestFlyoutContent.requestQuoteHeading) || 'Request Quote'}
      secondaryButton={false}
      classText="share-flyout request-flyout"
      isLoading={isLoading}
      buttonLabel={getDictionaryValueOrKey(requestFlyoutContent.requestQuoteButtonLabel) || 'Request'}
      loadingButtonLabel={getDictionaryValueOrKey(requestFlyoutContent.requestQuoteButtonLabel) || 'Requesting'}
    >
      <section className="cmp-flyout__content">
        <p>{getDictionaryValueOrKey(requestFlyoutContent.requestQuoteDescription)}</p>
        <Box
          className="cmp-flyout__share-form"
          component="form"
          sx={formBoxStyle}
          noValidate
          autoComplete="off"
        >
          <div>
            <label>{getDictionaryValueOrKey(requestFlyoutContent.additionalInformationLabel)}</label>
            <textarea type="text"
              placeholder={getDictionaryValueOrKey(requestFlyoutContent.additionalInformationPlaceholderText)}
              className="comments"
              maxLength={getDictionaryValueOrKey(requestFlyoutContent.requestQuoteCommentCount)}/>
            <span className="char-count">{getDictionaryValueOrKey(requestFlyoutContent.requestQuoteCommentCountText)}</span>
          </div>
        </Box>
      </section>
    </BaseFlyout>
  );
}

export default RequestFlyout;
