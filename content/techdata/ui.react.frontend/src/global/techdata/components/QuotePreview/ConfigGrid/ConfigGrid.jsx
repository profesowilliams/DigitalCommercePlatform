import React from 'react';
import CompanyInfo from './CompanyInfo';

function ConfigGrid({gridProps}) {
    const [quotePreview, confirm] = (gridProps.headerLabel).split(':');

    return (
        <div className="cmp-qp__config-grid">
            <p className="cmp-qp__config-grid--title">{quotePreview}: <span>{confirm}</span></p>
            <div className="info-container">
                <CompanyInfo info={gridProps.information}/>
            </div>
            {/* <EndUserInfo />
                <GeneralInfo />
            */}
        </div>
    )
}

export default ConfigGrid;