import React, { useEffect, useState } from "react";
import Info from "../../common/quotes/DisplayItemInfo";

function AgreementInfo({
  source,
  contract,
  programName,
  dueDate,
  agreementInfo,
}) {
  const AgreementInfo = () => {
    return (
      <div className="cmp-renewals-qp__agreement-info--address-group">
        <p>
          {programName && (
            <Info label={agreementInfo.programLabel}>{programName}</Info>
          )}
          {contract.duration && (
            <Info label={agreementInfo.durationLabel}>{contract.duration}</Info>
          )}
          {contract.serviceLevel && (
            <Info label={agreementInfo.supportLevelLabel}>
              {contract.serviceLevel}
            </Info>
          )}
          <Info label={agreementInfo.distiQuoteNoLabel}>1234567GJDFH</Info>
          {contract.id && (
            <Info label={agreementInfo.agreementNoLabel}>{contract.id}</Info>
          )}
          {source.id && (
            <Info label={agreementInfo.distiQuoteLabel}>{source.id}</Info>
          )}
          {dueDate && (
            <Info label={agreementInfo.quotedueDateLabel}>{dueDate}</Info>
          )}
          <Info label="Quote expiry date">20/06/2021</Info>
          {contract.newAgreementStartDate && (
            <Info label={agreementInfo.agreeStartDateLabel}>
              {contract.newAgreementStartDate}
            </Info>
          )}
          {contract.newAgreementEndDate && (
            <Info label={agreementInfo.agreeEndDateLabel}>
              {contract.newAgreementEndDate}
            </Info>
          )}
          {contract.newUsagePeriodStartDate && (
            <Info label={agreementInfo.usageStartDateLabel}>
              {contract.newUsagePeriodStartDate}
            </Info>
          )}
          {contract.newUsagePeriodEndDate && (
            <Info label={agreementInfo.usageEndDateLabel}>
              {contract.newUsagePeriodEndDate}
            </Info>
          )}
        </p>
      </div>
    );
  };

  return (
    <div className="cmp-renewals-qp__agreement-info">
      <p className="cmp-renewals-qp__agreement-info--sub-title">
        {agreementInfo.agreementInfoLabel}
      </p>
      <AgreementInfo />
    </div>
  );
}

export default AgreementInfo;
