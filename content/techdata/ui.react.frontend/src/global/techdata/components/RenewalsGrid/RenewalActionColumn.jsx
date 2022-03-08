import React from 'react'
import EllipsisIcon from './EllipsisIcon';
import { useRenewalGridState } from './store/RenewalsStore';

function RenewalActionColumn({ eventProps }) {
    
    const [isToggled, setToggled] = React.useState(false);
    const effects = useRenewalGridState(state => state.effects);
    const { value, data } = eventProps;
    const iconStyle = { color: "#21314D", cursor: "pointer", fontSize: "1.2rem", width: '1.3rem' };
    const toggleExpandedRow = () => {
        effects.setCustomState({ key: 'detailRender', value: 'primary' })
        eventProps.node.setExpanded(!isToggled);    
        eventProps.api.forEachNode(node => {
            if (node?.rowIndex !== eventProps.node?.rowIndex){
                node?.expanded && node.setExpanded(false);
            }
        })        
        setToggled(!isToggled);
     
    }
    return (
        <>
            <div className="cmp-renewal-action-container" onClick={toggleExpandedRow}>
                <EllipsisIcon style={iconStyle} />
            </div>
        </>
    )
}

export default RenewalActionColumn