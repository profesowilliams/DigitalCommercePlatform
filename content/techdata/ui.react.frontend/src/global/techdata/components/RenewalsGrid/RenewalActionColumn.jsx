import React from 'react'
import EllipsisIcon from './EllipsisIcon';
import { useRenewalGridState } from './store/RenewalsStore';

function _RenewalActionColumn({ eventProps }) {
    
    const [isToggled, setToggled] = React.useState(false);
    const effects = useRenewalGridState(state => state.effects);
    const rowCollapsedIndexList = useRenewalGridState(state => state.rowCollapsedIndexList);

    const { value, data } = eventProps;
    const iconStyle = { color: "#21314D", cursor: "pointer", fontSize: "1.2rem", width: '1.3rem' };
    React.useEffect(() => {
        const currentNode = eventProps.node; 
        rowCollapsedIndexList?.includes(currentNode.rowIndex) && setToggled(false);
      }, [rowCollapsedIndexList,eventProps.node,setToggled])
    const toggleExpandedRow = () => {
        effects.setCustomState({ key: 'detailRender', value: 'primary' })
        eventProps.node.setExpanded(!isToggled);  
        setToggled(!isToggled);  
        const rowCollapsedIndexList = [];
        eventProps.api.forEachNode(node => {
            if (node?.rowIndex !== eventProps.node?.rowIndex){
              node.expanded = false;
              rowCollapsedIndexList.push(node?.rowIndex);
            }
        })        
        effects.setCustomState({ key: 'rowCollapsedIndexList', value: rowCollapsedIndexList });    
    }
    return (
        <>
            <div className="cmp-renewal-action-container" onClick={toggleExpandedRow}>
                <EllipsisIcon style={iconStyle} />
            </div>
        </>
    )
}

const RenewalActionColumn = React.memo(_RenewalActionColumn);
export default RenewalActionColumn