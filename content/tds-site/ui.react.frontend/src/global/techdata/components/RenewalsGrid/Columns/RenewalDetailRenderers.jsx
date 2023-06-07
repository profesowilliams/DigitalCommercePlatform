import React from 'react'
import DropdownDownloadList from './DropdownDownloadList'
import RenewalPlanOptions from './RenewalPlanOptions';
import { useRenewalGridState } from '../store/RenewalsStore';

function RenewalDetailRenderers(props) {    
    const detailRender = useRenewalGridState(state => state.detailRender);
    const aemConfig = useRenewalGridState(state => state.aemConfig);   
    props.api.resetRowHeights();
    /**
     * props.api.onRowHeightChanged(); after setRowHeight can cause ag-grid
     * to redraw the grid to calculate height. When called in succession, can
     * break the grid and show a blank page. This is commented out for now
     * with the trade-off of maybe indroducing minor-layout issue until a proper
     * fix is available.
     */
    if (detailRender === "primary"){
        if(props.node.rowHeight > 200){ //aggrid issues with custom details sizing
            props.node.setRowHeight(50);
            // props.api.onRowHeightChanged();
        }
    } 
    if (detailRender === "secondary"){
            props.node.setRowHeight(315, true);
            // props.api.onRowHeightChanged();
    }
    return (
        <>
            {detailRender === 'primary' && <DropdownDownloadList data={props.data} aemConfig={aemConfig} />}
            {detailRender === 'secondary' && <RenewalPlanOptions data={props.data} labels={aemConfig.productGrid} node={props.node} />}
        </>
    )
}

export default RenewalDetailRenderers
