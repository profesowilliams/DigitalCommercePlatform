import React from "react";
import { getDictionaryValue, getLocaleFormattedDate } from "../../../../../utils/utils";
import { If } from "../../../helpers/If";
import Info from "../../common/quotes/DisplayItemInfo";


function DurationDates({ startDate, endDate, label, noColon }) {
  return (
    <p>
      <If condition={startDate}>
        <span>
          {label}{!noColon ? ":" : ""} {startDate} - {endDate}
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
  vendorReference
}) {
  const AgreementInfo = () => {
    return (
      <div className="cmp-renewals-qp__agreement-info--address-group">
        <p>
          <Info label={getDictionaryValue("techdata.renewals.label.quoteNumber", "Quote №")}>{source?.id}</Info>
          <Info label={getDictionaryValue("techdata.renewals.label.vendorQuoteID","Vendor quote ID")}>{vendorReference?.value}</Info>
          <Info label={getDictionaryValue("techdata.renewals.label.agreementNumber", "Agreement №")}>{contract?.id}</Info>
        </p>        
        <p> <Info label={getDictionaryValue("techdata.renewals.label.quoteExpiryDate", "Quote expiry date")}>{formattedExpiry}</Info> </p>
        <p> <Info label={getDictionaryValue("techdata.renewals.label.quoteDueDate", "Quote due date")}>{formattedDueDate}</Info> </p>
        <p>
          <Info label={getDictionaryValue("techdata.renewals.label.program", "Program")}>{programName}</Info>
          <Info label={getDictionaryValue("techdata.renewals.label.duration", "Duration")}>{contract?.renewedDuration}</Info>      
          <Info label={getDictionaryValue("techdata.renewals.label.supportLevel", "Support level")}>{contract?.serviceLevel}</Info> 
        </p>
        <DurationDates label={getDictionaryValue("techdata.renewals.label.agreementDuration", "Agreement Duration")} startDate={contract?.formattedNewAgreementStartDate} endDate={contract?.formattedNewAgreementEndDate} />
        <DurationDates label={getDictionaryValue("techdata.renewals.label.usageDuration", "Usage Duration")} endDate={contract?.formattedNewUsagePeriodEndDate} />
      </div>
    );
  };

  return (
    <div className="cmp-renewals-qp__agreement-info">
      <span className="cmp-renewals-qp__agreement-info--title">
        {getDictionaryValue("techdata.renewals.label.agreement", "Agreement")}
      </span>
      <AgreementInfo />
    </div>
  );
}

export default AgreementInfo;
