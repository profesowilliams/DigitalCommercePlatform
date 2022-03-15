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
            <Info boldLabel noColon label={agreementInfo.programLabel}>{programName}</Info>
          )}
          {contract.duration && (
            <Info boldLabel noColon label={agreementInfo.durationLabel}>{contract.renewedDuration}</Info>
          )}
          {contract.serviceLevel && (
            <Info boldLabel noColon label={agreementInfo.supportLevelLabel}>
              {contract.serviceLevel}
            </Info>
          )}
          <Info boldLabel noColon label={agreementInfo.distiQuoteNoLabel}>{source.id}</Info>
          {contract.id && (
            <Info boldLabel noColon label={agreementInfo.agreementNoLabel}>{contract.id}</Info>
          )}
          {source.id && (
            <Info boldLabel noColon label={agreementInfo.distiQuoteLabel}>{customerPO}</Info>
          )} <br/>
          {dueDate && (
            <Info boldLabel noColon label={agreementInfo.quotedueDateLabel}>{formatDate(dueDate)}</Info>
          )}
          <Info boldLabel noColon label={agreementInfo.quoteExpiryDateLabel}>{formatDate(expiry)}</Info> <br />
          {contract.newAgreementStartDate && (
            <Info boldLabel noColon label={agreementInfo.agreeStartDateLabel}>
              {formatDate(contract.newAgreementStartDate)}
            </Info>
          )}
          {contract.newAgreementEndDate && (
            <Info boldLabel noColon label={agreementInfo.agreeEndDateLabel}>
              {formatDate(contract.newAgreementEndDate)}
            </Info>
          )}
          {contract.newUsagePeriodStartDate && (
            <Info boldLabel noColon label={agreementInfo.usageStartDateLabel}>
              {formatDate(contract.newUsagePeriodStartDate)}
            </Info>
          )}
          {contract.newUsagePeriodEndDate && (
            <Info boldLabel noColon label={agreementInfo.usageEndDateLabel}>
              {formatDate(contract.newUsagePeriodEndDate)}
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
