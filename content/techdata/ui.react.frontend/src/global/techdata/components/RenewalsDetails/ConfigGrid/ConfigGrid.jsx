import React, { useState, useEffect, useRef  } from "react";
import AgreementInfo from "./AgreementInfo";
import EndUserInfo from "./EndUser/EndUserInfo";
import ResellerInfo from "./Reseller/ResellerInfo";
import Link from "../../Widgets/Link";
import { generateFileFromPost as generateExcelFileFromPost } from "../../../../../utils/utils";
import { fileExtensions, generateFileFromPost, getDictionaryValue } from "../../../../../utils/utils";
import { CopyIcon, DownloadIcon, ShareIcon, InfoIcon, RevisionIcon, ChevronDownIcon } from "../../../../../fluentIcons/FluentIcons";
import { useRenewalGridState } from "../../RenewalsGrid/store/RenewalsStore";
import CopyFlyout from "../../CopyFlyout/CopyFlyout";
import ShareFlyout from "../../ShareFlyout/ShareFlyout";
import RequestFlyout from "../../RequestFlyout/RequestFlyout";
import Toaster from "../../Widgets/Toaster";
import { getRowAnalytics, ANALYTIC_CONSTANTS, pushDataLayer } from '../../Analytics/analytics';

function GridHeader({ gridProps, data }) {
  const [isPDFDownloadableOnDemand, setPDFDownloadableOnDemand] = useState(false);
  const effects = useRenewalGridState(state => state.effects);   
  const analyticsCategory = useRenewalGridState((state) => state.analyticsCategory);
  const isOpportunity = data.canRequestQuote;

  const downloadXLS = () => {
    try {
      pushDataLayer(
        getRowAnalytics(
          analyticsCategory,
          ANALYTIC_CONSTANTS.Detail.Actions.DownloadXlsDetail,
          data));
       let fileName = `Renewals quote ${data?.source?.id}`;
       const quoteText = gridProps.productLines.quoteTextForFileName || 'quote';
       const vendorName = data.vendor.name ? `${data.vendor.name} - ` : '';
       const endUser = data.endUser?.name?.text ? `${data.endUser.name.text} - ` : '';
       const renewedDuration = data.items[0]?.contract?.renewedDuration ? `${data.items[0].contract.renewedDuration} - ` : '';
       const sourceId = data.source.id ? `${data.source.id} - ` : '';
       if (data?.hasMultipleSupportLevel) {
         fileName = `${vendorName}${endUser}${sourceId}${renewedDuration}${quoteText}`;
       } else {
       const supportLevel = data.quoteSupportLevel ? `${data.quoteSupportLevel} - ` : '';
         fileName = `${vendorName}${endUser}${sourceId}${renewedDuration}${supportLevel}${quoteText}`;
       }
      generateExcelFileFromPost({
        url: gridProps?.excelFileUrl,
        name: `${fileName}.xlsx`,
        postData: {
          Id: data?.source?.id
        },
      });
    } catch (error) {
      console.error("error", error);
    }
  };

  const downloadPDF = () => {
    try {
      pushDataLayer(
        getRowAnalytics(
          analyticsCategory,
          ANALYTIC_CONSTANTS.Detail.Actions.DownloadPdfDetail,
          data));
      let pdfFileName = `Renewals Quote ${data?.source?.id}.pdf`;
      const quoteText = gridProps.productLines.quoteTextForFileName || 'quote';
      const vendorName = data.vendor.name ? `${data.vendor.name} - ` : '';
      const endUser = data.endUser?.name?.text ? `${data.endUser.name.text} - ` : '';
      const renewedDuration = data.items[0]?.contract?.renewedDuration ? `${data.items[0].contract.renewedDuration} - ` : '';
      const sourceId = data.source.id ? `${data.source.id} - ` : '';
      if (data?.hasMultipleSupportLevel) {
        pdfFileName = `${vendorName}${endUser}${sourceId}${renewedDuration}${quoteText}`;
      } else {
      const supportLevel = data.quoteSupportLevel ? `${data.quoteSupportLevel} - ` : '';
        pdfFileName = `${vendorName}${endUser}${sourceId}${renewedDuration}${supportLevel}${quoteText}`;
      }
      generateFileFromPost({
        url: gridProps.exportPDFRenewalsEndpoint,
        name: `${pdfFileName}.pdf`,
        postData: {
          Id: data?.source?.id
        },
        fileTypeExtension: fileExtensions.pdf
      })
    } catch (error) {
      console.error("error", error);
    }
  };

  const openCopyFlyOut = () => {
    const flyoutData = {
      ...data,
      agreementNumber: data?.items[0]?.contract?.id,
      analyticsAction: ANALYTIC_CONSTANTS.Detail.Actions.CopyDetail};
    effects.setCustomState({ key: 'copyFlyout', value: { data: flyoutData, show: true } });
  };

  const openShareFlyOut = () => {
    const flyoutData = {
      ...data,
      agreementNumber: data?.items[0]?.contract?.id};
    effects.setCustomState({ key: 'shareFlyout', value: { data: flyoutData, show: true } });
  };

  const openRequestFlyout = () => {
    const flyoutData = {
      ...data,
      agreementNumber: data?.items[0]?.contract?.id};
    effects.setCustomState({ key: 'shareFlyout', value: { data: flyoutData, show: true } });
  };

  function onCloseToaster() {
    effects.closeAndCleanToaster();    
  }

  <button onClick={() => setPDFDownloadableOnDemand(true)}>
    <span className="separator">{gridProps.pdf || "Export PDF"}</span>
  </button>

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
        <span className={(gridProps?.productLines?.showDownloadPDFButton || gridProps?.productLines?.showDownloadXLSButton) ? 'separator' : undefined}>
          Copy
        </span>
      </button>
    );
  }
  if (gridProps.enableShareOption && data?.canShareQuote) {
    buttons.push(
      <button onClick={openShareFlyOut} className='share-button' key="share">
        <ShareIcon className="cmp-renewal-preview__download--icon" />
        <span className={(gridProps?.productLines?.showDownloadPDFButton || gridProps?.productLines?.showDownloadXLSButton) ? 'separator' : undefined}>
          Share
        </span>
      </button>
    );
  }
  if (data?.canRequestRevision) {
    buttons.push(
      <button onClick={openRequestFlyout} key="revision">
        <RevisionIcon className="cmp-renewal-preview__download--icon" />
        <span className={(gridProps?.productLines?.showDownloadPDFButton || gridProps?.productLines?.showDownloadXLSButton) ? 'separator' : undefined}>
          Request revision
        </span>
      </button>
    );
  }
  
  if (gridProps?.productLines?.showDownloadXLSButton) {
    buttons.push(
      <button onClick={downloadXLS} key="downloadXLS">
        <DownloadIcon className="cmp-renewal-preview__download--icon" />
        <span className={gridProps?.productLines?.showDownloadPDFButton ? 'separator' : undefined}>
          {getDictionaryValue("button.common.label.downloadXLS", "Download XLS")}
        </span>
      </button>
    );
  }
  if (gridProps?.productLines?.showDownloadPDFButton) {
    buttons.push(
      <button onClick={downloadPDF} key="downloadPDF">
        <DownloadIcon className="cmp-renewal-preview__download--icon" />
        <span>
          {getDictionaryValue("button.common.label.downloadPDF", "Download PDF")}
        </span>
      </button>
    );
  }

  // Determine which buttons to show in the dropdown
