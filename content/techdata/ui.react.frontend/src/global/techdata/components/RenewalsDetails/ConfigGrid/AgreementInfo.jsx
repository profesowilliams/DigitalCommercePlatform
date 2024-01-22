import React from "react";
import { getDictionaryValue, getLocaleFormattedDate } from "../../../../../utils/utils";
import { If } from "../../../helpers/If";
import Info from "../../common/quotes/DisplayItemInfo";


function DurationDates({ startDate, endDate, label, noColon, multipleOrderFlag }) {
  return (
    <>
      <If condition={startDate}>
        <span>
          {label}{!noColon ? ":" : ""} {multipleOrderFlag ? <i>{startDate}</i> : `${startDate} - ${endDate}`}
        </span>
      </If>
    </>
  );
}

function AgreementInfo({
  source,
  contract,
  agreementNumber,
  renewedDuration,
  programName,
  quoteSupportLevel,
  formattedDueDate,
  agreementDuration,
  agreementInfo,
  formattedExpiry,
  vendorReference,
  disableMultipleAgreement
}) {
  const AgreementInfo = () => {
    return (
    disableMultipleAgreement ?
      (
         <div className="cmp-renewals-qp__agreement-info--address-group">
          <p>
            <Info disableMultipleAgreement={disableMultipleAgreement} label={agreementInfo.quoteNo} multipleOrderFlag={source?.id?.indexOf('see line') > -1 ? true : false}>{source?.id}</Info>
            <Info disableMultipleAgreement={disableMultipleAgreement} label={agreementInfo.vendorQuoteId} multipleOrderFlag={vendorReference?.value.indexOf('see line') > -1 ? true : false}>{vendorReference?.value}</Info>
            <Info disableMultipleAgreement={disableMultipleAgreement} label={agreementInfo.agreementNoLabel} multipleOrderFlag={agreementNumber?.indexOf('see line') > -1 ? true : false}>{agreementNumber}</Info>
          </p>
          <p>
            <Info disableMultipleAgreement={disableMultipleAgreement} label={agreementInfo.programLabel} multipleOrderFlag={programName?.indexOf('see line') > -1 ? true : false}>{programName}</Info>
            <Info disableMultipleAgreement={disableMultipleAgreement} label={agreementInfo.termLabel} multipleOrderFlag={renewedDuration?.indexOf('see line') > -1 ? true : false}>{renewedDuration}</Info>
            <Info disableMultipleAgreement={disableMultipleAgreement} label={agreementInfo.supportLevelLabel} multipleOrderFlag={quoteSupportLevel?.indexOf('see line') > -1 ? true : false}>{quoteSupportLevel}</Info>
          </p>
          <p>
            <Info disableMultipleAgreement={disableMultipleAgreement} label={agreementInfo.quoteExpiryDateLabel} multipleOrderFlag={formattedExpiry?.indexOf('see line') > -1 ? true : false}>{formattedExpiry}</Info>
            <Info disableMultipleAgreement={disableMultipleAgreement} label={agreementInfo.dueDateLabel} multipleOrderFlag={formattedDueDate?.indexOf('see line') > -1 ? true : false}>{formattedDueDate}</Info>
            <Info disableMultipleAgreement={disableMultipleAgreement} label={agreementInfo.duration} multipleOrderFlag={agreementDuration?.indexOf('see line') > -1 ? true : false}>{agreementDuration}</Info>
            <DurationDates disableMultipleAgreement={disableMultipleAgreement} label={agreementInfo.usageDuration} endDate={contract?.formattedNewUsagePeriodEndDate}
            multipleOrderFlag={contract?.formattedNewUsagePeriodEndDate?.indexOf('see line') > -1 ? true : false}/>
          </p>
        </div>
      ) :
      (
      <div className="cmp-renewals-qp__agreement-info--address-group">
        <p>
          <Info label={getDictionaryValue("details.renewal.label.quoteNo", "Quote №")}>{source?.id}</Info>
          <Info label={getDictionaryValue("grids.renewal.label.vendorQuoteId","Vendor quote ID")}>{vendorReference?.value}</Info>
          <Info label={getDictionaryValue("details.renewal.label.agreementNo", "Agreement №")}>{contract?.id}</Info>
        </p>
        <p> <Info label={getDictionaryValue("details.renewal.label.quoteExpiryNo", "Quote expiry date")}>{formattedExpiry}</Info> </p>
        <p> <Info label={getDictionaryValue("details.renewal.label.quoteDueDate", "Quote due date")}>{formattedDueDate}</Info> </p>
        <p>
          <Info label={getDictionaryValue("details.renewal.label.program", "Program")}>{programName}</Info>
          <Info label={getDictionaryValue("details.renewal.label.duration", "Duration")}>{contract?.renewedDuration}</Info>
          <Info label={getDictionaryValue("details.renewal.label.supportLevel", "Support level")}>{contract?.serviceLevel}</Info>
        </p>
        <DurationDates disableMultipleAgreement={disableMultipleAgreement} label={getDictionaryValue("details.renewal.label.agreementDuration", "Agreement Duration")} startDate={contract?.formattedNewAgreementStartDate} endDate={contract?.formattedNewAgreementEndDate} />
        <DurationDates disableMultipleAgreement={disableMultipleAgreement} label={getDictionaryValue("details.renewal.label.usageDuration", "Usage Duration")} endDate={contract?.formattedNewUsagePeriodEndDate} />
      </div>
      )
    );
  };

  return (
    <div className="cmp-renewals-qp__agreement-info">
      <span className="cmp-renewals-qp__agreement-info--title">
        {
        disableMultipleAgreement ?  agreementInfo.agreementInfoLabel :
        getDictionaryValue("details.renewal.label.agreement", "Agreement")
        }
      </span>
      <AgreementInfo />
    </div>
  );
}

export default AgreementInfo;
