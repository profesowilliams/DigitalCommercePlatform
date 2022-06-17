import React, { useEffect, useState } from "react";
import { dateToString } from "../../../helpers/formatting";
import Info from "../../common/quotes/DisplayItemInfo";

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
    const formatDate = rawDate => dateToString(rawDate.replace(/[zZ]/g,''),"MM/dd/uu");
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
            <Info noColon label={agreementInfo.quotedueDateLabel}>{formatDate(dueDate)}</Info>
          )}
          <Info noColon label={agreementInfo.quoteExpiryDateLabel}>{formatDate(expiry)}</Info> 
        </p>
        <p>  
          {contract.newAgreementStartDate && (
            <Info noColon label={agreementInfo.agreeStartDateLabel}>
              {formatDate(contract.newAgreementStartDate)}
            </Info>
          )}
          {contract.newAgreementEndDate && (
            <Info noColon label={agreementInfo.agreeEndDateLabel}>
              {formatDate(contract.newAgreementEndDate)}
            </Info>
          )}
          
          {contract.newUsagePeriodStartDate && (
            <Info noColon label={agreementInfo.usageStartDateLabel}>
              {formatDate(contract.newUsagePeriodStartDate)}
            </Info>
          )}
          {contract.newUsagePeriodEndDate && (
            <Info noColon label={agreementInfo.usageEndDateLabel}>
              {formatDate(contract.newUsagePeriodEndDate)}
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