const directlyShownButtons = buttons.length > 3 ? buttons.slice(0, 2) : buttons.slice(0, 3);
const dropdownButtons = buttons.length > 3 ? buttons.slice(2) : [];

  return (
    <div className={isOpportunity ? "cmp-product-lines-grid__header opportunity-quote-disabled" : "cmp-product-lines-grid__header"}>
      <span className="cmp-product-lines-grid__header__title">
        {gridProps.lineItemDetailsLabel}
      </span>
      <div className="cmp-renewal-preview__download">
        {directlyShownButtons}
        {dropdownButtons.length > 0 && (
          <>
            <button className="more-button" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <span>More <ChevronDownIcon className="cmp-renewal-preview__download--icon" /></span>
            </button>
            {showDropdown && (
              <div className="dropdown-content" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                {dropdownButtons}
              </div>
            )}
          </>
        )}
      </div>

      <Toaster
        onClose={onCloseToaster}
        store={useRenewalGridState} 
        message={{successSubmission:'successSubmission', failedSubmission:'failedSubmission'}}          
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
     <RequestFlyout
        store={useRenewalGridState}
        requestFlyoutContent={gridProps.requestQuote}
        subheaderReference={document.querySelector('.subheader > div > div')}
      />
    </div>
  );
}

function ConfigGrid({ data, gridProps, updateDetails }) {
  const { reseller, endUser, items, programName, formattedDueDate, endUserType, source, formattedExpiry, vendorLogo, EANumber, vendorReference, shipTo, agreementDuration, quoteSupportLevel, renewedDuration, agreementNumber } = data;
  const { quotePreview } = gridProps;
  const effects = useRenewalGridState(state => state.effects);
  Object.keys(quotePreview).forEach(key => {
    if (typeof quotePreview[key] === 'string') {
      quotePreview[key] = quotePreview[key].replace(/ No:/g,' \u2116:');
    } else if (typeof  quotePreview[key] === 'object') {
      Object.keys(quotePreview[key]).forEach(subkey => {
        if (typeof (quotePreview[key][subkey]) === 'string') {
          quotePreview[key][subkey] = quotePreview[key][subkey].replace(/ No:/g,' \u2116:');
        }
      });
    }
  });
  const openRequestFlyOut = () => {
      const flyoutData = {
        ...data,
        agreementNumber: data?.items[0]?.contract?.id};
      effects.setCustomState({ key: 'requestFlyout', value: { data: flyoutData, show: true } });
    };

  return (
    <div className="cmp-renewals-qp__config-grid">
      <div className="header-container">
        <div className="image-container">
          <Link
            variant="back-to-renewal"
            href={quotePreview.renewalsUrl || "#"}
            underline="none"
          >
            <i className="fas fa-chevron-left"></i>
            { getDictionaryValue("details.renewal.label.backTo", "Back to all Renewals") }
          </Link>
          <img className="vendorLogo" src={vendorLogo} alt="vendor logo" />
        </div>
        <div className="export-container">
          <span className="quote-preview">
            { getDictionaryValue("details.renewal.label.title", "Quote Preview") }
          </span>
          <GridHeader data={data} gridProps={gridProps} />
        </div>
        {
          gridProps.enableRequestQuote && data.canRequestQuote && (
            <div className='opportunity-quote'>
              <p><InfoIcon />{gridProps.quotePreview.quoteOpportunityText}</p>
              <button onClick={openRequestFlyOut}>{gridProps.quotePreview.quoteOpportunityRequestLabel}</button>
            </div>
          )
        }
      </div>
      <div className="info-container">
        <ResellerInfo
          {...quotePreview}
          resellerLabels={quotePreview.reseller}
          reseller={reseller}
          updateDetails={updateDetails}
          shipTo={shipTo}
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
          contract={items[0].contract}
          formattedExpiry={formattedExpiry}
          vendorReference={vendorReference?.length ? vendorReference[0] : null}
          disableMultipleAgreement={!quotePreview.agreementInfo.disableMultipleAgreement}
        />
      </div>
    </div>
  );
}

export default ConfigGrid;
