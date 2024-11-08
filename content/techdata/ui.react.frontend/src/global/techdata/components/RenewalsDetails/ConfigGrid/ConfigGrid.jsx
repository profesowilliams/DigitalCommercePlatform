import React, { useState, useEffect, useRef  } from "react";
import AgreementInfo from "./AgreementInfo";
import AutoRenewModal from './AutoRenewModal';
import EndUserInfo from "./EndUser/EndUserInfo";
import ResellerInfo from "./Reseller/ResellerInfo";
import Link from "../../Widgets/Link";
import Modal from '../../Modal/Modal';
import {
  generateFileFromPost as generateExcelFileFromPost,
  getDictionaryValueOrKey
} from '../../../../../utils/utils';
import {
  errorDetails,
  fileExtensions,
  generateFileFromPost,
  getDictionaryValue,
} from '../../../../../utils/utils';
import {
  CopyIcon,
  DownloadIcon,
  ShareIcon,
  InfoIcon,
  RevisionIcon,
  ChevronDownIcon,
  WarningTriangleIcon,
  ProhibitedIcon,
  BannerInfoIcon,
  SeparatorIcon,
  DismissFilledSmallIcon,
  ArchiveDetailsIcon,
} from '../../../../../fluentIcons/FluentIcons';
import { useRenewalGridState } from '../../RenewalsGrid/store/RenewalsStore';
import CopyFlyout from '../../CopyFlyout/CopyFlyout';
import ShareFlyout from '../../ShareFlyout/ShareFlyout';
import RevisionFlyout from '../../RevisionFlyout/RevisionFlyout';
import RequestFlyout from '../../RequestFlyout/RequestFlyout';
import ErrorFlyout from '../../ErrorFlyout/ErrorFlyout';
import Toaster from '../../Widgets/Toaster';
import {
  getRowAnalytics,
  ANALYTIC_CONSTANTS,
  pushDataLayer,
} from '../../Analytics/analytics';
import CustomSwitchToggle from '../../Widgets/CustomSwitchToggle';
import CustomTooltip from '../../Widgets/CustomTooltip';

