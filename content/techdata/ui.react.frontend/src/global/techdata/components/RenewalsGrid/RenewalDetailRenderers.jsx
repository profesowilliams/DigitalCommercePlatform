import React from 'react'
import DropdownDownloadList from './DropdownDownloadList'
import RenewalPlanOptions from './RenewalPlanOptions';
import { useRenewalGridState } from './store/RenewalsStore';

function RenewalDetailRenderers(props) {    
    const detailRender = useRenewalGridState(state => state.detailRender);
    const aemConfig = useRenewalGridState(state => state.aemConfig);    
    return (
        <>
            {detailRender === 'primary' && <DropdownDownloadList data={props.data} aemConfig={aemConfig} />}
            {detailRender === 'secondary' && <RenewalPlanOptions data={props.data} labels={aemConfig.productGrid} />}
        </>
    )
}

export default RenewalDetailRenderers