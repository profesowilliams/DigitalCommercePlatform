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
  programName,
  quoteSupportLevel,
  formattedDueDate,
  agreementDuration,
  agreementInfo,
  formattedExpiry,
  vendorReference
}) {
  const AgreementInfo = () => {
    return (
      <div className="cmp-renewals-qp__agreement-info--address-group">
        <p>
          <Info label={agreementInfo.quoteNo} multipleOrderFlag={source?.id.indexOf('see line') > -1 ? true : false}>{source?.id}</Info>
          <Info label={agreementInfo.vendorQuoteId} multipleOrderFlag={vendorReference?.value.indexOf('see line') > -1 ? true : false}>{vendorReference?.value}</Info>
          <Info label={agreementInfo.agreementNoLabel} multipleOrderFlag={contract?.id.indexOf('see line') > -1 ? true : false}>{contract?.id}</Info>
        </p>
        <p>
          <Info label={agreementInfo.programLabel} multipleOrderFlag={programName.indexOf('see line') > -1 ? true : false}>{programName}</Info>
          <Info label={agreementInfo.termLabel} multipleOrderFlag={contract?.renewedDuration.indexOf('see line') > -1 ? true : false}>{contract?.renewedDuration}</Info>
          <Info label={agreementInfo.supportLevelLabel} multipleOrderFlag={contract?.serviceLevel.indexOf('see line') > -1 ? true : false}>{contract?.serviceLevel}</Info>
        </p>
        <p>
          <Info label={agreementInfo.quoteExpiryDateLabel} multipleOrderFlag={formattedExpiry.indexOf('see line') > -1 ? true : false}>{formattedExpiry}</Info>
          <Info label={agreementInfo.dueDateLabel} multipleOrderFlag={formattedDueDate.indexOf('see line') > -1 ? true : false}>{formattedDueDate}</Info>
          <DurationDates label={agreementInfo.duration} startDate={contract?.formattedNewAgreementStartDate}
          endDate={contract?.formattedNewAgreementEndDate}
          multipleOrderFlag={contract?.formattedNewAgreementStartDate?.indexOf('see line') > -1 ? true : false}/>
          <DurationDates label={agreementInfo.usageDuration} endDate={contract?.formattedNewUsagePeriodEndDate}
          multipleOrderFlag={contract?.formattedNewUsagePeriodEndDate?.indexOf('see line') > -1 ? true : false}/>
        </p>
      </div>
    );
  };

  return (
    <div className="cmp-renewals-qp__agreement-info">
      <span className="cmp-renewals-qp__agreement-info--title">
        {agreementInfo.agreementInfoLabel}
      </span>
      <AgreementInfo />
    </div>
  );
}

export default AgreementInfo;