function GridHeader({ gridProps, data, changeRefreshDetailApiState }) {
  const [isPDFDownloadableOnDemand, setPDFDownloadableOnDemand] =
    useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [autoRenewToggle, setAutoRenewToggle] = useState(data?.autoRenew);

  const [modal, setModal] = useState(null);
  const [enableAutoRenewError, setEnableAutoRenewError] = useState(false);
  const [disableAutoRenewError, setDisableAutoRenewError] = useState(false);

  const effects = useRenewalGridState((state) => state.effects);
  const analyticsCategory = useRenewalGridState(
    (state) => state.analyticsCategory
  );
  const isOpportunity = data.canRequestQuote;

  const downloadXLS = () => {
    try {
      pushDataLayer(
        getRowAnalytics(
          analyticsCategory,
          ANALYTIC_CONSTANTS.Detail.Actions.DownloadXlsDetail,
          data
        )
      );
      let fileName = `Renewals quote ${data?.source?.id}`;
      const quoteText = gridProps.productLines.quoteTextForFileName || 'quote';
      const vendorName = data.vendor.name ? `${data.vendor.name} - ` : '';
      const endUser = data.endUser?.name?.text
        ? `${data.endUser.name.text} - `
        : '';
      const renewedDuration = data.items[0]?.contract?.renewedDuration
        ? `${data.items[0].contract.renewedDuration} - `
        : '';
      const sourceId = data.source.id ? `${data.source.id} - ` : '';
      if (data?.hasMultipleSupportLevel) {
        fileName = `${vendorName}${endUser}${sourceId}${renewedDuration}${quoteText}`;
      } else {
        const supportLevel = data.quoteSupportLevel
          ? `${data.quoteSupportLevel} - `
          : '';
        fileName = `${vendorName}${endUser}${sourceId}${renewedDuration}${supportLevel}${quoteText}`;
      }
      generateExcelFileFromPost({
        url: gridProps?.excelFileUrl,
        name: `${fileName}.xlsx`,
        postData: {
          Id: data?.source?.id,
        },
      });
    } catch (error) {
      console.error('error', error);
    }
  };

  const downloadPDF = () => {
    try {
      pushDataLayer(
        getRowAnalytics(
          analyticsCategory,
          ANALYTIC_CONSTANTS.Detail.Actions.DownloadPdfDetail,
          data
        )
      );
      let pdfFileName = `Renewals Quote ${data?.source?.id}.pdf`;
      const quoteText = gridProps.productLines.quoteTextForFileName || 'quote';
      const vendorName = data.vendor.name ? `${data.vendor.name} - ` : '';
      const endUser = data.endUser?.name?.text
        ? `${data.endUser.name.text} - `
        : '';
      const renewedDuration = data.items[0]?.contract?.renewedDuration
        ? `${data.items[0].contract.renewedDuration} - `
        : '';
      const sourceId = data.source.id ? `${data.source.id} - ` : '';
      if (data?.hasMultipleSupportLevel) {
        pdfFileName = `${vendorName}${endUser}${sourceId}${renewedDuration}${quoteText}`;
      } else {
        const supportLevel = data.quoteSupportLevel
          ? `${data.quoteSupportLevel} - `
          : '';
        pdfFileName = `${vendorName}${endUser}${sourceId}${renewedDuration}${supportLevel}${quoteText}`;
      }
      generateFileFromPost({
        url: gridProps.exportPDFRenewalsEndpoint,
        name: `${pdfFileName}.pdf`,
        postData: {
          Id: data?.source?.id,
        },
        fileTypeExtension: fileExtensions.pdf,
      });
    } catch (error) {
      console.error('error', error);
    }
  };

  const openCopyFlyOut = () => {
    const flyoutData = {
      ...data,
      agreementNumber: data?.items[0]?.contract?.id,
      analyticsAction: ANALYTIC_CONSTANTS.Detail.Actions.CopyDetail,
    };
    effects.setCustomState({
      key: 'copyFlyout',
      value: { data: flyoutData, show: true },
    });
  };

  const openShareFlyOut = () => {
    const flyoutData = {
      ...data,
      agreementNumber: data?.items[0]?.contract?.id,
    };
    effects.setCustomState({
      key: 'shareFlyout',
      value: { data: flyoutData, show: true },
    });
  };

  const openRevisionFlyout = () => {
    const flyoutData = {
      ...data,
      agreementNumber: data?.items[0]?.contract?.id,
    };
    effects.setCustomState({
      key: 'revisionFlyout',
      value: { data: flyoutData, show: true },
    });
  };

  const openRequestFlyOut = () => {
    const flyoutData = {
      ...data,
      agreementNumber: data?.items[0]?.contract?.id,
    };
    effects.setCustomState({
      key: 'requestFlyout',
      value: { data: flyoutData, show: true },
    });
  };

  function onCloseToaster() {
    effects.closeAndCleanToaster();
  }

  <button onClick={() => setPDFDownloadableOnDemand(true)}>
    <span className="separator">{gridProps.pdf || 'Export PDF'}</span>
  </button>;

  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current); // Clears any pending timeout to hide the dropdown
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 500); // Hides the dropdown after 2 seconds
  };

  // Prepare buttons and handle which ones to show directly and which to hide in dropdown
  const buttons = [];
  if (data?.canCopy) {
    buttons.push(
      <button onClick={openCopyFlyOut} key="copy">
        <CopyIcon className="cmp-renewal-preview__download--icon" />
        <span
          className={
            gridProps?.productLines?.showDownloadPDFButton ||
            gridProps?.productLines?.showDownloadXLSButton
              ? 'separator'
              : undefined
          }
        >
          Copy
        </span>
      </button>
    );
  }

  if (gridProps.enableShareOption && data?.canShareQuote) {
    buttons.push(
      <button onClick={openShareFlyOut} className="share-button" key="share">
        <ShareIcon className="cmp-renewal-preview__download--icon" />
        <span
          className={
            gridProps?.productLines?.showDownloadPDFButton ||
            gridProps?.productLines?.showDownloadXLSButton
              ? 'separator'
              : undefined
          }
        >
          Share
        </span>
      </button>
    );
  }

  if (gridProps.enableReviseOption && data?.canRequestRevision) {
    buttons.push(
      <button onClick={openRevisionFlyout} key="revision">
        <RevisionIcon className="cmp-renewal-preview__download--icon" />
        <span
          className={
            gridProps?.productLines?.showDownloadPDFButton ||
            gridProps?.productLines?.showDownloadXLSButton
              ? 'separator'
              : undefined
          }
        >
          Request revision
        </span>
      </button>
    );
  }

  if (gridProps?.productLines?.showDownloadPDFButton) {
    buttons.push(
      <button onClick={downloadPDF} key="downloadPDF">
        <DownloadIcon className="cmp-renewal-preview__download--icon" />
        <span>
          {getDictionaryValue(
            'button.common.label.downloadPDF',
            'Download PDF'
          )}
        </span>
      </button>
    );
  }

  if (gridProps?.productLines?.showDownloadXLSButton) {
    buttons.push(
      <button onClick={downloadXLS} key="downloadXLS">
        <DownloadIcon className="cmp-renewal-preview__download--icon" />
        <span
          className={
            gridProps?.productLines?.showDownloadPDFButton
              ? 'separator'
              : undefined
          }
        >
          {getDictionaryValue(
            'button.common.label.downloadXLS',
            'Download XLS'
          )}
        </span>
      </button>
    );
  }
  if (gridProps?.enableArchiveQuote) {
    buttons.push(
      <button onClick={console.log('archive')} key="archive">
        <ArchiveDetailsIcon className="cmp-renewal-preview__download--icon" />
        <span
          className={gridProps?.enableArchiveQuote ? 'separator' : undefined}
        >
          {getDictionaryValueOrKey(gridProps?.archiveLabels?.archive)}
        </span>
      </button>
    );
  }

  // Determine which buttons to show in the dropdown
  const directlyShownButtons =
    buttons.length > 3 ? buttons.slice(0, 2) : buttons.slice(0, 3);
  const dropdownButtons = buttons.length > 3 ? buttons.slice(2) : [];

  const tooltipText = (
    <div className="auto-renew-tooltip">
      <p className="auto-renew-tooltip__title">
        {getDictionaryValueOrKey(gridProps?.productLines?.permissionRequired)}
      </p>
      <p className="auto-renew-tooltip__text">
        {getDictionaryValueOrKey(gridProps?.productLines?.youDoNotHave)}
      </p>
    </div>
  );

  const tryAutoRenewToggle = (flag) => {
    setAutoRenewToggle(flag);
    setEnableAutoRenewError(false);
    setDisableAutoRenewError(false);
  };

  const renewModalClose = (isDefault) => {
    if (typeof isDefault === 'boolean') {
      setAutoRenewToggle(
        typeof isDefault === 'boolean' ? isDefault : data?.autoRenew
      );
    }
    setModal(null);
  };

  const handleAutoRenewChange = (isToggled) => {
    setModal({
      content: (
        <AutoRenewModal
          data={data}
          gridProps={gridProps}
          isToggled={isToggled}
          setEnableAutoRenewError={setEnableAutoRenewError}
          setDisableAutoRenewError={setDisableAutoRenewError}
          renewModalClose={renewModalClose}
          changeRefreshDetailApiState={changeRefreshDetailApiState}
        ></AutoRenewModal>
      ),
      properties: {
        title: isToggled
          ? gridProps?.productLines?.turnOnAutoRenewTitle
          : gridProps?.productLines?.turnOFFAutoRenewTitle,
      },
    });
  };

  useEffect(() => {
    setAutoRenewToggle(data?.autoRenew);
  }, [data?.autoRenew]);
  return (
    <div
      className={
        isOpportunity
          ? 'cmp-product-lines-grid__header opportunity-quote-disabled'
          : 'cmp-product-lines-grid__header'
      }
    >
      <span className="cmp-product-lines-grid__header__title">
        {gridProps.lineItemDetailsLabel}
      </span>
      {data?.displayAutoRenew && (
        <CustomTooltip
          title={tooltipText}
          placement="bottom"
          arrow
          disableInteractive={true}
          open={!data?.isAutoRenewEnabled && data?.showToolTip && isTooltipOpen}
          onClose={() => setIsTooltipOpen(false)}
        >
          <div
            className="auto-renew"
            onMouseEnter={() => setIsTooltipOpen(true)}
            onMouseLeave={() => setIsTooltipOpen(false)}
          >
            <CustomSwitchToggle
              toggled={autoRenewToggle}
              disabled={!data?.isAutoRenewEnabled}
              onToggleChanged={handleAutoRenewChange}
            />
            <span className="auto-renew__text">
              {getDictionaryValueOrKey(gridProps?.productLines?.autoRenew)}
            </span>
            <span className="auto-renew__separator">
              <SeparatorIcon />
            </span>
          </div>
        </CustomTooltip>
      )}
      <div className="cmp-renewal-preview__download">
        {directlyShownButtons}
        {dropdownButtons.length > 0 && (
          <>
            <button
              className="more-button"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <span>
                More{' '}
                <ChevronDownIcon className="cmp-renewal-preview__download--icon" />
              </span>
            </button>
            {showDropdown && (
              <div
                className="dropdown-content"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {dropdownButtons}
              </div>
            )}
          </>
        )}
      </div>

      <Toaster
        onClose={onCloseToaster}
        store={useRenewalGridState}
        message={{
          successSubmission: 'successSubmission',
          failedSubmission: 'failedSubmission',
        }}
      />
      <CopyFlyout
        store={useRenewalGridState}
        copyFlyout={gridProps.copyFlyout}
        subheaderReference={document.querySelector('.subheader > div > div')}
      />
      <ShareFlyout
        store={useRenewalGridState}
        shareFlyoutContent={gridProps.shareFlyout}
        reseller={data.reseller}
        subheaderReference={document.querySelector('.subheader > div > div')}
      />
      <RevisionFlyout
        store={useRenewalGridState}
        revisionFlyoutContent={gridProps.revisionFlyout}
        reseller={data.reseller}
        subheaderReference={document.querySelector('.subheader > div > div')}
      />
      <RequestFlyout
        store={useRenewalGridState}
        requestFlyoutContent={gridProps.requestQuote}
        subheaderReference={document.querySelector('.subheader > div > div')}
      />
      <ErrorFlyout
        store={useRenewalGridState}
        subheaderReference={document.querySelector('.subheader > div > div')}
      />
      {modal && (
        <Modal
          modalAction={modal.action}
          modalContent={modal.content}
          modalProperties={modal.properties}
          actionErrorMessage={modal.errorMessage}
          customClass="cmp-auto-renew-modal"
        ></Modal>
      )}
      {enableAutoRenewError && (
        <AutoRenewError
          errorMessage={gridProps?.productLines?.errorAutoRenewEnabled}
          tryAgainHandler={tryAutoRenewToggle}
          closeHandler={setEnableAutoRenewError}
        />
      )}
      {disableAutoRenewError && (
        <AutoRenewError
          errorMessage={gridProps?.productLines?.errorAutoRenewNotEnabled}
          tryAgainHandler={tryAutoRenewToggle}
          closeHandler={setDisableAutoRenewError}
        />
      )}
    </div>
  );
}

