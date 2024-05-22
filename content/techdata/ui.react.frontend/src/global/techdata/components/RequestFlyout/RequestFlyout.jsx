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
import { requestQuote } from './api';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import { getRowAnalytics, ANALYTIC_CONSTANTS } from '../Analytics/analytics';
import {useStore} from '../../../../utils/useStore';

export function RequestFlyout({ store, requestFlyoutContent, subheaderReference }) {
  const requestFlyoutConfig = store((st) => st.requestFlyout);
  const quoteType = getDictionaryValueOrKey('Opportunity');
  const effects = store((st) => st.effects);
  const activeAgreementID = requestFlyoutConfig?.data?.source?.id || '';
  const [commentInput , setCommentInput] = useState('');
  const closeFlyout = () => effects.setCustomState({ key: 'requestFlyout', value: {show:false} });
  const userData = useStore(state => state.userData);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [requestObj, setRequestObj] = useState({});

  useEffect(() => {
    if (!requestFlyoutConfig?.show) {
      setRequestObj({});
      setCommentInput('');
    } else {
        setRequestObj({
            ...requestObj,
            "QuoteId": activeAgreementID,
            "QuoteType": quoteType
        });
    }
  }, [requestFlyoutConfig]);

    const handleCommentChange = (e) => {
        setCommentInput(e.target.value);
        setRequestObj({
          ...requestObj,
          "AdditionalInformation": e.target.value
        });
    };

  const onCloseToaster = () => {
    effects.setCustomState({ key: 'toaster', value: false });
  };

  const handleRequestClick = async (event, skipValidation) => {
      if(event) {
        event.preventDefault();
      }
      setIsLoading(true);
      let toaster = null;
      const dataObj = requestObj;

      const finalRequestObj = {
        Data: dataObj
      }
      const response = await requestQuote(
        finalRequestObj,
        requestFlyoutContent.requestQuoteEndpoint
      );
      setIsLoading(false);
      if (response?.success) {
        // set success message
        toaster = {
            isOpen: true,
            origin: 'fromRequestFlyout',
            isAutoClose: true,
            isSuccess: true,
            message: getDictionaryValueOrKey(requestFlyoutContent.successToastMessage)
        }

        if (toaster) {
          closeFlyout();
          effects.setCustomState({ key: 'toaster', value: { ...toaster } });
        }
      } else {
        // set success message
        toaster = {
            isOpen: true,
            origin: 'fromRequestFlyout',
            isAutoClose: true,
            isSuccess: false,
            message: getDictionaryValueOrKey(requestFlyoutContent.errorToastMessage)
        }

        if (toaster) {
          effects.setCustomState({ key: 'toaster', value: { ...toaster } });
        }
      }
  }

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
      titleLabel={getDictionaryValueOrKey(requestFlyoutContent.requestQuoteHeading) || 'Request quote'}
      secondaryButton={false}
      classText="share-flyout request-flyout"
      isLoading={isLoading}
      onClickButton={handleRequestClick}
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
              value={commentInput}
              onChange={handleCommentChange}
              maxLength={getDictionaryValueOrKey(requestFlyoutContent.requestQuoteCommentCount) || 300}/>
            <span className="char-count">{getDictionaryValueOrKey(requestFlyoutContent.requestQuoteCommentCountText)}</span>
          </div>
        </Box>
      </section>
    </BaseFlyout>
  );
}

export default RequestFlyout;
