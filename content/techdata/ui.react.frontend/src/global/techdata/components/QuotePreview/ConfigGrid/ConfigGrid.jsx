import React from 'react';
import useGet from "../../../hooks/useGet";
import Loader from '../../Widgets/Loader';
import CompanyInfo from './CompanyInfo';

function ConfigGrid({gridProps}) {
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
            </div>
            {/* <EndUserInfo />
                <GeneralInfo />
            */}
        </div>
    )
}

export default ConfigGrid;
