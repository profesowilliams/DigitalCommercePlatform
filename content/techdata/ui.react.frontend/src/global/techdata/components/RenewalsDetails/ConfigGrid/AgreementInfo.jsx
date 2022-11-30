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
        <DurationDates label={getDictionaryValue("details.renewal.label.agreementDuration", "Agreement Duration")} startDate={contract?.formattedNewAgreementStartDate} endDate={contract?.formattedNewAgreementEndDate} />
        <DurationDates label={getDictionaryValue("details.renewal.label.usageDuration", "Usage Duration")} endDate={contract?.formattedNewUsagePeriodEndDate} />
      </div>
    );
  };

  return (
    <div className="cmp-renewals-qp__agreement-info">
      <span className="cmp-renewals-qp__agreement-info--title">
        {getDictionaryValue("details.renewal.label.agreement", "Agreement")}
      </span>
      <AgreementInfo />
    </div>
  );
}

export default AgreementInfo;
