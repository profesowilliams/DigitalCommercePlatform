import React, { useState, useEffect } from 'react';
import {
  WarningTriangleIcon,
  ProhibitedIcon,
  DeleteIcon
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

function ErrorModelEmailPill({item, updateAccessErrObject}) {

  const [editPill, setEditPill] = useState(false);
  const [value, setValue] = useState(item.email);
  const [isError, setError] = useState(false);

  const editEmailPill = () => {
    setEditPill(true);
  };

  const isValidEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      if (isValidEmailFormat(Object.values(e.target.value))) {
        setError(false);
        setEditPill(false);
        updateAccessErrObject({
          [item.email]: e.target.value
        });
      } else {
        setError(true);
      }
    }
  };

  const updateValue = (e) => {
    setValue(e.target.value);
  };

  const deleteEmailPill = () => {
    updateAccessErrObject({
      [item.email]: ''
    });
  };

  return (
      editPill === false ?
        <span className="email-pills" onDoubleClick={editEmailPill}>{value}
          <span className="close-icon" onClick={deleteEmailPill}><DeleteIcon width="15" height="15" /></span></span> :
        <input className={isError ? 'error-input' : ''} value={value} type="text"
          onKeyDown={handleEnter}
          onChange={updateValue}
        />
  );
}

export function ShareFlyout({ store, shareFlyoutContent, subheaderReference, reseller }) {
  const shareFlyoutConfig = store((st) => st.shareFlyout);
  const vendorName = shareFlyoutConfig?.data?.vendor?.name || '';
  const endUserName = reseller ? reseller.name : shareFlyoutConfig?.data?.endUser?.name;
  const firstName = shareFlyoutConfig?.data?.endUser?.contact?.firstName || '';
  const lastName = shareFlyoutConfig?.data?.endUser?.contact?.lastName || '';
  const quoteType = getDictionaryValueOrKey('Renewal');
  const activeAgreementID = shareFlyoutConfig?.data?.source?.id || '';
  const effects = store((st) => st.effects);
  const [enableShare, setEnableShare] = useState(false);
  const closeFlyoutModal = () => effects.setCustomState({ key: 'shareFlyout', value: {show:false} });
  const [count, setCount] = useState(getDictionaryValueOrKey(shareFlyoutContent.shareFlyoutCommentCount));
  const userData = useStore(state => state.userData);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [requestObj, setRequestObj] = useState({});
  const [apiResponseFlag, setApiResponseFlag] = useState(false);
  const [toEmailsArr, setToEmailsArr] = useState([]);
  const [ccEmailsArr, setCcEmailsArr] = useState([]);
  const [resetDataFlag, setResetDataFlag] = useState(false);
  const [errorFlags, setErrorFlags] = useState({
    incorrect: false,
    notFound: false,
    serverError: false
  })
  const [errorObj, setErrorObj] = useState({});
  const [accessErrObj, setAccessErrObj] = useState([]);

  useEffect(() => {
    resetCount();
    if (!shareFlyoutConfig?.show) {
      setRequestObj({});
      setAccessErrObj([]);
    }
    console.log(vendorName, quoteType, ":Testing")
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
        'EmailBody': getDictionaryValueOrKey(shareFlyoutContent.shareFlyoutQuoteDescription),
        'Signature': getDictionaryValueOrKey(shareFlyoutContent.shareFlyoutSignatureLabel)
      });
    }
  }, [shareFlyoutConfig]);

  useEffect(() => {
    if (toEmailsArr?.length > 0) {
      setEnableShare(true);
    } else {
      setEnableShare(false);
    }
  }, [toEmailsArr]);

  const closeAlert = () => {
    setErrorFlags({
      incorrect: false,
      notFound: false,
      serverError: false
    });
    setApiResponseFlag(false);
    setAccessErrObj([]);
  };

  const handleTryAgainBtn = (e, skipValidation) => {
    if(event) {
      e.preventDefault();
    }
    closeAlert();
    if (toEmailsArr.length > 0) {
      handleShareItClick(null, skipValidation);
      setAccessErrObj([]);
    }
  };

  const handleShareItClick = async (event, skipValidation) => {
    if(event) {
      event.preventDefault();
    }
    setIsLoading(true);
    setEnableShare(false);
    let toaster = null;
    const dataObj = requestObj;
    if (skipValidation) {
      dataObj.SkipQuotAccessValidation = true;
    }
    const finalRequestObj = {
      Data: dataObj
    }
    const response = await shareQuote(
      finalRequestObj,
      shareFlyoutContent.shareQuoteEndpoint
    );
    setIsLoading(false);
    setEnableShare(true);
    if (response?.success) {
      // set success message
      toaster = {
          isOpen: true,
          origin: 'fromShareFlyout',
          isAutoClose: true,
          isSuccess: true,
          message: getDictionaryValueOrKey(shareFlyoutContent.shareSuccessMessage)
      }

      if (toaster) {
        closeFlyout();
        effects.setCustomState({ key: 'toaster', value: { ...toaster } });
      }
    }
    else {
      setApiResponseFlag(true);
      setErrorObj(response.messages);
      let accessObj = [];
      if (response?.code === 400) {
        accessObj = response.messages.filter((item) => {
          return item.message?.indexOf('access ') > -1;
        });
        let errorFlags = {
          incorrectFlag: 0,
          accessFlag: 0,
          serverFlag: 0
        }
        for(var i = 0; i < response.messages.length; i++) {
          if (response.messages[i]?.message?.indexOf('Invalid') > -1) {
            errorFlags = {
              ...errorFlags,
              incorrectFlag: 1
            }
          } else if (response.messages[i]?.message?.indexOf('access') > -1) {
            errorFlags = {
              ...errorFlags,
              accessFlag: 1
            }
          } else {
            errorFlags = {
              ...errorFlags,
              serverFlag: 1
            }
          }
        }
        if (errorFlags.incorrectFlag > 0) {
          setErrorFlags({
            ...errorFlags,
            incorrect: true
           });
        } else if (errorFlags.accessFlag > 0) {
          setErrorFlags({
            ...errorFlags,
            notFound: true
          });
        } else {
          setErrorFlags({
            ...errorFlags,
            serverError: true
          });
        }
      } else {
        setErrorFlags({
          ...errorFlags,
          serverError: true
        });
      }
      setAccessErrObj(accessObj);
    }
  };

  const onCloseToaster = () => {
    effects.setCustomState({ key: 'toaster', value: false });
  };

  const updateAccessErrObject = (updatedObj) => {
   let errObj = [...accessErrObj];
   for (var i=0; i < accessErrObj.length; i++) {
    if (errObj[i].email === Object.keys(updatedObj)[0]) {
      if (Object.values(updatedObj)[0] === '') {
        errObj.splice([i], 1);
      } else {
        errObj[i].email = Object.values(updatedObj)[0];
      }
      break;
    }
   }
   const updatedEmailsArr = errObj.map((item) => item.email);
   const toArr = toEmailsArr;
   const ccArr = ccEmailsArr;
   if (isValidEmailFormat(Object.values(updatedObj)[0])) {
     const toIndex = toArr.indexOf(Object.keys(updatedObj)[0]);
     const ccIndex = ccArr.indexOf(Object.keys(updatedObj)[0]);
     if (toIndex > -1) {
      toArr.splice(toIndex, 1);
      toArr.push(Object.values(updatedObj)[0]);
      setToEmailsArr([...toArr]);
     } else if (ccIndex > -1) {
       ccArr.splice(ccIndex, 1);
       ccArr.push(Object.values(updatedObj)[0]);
       setCcEmailsArr([...ccArr]);
      }
     setAccessErrObj([...errObj]);
   } else if (Object.values(updatedObj)[0] === '' ) {
      const toIndex = toArr.indexOf(Object.keys(updatedObj)[0]);
       const ccIndex = ccArr.indexOf(Object.keys(updatedObj)[0]);
       if (toIndex > -1) {
        toArr.splice(toIndex, 1);
        setToEmailsArr([...toArr]);
       } else if (ccIndex > -1) {
         ccArr.splice(ccIndex, 1);
         setCcEmailsArr([...ccArr]);
        }
       setAccessErrObj([...errObj]);
   }
  };

  const isValidEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const updatedEmailArr = (arr, flag) => {
    if (flag) {
      setToEmailsArr([...arr]);
    } else {
      setCcEmailsArr([...arr]);
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

  const closeFlyout = () => {
    resetData();
    closeFlyoutModal();
  };

  const resetData = () => {
    setToEmailsArr([]);
    setAccessErrObj([]);
    setErrorFlags({
      incorrect: false,
      notFound: false,
      serverError: false
    });
    setResetDataFlag(true);
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
      titleLabel={
        getDictionaryValueOrKey(shareFlyoutContent.shareFlyoutTitle) || 'Share'
      }
      secondaryButton={false}
      classText="share-flyout"
      isLoading={isLoading}
      onClickButton={handleShareItClick}
      buttonLabel={
        getDictionaryValueOrKey(shareFlyoutContent.shareFlyoutButtonLabel) ||
        'Share'
      }
      disabledButton={!enableShare}
      isShareFlyout={true}
      loadingButtonLabel={
        getDictionaryValueOrKey(
          shareFlyoutContent.shareFlyoutButtonSharingLabel
        ) || 'Sharing'
      }
    >
      <section className="cmp-flyout__content">
        <p className="cmp-flyout__content__description">
          {getDictionaryValueOrKey(shareFlyoutContent.shareFlyoutDescription)}
        </p>
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
            updatedEmailArr={updatedEmailArr}
            emailsArr={toEmailsArr}
            resetDataFlag={resetDataFlag}
            requiredText={getDictionaryValueOrKey(
              shareFlyoutContent.requiredText
            )}
          />
          <EmailInput
            id="cc-email"
            updateRequestObject={updateRequestObject}
            label={getDictionaryValueOrKey(shareFlyoutContent.emailCCLabel)}
            updatedEmailArr={updatedEmailArr}
            resetDataFlag={resetDataFlag}
            emailsArr={ccEmailsArr}
          />
          <div className="email-preview-section">
            <h3 className="email-preview-section-title">
              {getDictionaryValueOrKey(
                shareFlyoutContent.emailPreviewDescription
              )}
              :
            </h3>
            <p className="email-preview-section-product">
              {vendorName} {quoteType} for {endUserName} - {activeAgreementID}
            </p>
            <p className="email-preview-section-desc">
              {getDictionaryValueOrKey(
                shareFlyoutContent.shareFlyoutQuoteDescription
              )}
            </p>
            <a className="email-preview-section-quote-btn" href={`#`}>
              {getDictionaryValueOrKey(
                shareFlyoutContent.shareFlyoutQuoteButtonLabel
              )}
            </a>
          </div>
          <div>
            <textarea
              type="text"
              placeholder={getDictionaryValueOrKey(
                shareFlyoutContent.shareFlyoutCommentsLabel
              )}
              className="comments"
              maxLength={getDictionaryValueOrKey(
                shareFlyoutContent.shareFlyoutCommentCount
              )}
              onChange={(e) => handleCommentChange(e)}
            />
            <span className="char-count">
              {count}{' '}
              {getDictionaryValueOrKey(
                shareFlyoutContent.shareFlyoutCommentCountText
              )}
            </span>
          </div>
        </Box>
        <div className="email-signature">
          <p>
            {getDictionaryValueOrKey(
              shareFlyoutContent.shareFlyoutSignatureLabel
            )}
          </p>
          <p>
            {userData?.firstName} {userData?.lastName}
          </p>
        </div>
        {apiResponseFlag ? (
          <>
            <div className="backdrop" onClick={closeAlert}></div>
            <div className="api-failed-section">
              <div className={errorFlags.incorrect ? "content-section incorrect-email" : "content-section"}>
                {errorFlags.serverError ? (
                  <>
                    <WarningTriangleIcon />
                    <div className="error-message-section">
                      <h3>{shareFlyoutContent.shareFailedLabel}</h3>
                      <p>{shareFlyoutContent.shareFailedDescription}</p>
                    </div>
                  </>
                ) : null}
                {errorFlags.incorrect ? (
                  <>
                    <ProhibitedIcon />
                    <div className="error-message-section">
                      <h3>{shareFlyoutContent.incorrectEmailLabel}</h3>
                      <p>{shareFlyoutContent.incorrectEmailDescription}</p>
                      {errorObj?.map((item) => {
                        if (
                          item.email &&
                          item.message.indexOf('Invalid') > -1
                        ) {
                          return (
                            <span className="email-pills">{item.email}</span>
                          );
                        }
                      })}
                    </div>
                  </>
                ) : null}
                {errorFlags.notFound ? (
                  <>
                    <WarningTriangleIcon />
                    <div className="error-message-section">
                      <h3>{shareFlyoutContent.recipientNotFoundLabel}</h3>
                      <p>{shareFlyoutContent.recipientNotFoundDescription}</p>
                      {accessErrObj?.map((item, i) => {
                        if (item.email && item.message.indexOf('access') > -1) {
                          return (
                            <ErrorModelEmailPill
                              key={item.email}
                              item={item}
                              accessErrObj={accessErrObj}
                              updateAccessErrObject={updateAccessErrObject}
                            />
                          );
                        }
                      })}
                    </div>
                  </>
                ) : null}
              </div>
              <div className="button-section">
                {errorFlags.serverError ? (
                  <>
                    <a className="cancel-btn" href={`#`} onClick={closeAlert}>
                      {shareFlyoutContent.shareFailedCancelLabel}
                    </a>
                    <a
                      className="try-again-btn"
                      href={`#`}
                      onClick={handleTryAgainBtn}
                    >
                      {shareFlyoutContent.shareFailedTryAgainLabel}
                    </a>
                  </>
                ) : null}
                {errorFlags.incorrect ? (
                  <>
                    <a
                      className="try-again-btn"
                      href={`#`}
                      onClick={closeAlert}
                    >
                      {shareFlyoutContent.incorrectEmailTryAgainLabel}
                    </a>
                  </>
                ) : null}
                {errorFlags.notFound ? (
                  <>
                    <a className="cancel-btn" href={`#`} onClick={closeAlert}>
                      {shareFlyoutContent.recipientNotFoundCancelLabel}
                    </a>
                    <a
                      className="try-again-btn"
                      href={`#`}
                      onClick={(e) => handleTryAgainBtn(e, true)}
                    >
                      {shareFlyoutContent.recipientNotFoundContinueLabel}
                    </a>
                  </>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </section>
    </BaseFlyout>
  );
}

export default ShareFlyout;
