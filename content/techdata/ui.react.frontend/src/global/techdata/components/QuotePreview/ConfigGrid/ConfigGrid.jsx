import React from 'react';
import useGet from "../../../hooks/useGet";
import Loader from '../../Widgets/Loader';
import CompanyInfo from './CompanyInfo';
import GeneralInfo from './GeneralInfo';
import EndUserInfo from './EndUserInfo';

function ConfigGrid({ quoteDetails, gridProps, hideDealSelector, endUserInfoChange, generalInfoChange }) {
    const [quotePreview, confirm] = (gridProps.headerLabel).split(':');
    const [companyInfoResponse, isLoading] = useGet(`${gridProps.companyInfoEndPoint}?criteria=CUS&ignoreSalesOrganization=false`);

    return (
        <div className="cmp-qp__config-grid">
            <p className="cmp-qp__config-grid--title">{quotePreview}: <span>{confirm}</span></p>
            <div className="info-container">
                <Loader visible={isLoading} />
                {
                    (companyInfoResponse && !isLoading) ? (
                        <CompanyInfo data={companyInfoResponse} info={gridProps.information}/>
                    ) : null
                }
                <EndUserInfo endUser={quoteDetails.endUser} info={gridProps.information} onValueChange={endUserInfoChange}/>
                <GeneralInfo
                    quoteDetails={quoteDetails}
                    gridProps={gridProps}
                    info={gridProps.information}
                    hideDealSelector={hideDealSelector}
                    onValueChange={generalInfoChange}/>
            </div>
            {/* <EndUserInfo />
                <GeneralInfo />
            */}
        </div>
    )
}

export default ConfigGrid;
