import React from "react";
import { If } from "../../../helpers/If";
import Info from "../../common/quotes/DisplayItemInfo";

function DurationDates({ startDate, endDate, label }) {
  return (
    <p>
      <If condition={startDate}>
        <span>
          {label} {startDate} - {endDate}
        </span>
      </If>
    </p>
  );
}

function AgreementInfo({
  source,
  contract,
  programName,
  formattedDueDate,
  agreementInfo,
  formattedExpiry,
  customerPO
}) {
  const AgreementInfo = () => {
    return (
      <div className="cmp-renewals-qp__agreement-info--address-group">
        <p>
          <Info noColon label={agreementInfo?.quoteNo}>{source?.id}</Info>
          <Info noColon label={agreementInfo?.vendorQuoteId}>{customerPO}</Info>
          <Info noColon label={agreementInfo?.agreementNoLabel}>{contract?.id}</Info>
        </p>        
        <p> <Info noColon label={agreementInfo?.quoteExpiryDateLabel}>{formattedExpiry}</Info> </p>
        <p> <Info noColon label={agreementInfo?.quotedueDateLabel}>{formattedDueDate}</Info> </p>
        <p>
          <Info noColon label={agreementInfo?.programLabel}>{programName}</Info>
          <Info noColon label={agreementInfo?.durationLabel}>{contract?.renewedDuration}</Info>      
          <Info noColon label={agreementInfo?.supportLevelLabel}>{contract?.serviceLevel}</Info> 
        </p>
        <DurationDates label={agreementInfo.agreementDuration} startDate={contract?.formattedNewAgreementStartDate} endDate={contract?.formattedNewAgreementEndDate} />
        <DurationDates label={agreementInfo.usageDuration} startDate={contract?.formattedNewUsagePeriodStartDate} endDate={contract?.formattedNewUsagePeriodEndDate} />
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
