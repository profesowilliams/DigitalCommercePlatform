import React from "react";
import { getDictionaryValue, getLocaleFormattedDate } from "../../../../../utils/utils";
import { If } from "../../../helpers/If";
import Info from "../../common/quotes/DisplayItemInfo";


function DurationDates({ startDate, endDate, label, noColon }) {
  return (
    <>
      <If condition={startDate}>
        <span>
          {label}{!noColon ? ":" : ""} {startDate} - {endDate}
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
          <Info label={agreementInfo.quoteNo}>{source?.id}</Info>
          <Info label={agreementInfo.vendorQuoteId}>{vendorReference?.value}</Info>
          <Info label={agreementInfo.agreementNoLabel}>{contract?.id}</Info>
        </p>
        <p>
          <Info label={agreementInfo.programLabel}>{programName}</Info>
          <Info label={agreementInfo.termLabel}>{contract?.renewedDuration}</Info>
          <Info label={agreementInfo.supportLevelLabel}>{quoteSupportLevel}</Info>
        </p>
        <p>
          <Info label={agreementInfo.quoteExpiryDateLabel}>{formattedExpiry}</Info>
          <Info label={agreementInfo.dueDateLabel}>{formattedDueDate}</Info>
          <Info label={agreementInfo.duration}>{agreementDuration}</Info>
          <DurationDates label={agreementInfo.usageDuration} endDate={contract?.formattedNewUsagePeriodEndDate} />
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
