import React from "react";
import AgreementInfo from "./AgreementInfo";
import EndUserInfo from "./EndUserInfo";
import ResellerInfo from "./ResellerInfo";

function ConfigGrid({ data, gridProps }) {
  const { reseller, endUser, items, programName, dueDate, endUserType, source, expiry, customerPO, vendorLogo } = data;
  const { quotePreview } = gridProps;
  Object.keys(quotePreview).forEach(key => {
    if (typeof quotePreview[key] === 'string') {
      quotePreview[key] = quotePreview[key].replace(/ No:/g,' \u2116:');
    } else if (typeof  quotePreview[key] === 'object') {
      Object.keys(quotePreview[key]).forEach(subkey => {
          quotePreview[key][subkey] = quotePreview[key][subkey].replace(/ No:/g,' \u2116:');
        });
    }
    
  });
  
  return (
    <div className="cmp-renewals-qp__config-grid">
      <p className="cmp-renewals-qp__config-grid--title">
        {quotePreview.quotePreviewlabel}
        <img className="vendorLogo" src={vendorLogo} alt="vendor logo"/>
      </p>
      <div className="info-container">
        <ResellerInfo
          resellerLabels={quotePreview.reseller}
          reseller={reseller}
        />
        <EndUserInfo
          productLines={quotePreview.productLines}
          endUserType={endUserType}
          endUser={{...endUser, vendorAccountNumber: reseller?.vendorAccountNumber}}
        />
        <AgreementInfo
          source={source}
          programName={programName}
          dueDate={dueDate}
          agreementInfo={quotePreview.agreementInfo}
          contract={items[0].contract}
          expiry={expiry}
          customerPO={customerPO}
        />
      </div>
    </div>
  );
}

export default ConfigGrid;
