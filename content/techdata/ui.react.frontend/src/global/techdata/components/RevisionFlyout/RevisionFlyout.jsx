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
import { requestRevision } from './api';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import { getRowAnalytics, ANALYTIC_CONSTANTS } from '../Analytics/analytics';
import {useStore} from '../../../../utils/useStore';

export function RevisionFlyout({ store, revisionFlyoutContent, subheaderReference }) {
  const revisionFlyoutConfig = store((st) => st.revisionFlyout);
  const quoteType = getDictionaryValueOrKey('Renewal');
  const effects = store((st) => st.effects);
  const [enableRevision, setEnableRevision] = useState(false);
  const [commentInput , setCommentInput] = useState('');
  const activeAgreementID = revisionFlyoutConfig?.data?.source?.id || '';
  const [count, setCount] = useState(getDictionaryValueOrKey(revisionFlyoutContent.requestRevisionCommentCount));
  const closeFlyout = () => effects.setCustomState({ key: 'revisionFlyout', value: {show:false} });
  const userData = useStore(state => state.userData);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [requestObj, setRequestObj] = useState({});

  useEffect(() => {
    if (!revisionFlyoutConfig?.show) {
      setRequestObj({});
      setCommentInput('');
      resetCount();
    } else {
        setRequestObj({
            ...requestObj,
            "QuoteNumber": activeAgreementID,
        });
    }
  }, [revisionFlyoutConfig]);

  const onCloseToaster = () => {
    effects.setCustomState({ key: 'toaster', value: false });
  };

  const handleCommentChange = (e) => {
    const count = getDictionaryValueOrKey(revisionFlyoutContent.requestRevisionCommentCount) || 500;
    setCount(parseInt(count) - e.target.value.length);
    setCommentInput(e.target.value);
    setRequestObj({
      ...requestObj,
      "AdditionalComments": e.target.value
    });
  };

  const resetCount = () => {
    setCount(getDictionaryValueOrKey(revisionFlyoutContent.requestRevisionCommentCount));
  };

  const handleRevisionClick = async (event) => {
        if(event) {
          event.preventDefault();
        }
        setIsLoading(true);
        let toaster = null;
        const dataObj = requestObj;

        const finalRequestObj = {
          Data: dataObj
        }
        const response = await requestRevision(
          finalRequestObj,
          revisionFlyoutContent.reviseQuoteEndpoint
        );
        setIsLoading(false);
        if (response?.success) {
          // set success message
          toaster = {
              isOpen: true,
              origin: 'fromRequestRevisionFlyout',
              isAutoClose: true,
              isSuccess: true,
              message: getDictionaryValueOrKey(revisionFlyoutContent.successToastMessage)
          }

          // resetGrid && resetGrid();

          if (toaster) {
            closeFlyout();
            effects.setCustomState({ key: 'toaster', value: { ...toaster } });
          }
        } else {
          // set success message
          toaster = {
              isOpen: true,
              origin: 'fromRequestRevisionFlyoutout',
              isAutoClose: true,
              isSuccess: false,
              message: getDictionaryValueOrKey(revisionFlyoutContent.errorToastMessage)
          }

          if (toaster) {
            closeFlyout();
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
      open={revisionFlyoutConfig?.show}
      onClose={closeFlyout}
      width="768px"
      anchor="right"
      subheaderReference={subheaderReference}
      titleLabel={getDictionaryValueOrKey(revisionFlyoutContent.requestRevisionHeading) || 'Request revision'}
      secondaryButton={false}
      classText="share-flyout revise-flyout"
      isLoading={isLoading}
      onClickButton={handleRevisionClick}
      buttonLabel={getDictionaryValueOrKey(revisionFlyoutContent.requestRevisionButtonLabel) || 'Request'}
      loadingButtonLabel={getDictionaryValueOrKey(revisionFlyoutContent.requestRevisionButtonLabel) || 'Requesting'}
    >
      <section className="cmp-flyout__content">
        <p>{getDictionaryValueOrKey(revisionFlyoutContent.requestRevisionDescription)}</p>
        <Box
          className="cmp-flyout__share-form"
          component="form"
          sx={formBoxStyle}
          noValidate
          autoComplete="off"
        >
          <div>
            <label>{getDictionaryValueOrKey(revisionFlyoutContent.additionalInformationLabel)}</label>
            <textarea type="text"
              placeholder={getDictionaryValueOrKey(revisionFlyoutContent.additionalInformationPlaceholderText)}
              className="comments"
              value={commentInput}
              onChange={handleCommentChange}
              maxLength={getDictionaryValueOrKey(revisionFlyoutContent.requestRevisionCommentCount)}/>
            <span className="char-count">{count}{' '}{getDictionaryValueOrKey(revisionFlyoutContent.requestRevisionCommentCountText)}</span>
          </div>
        </Box>
      </section>
    </BaseFlyout>
  );
}

export default RevisionFlyout;
