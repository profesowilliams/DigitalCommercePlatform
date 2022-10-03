import React from "react";
import { getLocaleFormattedDate } from "../../../../../utils/utils";
import { If } from "../../../helpers/If";
import Info from "../../common/quotes/DisplayItemInfo";


function DurationDates({ startDate, endDate, label }) {
  const checkNullEndDate = (date) => {
    if (!date) return '';
    return `- ${getLocaleFormattedDate(date)}`;
  };
  return (
    <p>
      <If condition={startDate}>
        <span>
          {label} {getLocaleFormattedDate(startDate)} {checkNullEndDate(endDate)}
        </span>
      </If>
    </p>
  );
}

function AgreementInfo({
  source,
  contract,
  programName,
  dueDate,
  agreementInfo,
  expiry,
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
        <p> <Info noColon label={agreementInfo?.quoteExpiryDateLabel}>{getLocaleFormattedDate(expiry)}</Info> </p>
        <p> <Info noColon label={agreementInfo?.quotedueDateLabel}>{getLocaleFormattedDate(dueDate)}</Info> </p>
        <p>
          <Info noColon label={agreementInfo?.programLabel}>{programName}</Info>
          <Info noColon label={agreementInfo?.durationLabel}>{contract?.renewedDuration}</Info>      
          <Info noColon label={agreementInfo?.supportLevelLabel}>{contract?.serviceLevel}</Info> 
        </p>
        <DurationDates label={agreementInfo.agreementDuration} startDate={contract?.newAgreementStartDate} endDate={contract?.newAgreementEndDate} />
        <DurationDates label={agreementInfo.usageDuration} startDate={contract?.newUsagePeriodStartDate} endDate={contract?.newUsagePeriodEndDate} />
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
