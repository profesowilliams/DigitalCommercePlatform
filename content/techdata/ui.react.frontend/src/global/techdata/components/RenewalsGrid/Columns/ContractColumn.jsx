import React, { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "../../../../../fluentIcons/FluentIcons";
import { PLANS_ACTIONS_LOCAL_STORAGE_KEY, TOASTER_LOCAL_STORAGE_KEY } from "../../../../../utils/constants";
import { If } from "../../../helpers/If";
import { useRenewalGridState } from ".././store/RenewalsStore";
import { getLocalStorageData, hasLocalStorageData, isFromRenewalDetailsPage, setLocalStorageData } from "../renewalUtils";


function _ContractColumn({ data, eventProps }) {
  const renewed = data?.renewedDuration;
  const { setCustomState, closeAndCleanToaster }  = useRenewalGridState(state => state.effects); 
  const detailRender = useRenewalGridState(state => state.detailRender);
  const { pageNumber } = useRenewalGridState(state => state.pagination);
  const rowIndex = eventProps?.node?.rowIndex
  const rowCollapsedIndexList = useRenewalGridState(state => state.rowCollapsedIndexList);
  const [isToggled, setToggled] = useState(false);
  useEffect(() => {
    if (detailRender === "primary") setToggled(false)
  }, [detailRender])
  
  useEffect(() => {  
    rowCollapsedIndexList?.includes && rowCollapsedIndexList?.includes(rowIndex) && setToggled(false);
  }, [rowCollapsedIndexList])
  
  useEffect(() => {
    getInitialToggleState();
    return () => {
      localStorage.removeItem(PLANS_ACTIONS_LOCAL_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const recordsCount = eventProps.api?.getRenderedNodes()?.map(e => e.data?.source.id)?.filter(e => !!e)?.length;
    if (recordsCount === 1){
      setToggled(!isToggled);
      toggleExpandedRow();
    }
  },[])

  /**
   * Gets the initial toggle value if it exist in local storage
   * and set the initial toggle value to respective row.
   * @returns void
   */
  function getInitialToggleState() {
    if (!isFromRenewalDetailsPage()) return;

    if (hasLocalStorageData(PLANS_ACTIONS_LOCAL_STORAGE_KEY)) {
      if (getLocalStorageData(PLANS_ACTIONS_LOCAL_STORAGE_KEY)?.detailRender !== "secondary")
        return;

      const localRowIndex = getLocalStorageData(PLANS_ACTIONS_LOCAL_STORAGE_KEY)?.rowIndex;
      const capturedPlanPage = getLocalStorageData(PLANS_ACTIONS_LOCAL_STORAGE_KEY)["capturedPlanPage"]
      if (eventProps.node.rowIndex === localRowIndex - 1 && capturedPlanPage === pageNumber) {
        eventProps.node.setExpanded(!isToggled);
        setToggled(!isToggled);
      }
    }
  }

  const hasOptions = data?.options && data?.options?.length > 0;

  /**
   * Triggered when the renewal plans option is toggled.
   * @returns void
   */
  const toggleExpandedRow = () => {
    if (!hasOptions) return;
    setCustomState({ key: 'detailRender', value: 'secondary' })
    eventProps.node.setExpanded(!isToggled);
    setToggled(!isToggled);
    const rowCollapsedIndexList = [];
    eventProps.api.forEachNode(node => {
      const currentNode = eventProps.node;      
      if (node?.rowIndex !== currentNode?.rowIndex){     
        // node?.expanded && node.setExpanded(false);        
        node.expanded = false;
        rowCollapsedIndexList.push(node?.rowIndex);
      }
    });
    setCustomState({ key: 'rowCollapsedIndexList', value: rowCollapsedIndexList })
    closeAndCleanToaster();
    /**
     * Ag-grid gives detailed-view the same index as normal grid rows. This
     * prevents targeting the toggle state appropriately. Hence DOM query.
     * setTimeout to execute this last from the call stack.
     */
    setTimeout(() => {
      setLocalStorageData(PLANS_ACTIONS_LOCAL_STORAGE_KEY, {
        detailRender: 'secondary',
        rowCollapsedIndexList,
        rowIndex: parseFloat(document.querySelector(".ag-full-width-container")?.querySelector("[row-index]")?.getAttribute("row-index")),
        capturedPlanPage: pageNumber,
        selectedPlanId: eventProps.data.options[0]['id'],
      });
    }, 0)
  }

  const formatRenewedDuration = (renewed, support) => {
    const extractYear = (renewed) => renewed.split(' ').slice(0, 2).join(' ');
    const hasOnlyDuration = renewed && !support;
    return hasOnlyDuration
      ? `, ${extractYear(renewed)}`
      : renewed && support
      ? `, ${extractYear(renewed)}, ${support}`
      : (support ?`, ${support}` :'');
  };
  
  
  return (
    <>{data ? (
      <>
        <div className="cmp-renewal-duration" onClick={toggleExpandedRow} style={{cursor: !hasOptions && 'initial' }}>
          { renewed ? (
            <span className="cmp-renewal-duration__info">
            Renewal{formatRenewedDuration(renewed, data?.support)}    
            </span>
          ) : null } 
          { isToggled ? (
            <>
              <If condition={hasOptions}>
                <div className='cmp-triangle-up' key={Math.random()}>
                <ChevronUpIcon/>
                </div>
              </If>

            </>
          ) : (
            <>
              <If condition={hasOptions}>
                <div className='cmp-triangle-down' key={Math.random()}>
                <ChevronDownIcon/>
                </div>
              </If>
            </>
          )}
        </div>
      </>
    ) : ""}</>
  );
}

const ContractColumn = React.memo(_ContractColumn); 
export default ContractColumn;
