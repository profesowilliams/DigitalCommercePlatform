import React, { useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "../../../../../fluentIcons/FluentIcons";
import { PLANS_ACTIONS_LOCAL_STORAGE_KEY, TOASTER_LOCAL_STORAGE_KEY } from "../../../../../utils/constants";
import { If } from "../../../helpers/If";
import Info from "../../common/quotes/DisplayItemInfo";
import { useRenewalGridState } from ".././store/RenewalsStore";
import { getLocalStorageData, hasLocalStorageData, isFromRenewalDetailsPage, setLocalStorageData } from "../renewalUtils";

function _ContractColumn({ data, eventProps }) {
  const renewed = data?.renewedDuration;
  const effects = useRenewalGridState(state => state.effects);
  const { setCustomState, closeAndCleanToaster } = effects;
  const detailRender = useRenewalGridState(state => state.detailRender);
  const { pageNumber } = useRenewalGridState(state => state.pagination);
  const renewalOptionState = useRenewalGridState(state => state.renewalOptionState);
  const isTDSynnex = useRenewalGridState(state => state.isTDSynnex); 
  const rowIndex = eventProps?.node?.rowIndex
  const {contractDuration, support} = !renewalOptionState ? {contractDuration:'',support:''} :renewalOptionState ;
  const rowCollapsedIndexList = useRenewalGridState(state => state.rowCollapsedIndexList);
  const [isToggled, setToggled] = React.useState(false);
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

  const iconStyle = { color: "#21314D", cursor: "pointer", fontSize: "1.2rem" };
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
  const hasRenderStateTextFromPlanOptions = () => support && rowIndex == (renewalOptionState?.rowIndex -1);

  const keepDataAfterRenderTextPlanOptions = () => {
    return (!support || support && rowIndex !== (renewalOptionState?.rowIndex -1) )
  }

  const formatRenewedDuration = (renewed, support) => 
    renewed && support ?`${renewed.split(' ').slice(0,2).join(' ')}, ${support}` : "";
  
  
  return (
    <>{data ? (
      <>
        <div className="cmp-renewal-duration" onClick={toggleExpandedRow} style={{cursor: !hasOptions && 'initial' }}>
          { keepDataAfterRenderTextPlanOptions() && (
            <>
            Renewal : {formatRenewedDuration(renewed, data?.support)}    
            </>
          )}           
          { hasRenderStateTextFromPlanOptions() && (
            <>          
              Renewal : {formatRenewedDuration(contractDuration, support)}              
            </>
          )}

          {isToggled ? (
            <>
              <If condition={hasOptions}>
                <div className='cmp-triangle-up' key={Math.random()}>
                  {
                    isTDSynnex 
                    ? <ChevronUpIcon
                      />
                    : <i className="fas fa-caret-up" style={iconStyle} />}
                </div>
              </If>

            </>
          ) : (
            <>
              <If condition={hasOptions}>
                <div className='cmp-triangle-down' key={Math.random()}>
                  {
                    isTDSynnex 
                    ? <ChevronDownIcon
                      />
                    :<i className="fas fa-caret-down" style={iconStyle} />
                    }
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