function AutoRenewError({ errorMessage, tryAgainHandler, closeHandler }) {
  return (
    <div className="details-auto-renew-banner">
      <ProhibitedIcon />
      <p>{getDictionaryValueOrKey(errorMessage)}</p>
      <div className="close-icon" onClick={() => closeHandler(false)}>
        <DismissFilledSmallIcon />
      </div>
    </div>
  );
}

function ConfigGrid({
  data,
  gridProps,
  updateDetails,
  changeRefreshDetailApiState,
}) {
  const {
    reseller,
    endUser,
    items,
    previousResellerPO,
    programName,
    formattedDueDate,
    endUserType,
    source,
    formattedExpiry,
    vendorLogo,
    EANumber,
    vendorReference,
    shipTo,
    agreementDuration,
    quoteSupportLevel,
    renewedDuration,
    agreementNumber,
  } = data;
  const { quotePreview } = gridProps;
  const effects = useRenewalGridState((state) => state.effects);
  Object.keys(quotePreview).forEach((key) => {
    if (typeof quotePreview[key] === 'string') {
      quotePreview[key] = quotePreview[key].replace(/ No:/g, ' \u2116:');
    } else if (typeof quotePreview[key] === 'object') {
      Object.keys(quotePreview[key]).forEach((subkey) => {
        if (typeof quotePreview[key][subkey] === 'string') {
          quotePreview[key][subkey] = quotePreview[key][subkey].replace(
            / No:/g,
            ' \u2116:'
          );
        }
      });
    }
  });

  const openRequestFlyOut = () => {
    const flyoutData = {
      ...data,
      agreementNumber: data?.items[0]?.contract?.id,
    };
    effects.setCustomState({
      key: 'requestFlyout',
      value: { data: flyoutData, show: true },
    });
  };

  return (
    <div className="cmp-renewals-qp__config-grid details-upper-wrapper">
      <div className="header-container">
        <div className="image-container">
          <Link
            variant="back-to-renewal"
            href={quotePreview.renewalsUrl || '#'}
            underline="none"
          >
            <i className="fas fa-chevron-left"></i>
            {getDictionaryValue(
              'details.renewal.label.backTo',
              'Back to all Renewals'
            )}
          </Link>
          <img className="vendorLogo" src={vendorLogo} alt="vendor logo" />
        </div>
        <div className="export-container">
          <span className="quote-preview">
            {getDictionaryValue('details.renewal.label.title', 'Quote Preview')}
          </span>
          <GridHeader
            data={data}
            gridProps={gridProps}
            changeRefreshDetailApiState={changeRefreshDetailApiState}
          />
        </div>
        {gridProps.enableRequestQuote && data.canRequestQuote && (
          <div className="opportunity-quote">
            <p>
              <InfoIcon />
              {gridProps.quotePreview.quoteOpportunityText}
            </p>
            <button onClick={openRequestFlyOut}>
              {gridProps.quotePreview.quoteOpportunityRequestLabel}
            </button>
          </div>
        )}
        {data.feedBackMessages &&
          data.feedBackMessages.map((message, index) => {
            const errorCriticality = message?.errorCriticality;
            const errorMessage = message?.message;
            const blueBanner = errorCriticality === 3;
            const orangeBanner = errorCriticality === 2;
            const redBanner = errorCriticality === 1;
            const noBanner = errorCriticality === 4 || !errorMessage;

            const openErrorFlyOut = async (e) => {
              e.preventDefault();

              const response = await errorDetails(
                `${gridProps.uiServiceDomain}/${message?.jsonUrl}`,
                message
              );

              const flyoutData = {
                details: response?.details,
              };
              effects.setCustomState({
                key: 'errorFlyout',
                value: { data: flyoutData, show: true },
              });
            };
            return (
              !noBanner && (
                <div
                  key={index}
                  className={
                    blueBanner
                      ? 'renewal-feedback-banner blue-banner'
                      : orangeBanner
                      ? 'renewal-feedback-banner orange-banner'
                      : redBanner
                      ? 'renewal-feedback-banner red-banner'
                      : 'renewal-feedback-banner'
                  }
                >
                  <p>
                    {blueBanner ? (
                      <BannerInfoIcon />
                    ) : orangeBanner ? (
                      <WarningTriangleIcon />
                    ) : redBanner ? (
                      <ProhibitedIcon />
                    ) : (
                      ''
                    )}
                    {errorMessage}
                  </p>
                  {redBanner && message?.jsonUrlMessage && (
                    <a href="#error" target="_blank" onClick={openErrorFlyOut}>
                      {message.jsonUrlMessage}
                    </a>
                  )}
                </div>
              )
            );
          })}
      </div>
      <div className="info-container">
        <ResellerInfo
          {...quotePreview}
          resellerLabels={quotePreview.reseller}
          reseller={reseller}
          updateDetails={updateDetails}
          shipTo={shipTo}
          previousResellerPO={previousResellerPO}
        />
        <EndUserInfo
          productLines={quotePreview.productLines}
          endUserType={endUserType}
          endUser={{
            ...endUser,
            vendorAccountNumber: EANumber,
            previousEndUserPO: data?.previousEndUserPO,
          }}
          updateDetails={updateDetails}
        />
        <AgreementInfo
          agreementDuration={agreementDuration}
          agreementNumber={agreementNumber}
          renewedDuration={renewedDuration}
          source={source}
          quoteSupportLevel={quoteSupportLevel}
          programName={programName}
          formattedDueDate={formattedDueDate}
          agreementInfo={quotePreview.agreementInfo}
          contract={items[0]?.contract}
          formattedExpiry={formattedExpiry}
          vendorReference={vendorReference?.length ? vendorReference[0] : null}
          disableMultipleAgreement={
            !quotePreview.agreementInfo.disableMultipleAgreement
          }
        />
      </div>
    </div>
  );
}

export default ConfigGrid;
