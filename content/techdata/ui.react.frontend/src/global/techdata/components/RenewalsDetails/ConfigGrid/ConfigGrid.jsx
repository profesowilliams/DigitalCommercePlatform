import React from 'react';
import AgreementInfo from './AgreementInfo';
import EndUserInfo from './EndUserInfo';
import ResellerInfo from './ResellerInfo';

function ConfigGrid({ props }) {

    return (
        <div className="cmp-renewals-qp__config-grid">
            <p className="cmp-renewals-qp__config-grid--title">
                Quote preview
            </p>
            <div className="info-container">
                <ResellerInfo />
                <div className="info-divider"></div>
                <EndUserInfo />
                <div className="info-divider"></div>
                <AgreementInfo />
            </div>
        </div>
    );
}

export default ConfigGrid;
