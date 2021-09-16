import React from 'react';
import useGet from "../../../hooks/useGet";
import Loader from '../../Widgets/Loader';
import CompanyInfo from './CompanyInfo';
import GeneralInfo from './GeneralInfo';
import EndUserInfo from './EndUserInfo';

function ConfigGrid({ data, gridProps }) {
    const [quotePreview, confirm] = (gridProps.headerLabel).split(':');
    const [companyInfoResponse, isLoading] = useGet(`${gridProps.companyInfoEndPoint}?criteria=CUS&ignoreSalesOrganization=false`);

    const endUserInfoChange = (data) =>{
        console.log(data);
    }
    const generalInfoChange = (data) =>{
        console.log(data);
    }
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
                <EndUserInfo data={data} info={gridProps.information} onValueChange={endUserInfoChange}/>
                <GeneralInfo data={data} info={gridProps.information} onValueChange={generalInfoChange}/>
            </div>
            {/* <EndUserInfo />
                <GeneralInfo />
            */}
        </div>
    )
}

export default ConfigGrid;
