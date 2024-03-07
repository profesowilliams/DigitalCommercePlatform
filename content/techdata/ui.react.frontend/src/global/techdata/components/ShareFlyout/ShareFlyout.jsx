import React, { useState, useEffect } from 'react';
import {
  SearchIcon,
  WarningIcon,
} from '../../../../fluentIcons/FluentIcons';
import BaseFlyout from '../BaseFlyout/BaseFlyout';
import { Button, TextField, Autocomplete, Chip } from '@mui/material';
import Box from '@mui/material/Box';
import { CustomTextField } from '../Widgets/CustomTextField';
import { EmailInput } from '../ShareFlyout/EmailInput';
import { useRenewalGridState } from '../RenewalsGrid/store/RenewalsStore';
import { shareQuote } from './api';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import { getRowAnalytics, ANALYTIC_CONSTANTS } from '../Analytics/analytics';
import {useStore} from '../../../../utils/useStore';

export function ShareFlyout({ store, shareFlyoutContent, subheaderReference }) {
  const shareFlyoutConfig = store((st) => st.shareFlyout);
  const vendorName = shareFlyoutConfig?.data?.vendor?.name || '';
  const endUserName = shareFlyoutConfig?.data?.endUser?.name || '';
  const firstName = shareFlyoutConfig?.data?.endUser?.contact?.firstName || '';
  const lastName = shareFlyoutConfig?.data?.endUser?.contact?.lastName || '';
  const quoteType = getDictionaryValueOrKey('Renewal');
  const activeAgreementID = shareFlyoutConfig?.data?.source?.id || '';
  const effects = store((st) => st.effects);
  const [enableShare, setEnableShare] = useState(false);
  const closeFlyout = () => effects.setCustomState({ key: 'shareFlyout', value: {show:false} });
  const [count, setCount] = useState(getDictionaryValueOrKey(shareFlyoutContent.shareFlyoutCommentCount));
  const userData = useStore(state => state.userData);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [requestObj, setRequestObj] = useState({});
  const [apiResponseFlag, setApiResponseFlag] = useState(true);
  const [errorObj, setErrorObj] = useState({
                                           	"error": {
                                           		"code": 400,
                                           		"messages": [
                                           			{
                                           				"email": "abctest.com",
                                           				"message": "Invalid Email Format"
                                           			},
                                           			{
                                           				"email": "Tbc@test.com",
                                           				"message": "Dont have access to this quote"
                                           			},
                                           			{
                                           				"email": null,
                                           				"message": "Internal Server Error"
                                           			}
                                           		],
                                           		"isError": true
                                           	}
                                           });

  useEffect(() => {
  }, []);

  useEffect(() => {
    console.log(requestObj, 'request');
  }, [requestObj]);

  useEffect(() => {
    resetCount();
    if (!shareFlyoutConfig?.show) {
      setRequestObj({});
    }
    if (vendorName && quoteType) {
      setRequestObj({
        ...requestObj,
        'FirstName': userData?.firstName,
        'LastName': userData?.lastName,
        'QuoteNumber': activeAgreementID,
        'ViewQuote': quoteType,
        'VendorName': vendorName,
        'QuoteId': activeAgreementID,
        'EndUserName': endUserName,
        'SkipQuotAccessValidation': false,
        'Language': 'en-gb',
      });
    }
  }, [shareFlyoutConfig]);

  const closeAlert = () => {
    setApiResponseFlag(false);
  };

  const handleShareItClick = async (event) => {
    setIsLoading(true);
    const response = await shareQuote(
      requestObj,
      shareFlyoutContent.shareQuoteEndpoint
    );
    setIsLoading(false);
    if (response && response.success) {
      // set success message
    }
    else {
      //setErrorMessage(shareFlyoutContent.unknownError);
      setErrorObj(response.error);
    }
  };

  const updateRequestObject = (updatedData) => {
    setRequestObj({
      ...requestObj,
      ...updatedData
    });
  };

  const handleCommentChange = (e) => {
    const count = getDictionaryValueOrKey(shareFlyoutContent.shareFlyoutCommentCount) || 500;
    setCount(parseInt(count) - e.target.value.length);
    updateRequestObject({
      'AdditionalComments': e.target.value
    });
  };

  const resetCount = () => {
    setCount(getDictionaryValueOrKey(shareFlyoutContent.shareFlyoutCommentCount));
  };

  const formBoxStyle = {
    '& > :not(style)': { width: '100%' },
    '& > div': { marginBottom: '16px' },
    '&.MuiBox-root': { marginTop: '20px' },
  };

  const enableShareButton = (flag) => {
    setEnableShare(flag);
  };

  return (
    <BaseFlyout
      open={shareFlyoutConfig?.show}
      onClose={closeFlyout}
      width="768px"
      anchor="right"
      subheaderReference={subheaderReference}
      titleLabel={getDictionaryValueOrKey(shareFlyoutContent.shareFlyoutTitle) || 'Share'}
      secondaryButton={false}
      classText="share-flyout"
      isLoading={isLoading}
      onClickButton={handleShareItClick}
      buttonLabel={getDictionaryValueOrKey(shareFlyoutContent.shareFlyoutButtonLabel) || 'Share'}
      disabledButton={!enableShare}
    >
      <section className="cmp-flyout__content">
        <p>{getDictionaryValueOrKey(shareFlyoutContent.shareFlyoutDescription)}</p>
        <Box
          className="cmp-flyout__share-form"
          component="form"
          sx={formBoxStyle}
          noValidate
          autoComplete="off"
        >
          <EmailInput
            id="to-email"
            label={getDictionaryValueOrKey(shareFlyoutContent.emailToLabel)}
            required="true"
            enableShareButton={enableShareButton}
            updateRequestObject={updateRequestObject}
            requiredText={getDictionaryValueOrKey(shareFlyoutContent.requiredText)}/>
         <EmailInput
             id="cc-email"
             updateRequestObject={updateRequestObject}
             label={getDictionaryValueOrKey(shareFlyoutContent.emailCCLabel)}/>
          <div className="email-preview-section">
            <h3 className="email-preview-section-title">{getDictionaryValueOrKey(shareFlyoutContent.emailPreviewDescription)}:</h3>
            <p className="email-preview-section-product">{vendorName} {quoteType} for {endUserName} - {activeAgreementID}</p>
            <p className="email-preview-section-desc">{getDictionaryValueOrKey(shareFlyoutContent.shareFlyoutQuoteDescription)}</p>
            <a className="email-preview-section-quote-btn" href={`#`}>{getDictionaryValueOrKey(shareFlyoutContent.shareFlyoutQuoteButtonLabel)}</a>
          </div>
          <div>
            <textarea type="text"
              placeholder={getDictionaryValueOrKey(shareFlyoutContent.shareFlyoutCommentsLabel)}
              className="comments"
              maxLength={getDictionaryValueOrKey(shareFlyoutContent.shareFlyoutCommentCount)}
              onChange={(e) => handleCommentChange(e)}/>
            <span className="char-count">{count} {getDictionaryValueOrKey(shareFlyoutContent.shareFlyoutCommentCountText)}</span>
          </div>
        </Box>
        <div className="email-signature">
          <p>{getDictionaryValueOrKey(shareFlyoutContent.shareFlyoutSignatureLabel)}</p>
          <p>{userData?.firstName} {userData?.lastName}</p>
        </div>
        {
          apiResponseFlag ? (
            <>
              <div className="backdrop"></div>
              <div className="api-failed-section">
                <div className="content-section">
                  {
                    false ?
                    (
                      <>
                        <h3>{shareFlyoutContent.shareFailedLabel}</h3>
                        <p>{shareFlyoutContent.shareFailedDescription}</p>
                      </>
                    ) : null
                  }
                  {
                    true ?
                    (
                      <>
                        <h3>{shareFlyoutContent.incorrectEmailLabel}</h3>
                        <p>{shareFlyoutContent.incorrectEmailDescription}</p>
                        {
                          errorObj?.error?.messages?.map((item) => {
                            return (
                              <span className="email-pills">{item.email}</span>
                            )
                          })
                        }
                      </>
                    ) : null
                  }
                  {
                    false ?
                    (
                      <>
                        <h3>{shareFlyoutContent.recipientNotFoundLabel}</h3>
                        <p>{shareFlyoutContent.recipientNotFoundDescription}</p>
                      </>
                    ) : null
                  }
                </div>
                <div className="button-section">
                  {
                    true ?
                    (
                      <>
                        <a className="cancel-btn" href={`#`}
                          onClick={closeAlert}>{shareFlyoutContent.shareFailedCancelLabel}</a>
                        <a className="try-again-btn" href={`#`}>{shareFlyoutContent.shareFailedTryAgainLabel}</a>
                      </>
                    ) : null
                  }
                  {
                    false ?
                    (
                      <>
                        <a className="cancel-btn" href={`#`}
                        onClick={closeAlert}>{shareFlyoutContent.incorrectEmailCancelLabel}</a>
                        <a className="try-again-btn" href={`#`}>{shareFlyoutContent.incorrectEmailTryAgainLabel}</a>
                      </>
                    ) : null
                  }
                  {
                    false ?
                    (
                      <>
                        <a className="cancel-btn" href={`#`}
                        onClick={closeAlert}>{shareFlyoutContent.recipientNotFoundCancelLabel}</a>
                        <a className="try-again-btn" href={`#`}>{shareFlyoutContent.recipientNotFoundTryAgainLabel}</a>
                      </>
                    ) : null
                  }
                </div>
              </div>
            </>
          ) : null
        }
      </section>
    </BaseFlyout>
  );
}

export default ShareFlyout;
