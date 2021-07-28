import React from 'react';
import CompanyInfo from './CompanyInfo';

function ConfigGrid() {
    return (
        <div className="cmp-qp__config-grid">
            <p className="cmp-qp__config-grid--title">Quote Preview: <span>Confirm Details to Quote</span></p>
            <div className="info-container">
                <CompanyInfo />
            </div>
            {/* <EndUserInfo />
                <GeneralInfo />
            */}
        </div>
    )
}

export default ConfigGrid;