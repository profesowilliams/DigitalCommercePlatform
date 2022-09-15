import React, { useEffect, useState } from "react";
import Info from "../../common/quotes/DisplayItemInfo";
import { getLocaleFormattedDate } from "../../../../../utils/utils";

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
          {programName && (
            <Info noColon label={agreementInfo.programLabel}>{programName}</Info>
          )}
          {contract.renewedDuration && (
            <Info noColon label={agreementInfo.durationLabel}>{contract.renewedDuration}</Info>
          )}
          {contract.serviceLevel && (
            <Info noColon label={agreementInfo.supportLevelLabel}>
              {contract.serviceLevel}
            </Info>
          )}
          <Info noColon label={agreementInfo.distiQuoteNoLabel}>{source.id}</Info>
          {contract.id && (
            <Info noColon label={agreementInfo.agreementNoLabel}>{contract.id}</Info>
          )}
          {source.id && (
            <Info noColon label={agreementInfo.distiQuoteLabel}>{customerPO}</Info>
          )} 
        </p>
        <p>
          {dueDate && (
            <Info noColon label={agreementInfo.quotedueDateLabel}>{getLocaleFormattedDate(dueDate)}</Info>
          )}
          <Info noColon label={agreementInfo.quoteExpiryDateLabel}>{getLocaleFormattedDate(expiry)}</Info> 
        </p>
        <p>  
          {contract.newAgreementStartDate && (
            <Info noColon label={agreementInfo.agreeStartDateLabel}>
              {getLocaleFormattedDate(contract.newAgreementStartDate)}
            </Info>
          )}
          {contract.newAgreementEndDate && (
            <Info noColon label={agreementInfo.agreeEndDateLabel}>
              {getLocaleFormattedDate(contract.newAgreementEndDate)}
            </Info>
          )}
          
          {contract.newUsagePeriodStartDate && (
            <Info noColon label={agreementInfo.usageStartDateLabel}>
              {getLocaleFormattedDate(contract.newUsagePeriodStartDate)}
            </Info>
          )}
          {contract.newUsagePeriodEndDate && (
            <Info noColon label={agreementInfo.usageEndDateLabel}>
              {getLocaleFormattedDate(contract.newUsagePeriodEndDate)}
            </Info>
          )}
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
