import React, { useEffect } from 'react'
import { PLANS_ACTIONS_LOCAL_STORAGE_KEY } from '../../../../../utils/constants';
import { getLocalStorageData, hasLocalStorageData, isFromRenewalDetailsPage, setLocalStorageData } from '../renewalUtils';
import { useRenewalGridState } from '../store/RenewalsStore';

const EllipsisIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" {...props}>
      <path d="M120 256c0 30.9-25.07 56-56 56S8 286.9 8 256s25.07-56 56-56 56 25.1 56 56zm160 0c0 30.9-25.1 56-56 56s-56-25.1-56-56 25.1-56 56-56 56 25.1 56 56zm48 0c0-30.9 25.1-56 56-56s56 25.1 56 56-25.1 56-56 56-56-25.1-56-56z" />
    </svg>
  )

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

  useEffect(() => {
    getInitialToggleState();
  }, []);

  /**
   * Gets the initial toggle value if it exist in local storage
   * and set the initial toggle value to respective row.
   * @returns void
   */
  function getInitialToggleState() {
    if (!isFromRenewalDetailsPage()) return;

    if (hasLocalStorageData(PLANS_ACTIONS_LOCAL_STORAGE_KEY)) {
      if (getLocalStorageData(PLANS_ACTIONS_LOCAL_STORAGE_KEY)?.detailRender !== "primary")
        return;

      const localRowIndex = getLocalStorageData(PLANS_ACTIONS_LOCAL_STORAGE_KEY)?.rowIndex;
      if (eventProps.node.rowIndex === localRowIndex - 1) {
        eventProps.node.setExpanded(!isToggled);
        setToggled(!isToggled);
      }
    }
  }

    /**
   * Triggered when the actions button is clicked.
   * @returns void
   */
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
        /**
         * Ag-grid gives detailed-view the same index as normal grid rows. This
         * prevents targeting the toggle state appropriately. Hence DOM query.
         * setTimeout to excecute this last from the call stack.
         */
        setTimeout(() => {
          setLocalStorageData(PLANS_ACTIONS_LOCAL_STORAGE_KEY, {
            detailRender: 'primary',
            rowCollapsedIndexList,
            rowIndex: parseFloat(document.querySelector(".ag-full-width-container")?.querySelector("[row-index]")?.getAttribute("row-index")),
          });
        }, 0)
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
