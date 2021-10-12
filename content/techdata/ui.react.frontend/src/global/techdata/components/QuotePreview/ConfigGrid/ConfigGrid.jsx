import React from 'react';
import CompanyInfo from './CompanyInfo';
import GeneralInfo from './GeneralInfo';
import EndUserInfo from './EndUserInfo';

function ConfigGrid({ quoteDetails, gridProps, hideDealSelector, endUserInfoChange, generalInfoChange, companyInfoChange }) {
    const [quotePreview, confirm] = (gridProps.headerLabel).split(':');

    return (
        <div className="cmp-qp__config-grid">
            <p className="cmp-qp__config-grid--title">
                {quotePreview}: <span>{confirm}</span>
            </p>
            <div className="info-container">
                <CompanyInfo
                    url={gridProps.companyInfoEndPoint}
                    reseller={quoteDetails.reseller}
                    info={gridProps.information}
                    companyInfoChange={companyInfoChange}
                />
                <EndUserInfo
                    endUser={quoteDetails.endUser}
                    info={gridProps.information}
                    onValueChange={endUserInfoChange}
                />
                <GeneralInfo
                    quoteDetails={quoteDetails}
                    gridProps={gridProps}
                    info={gridProps.information}
                    hideDealSelector={hideDealSelector}
                    onValueChange={generalInfoChange}
                />
            </div>
        </div>
    );
}

export default ConfigGrid;
