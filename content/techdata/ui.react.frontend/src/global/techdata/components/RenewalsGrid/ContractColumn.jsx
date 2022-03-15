import React from "react";
import { If } from "../../helpers/If";
import Info from "../common/quotes/DisplayItemInfo";
import { useRenewalGridState } from "./store/RenewalsStore";

function ContractColumn({ data, eventProps }) {
  const renewed = data?.renewedDuration;
  const effects = useRenewalGridState(state => state.effects);
  const detailRender = useRenewalGridState(state => state.detailRender);
  const renewalOptionState = useRenewalGridState(state => state.renewalOptionState);
  const rowCollapsedIndexList = useRenewalGridState(state => state.rowCollapsedIndexList);
  const [togglePlanUpdated, setToggleUpdatedPlan] = React.useState(false);
  const [isToggled, setToggled] = React.useState(false);
  React.useEffect(() => {
    if (detailRender === "primary") setToggled(false)
  }, [detailRender])
  React.useEffect(() => {
    if (!isToggled && renewalOptionState) setToggleUpdatedPlan(true)
  }, [isToggled])
  React.useEffect(() => {
    const currentNode = eventProps.node; 
    rowCollapsedIndexList?.includes(currentNode.rowIndex) && setToggled(false);
  }, [rowCollapsedIndexList])

  const iconStyle = { color: "#21314D", cursor: "pointer", fontSize: "1.2rem" };
  const hasOptions = data?.options && data?.options?.length > 0;
  const toggleExpandedRow = () => {
    if (!hasOptions) return;
    effects.setCustomState({ key: 'detailRender', value: 'secondary' })
    eventProps.node.setExpanded(!isToggled);
    setToggled(!isToggled);
    setToggleUpdatedPlan(!togglePlanUpdated)
    const rowCollapsedIndexList = [];
    eventProps.api.forEachNode(node => {
      const currentNode = eventProps.node;      
      if (node?.rowIndex !== currentNode?.rowIndex){     
          node?.expanded && node.setExpanded(false);        
          rowCollapsedIndexList.push(node?.rowIndex);
      }
    });
    effects.setCustomState({ key: 'rowCollapsedIndexList', value: rowCollapsedIndexList })
  }
  
  return (
    <>{data ? (
      <>
        <div className="cmp-renewal-duration" onClick={toggleExpandedRow} style={{cursor: !hasOptions && 'initial' }}>
          {!togglePlanUpdated && (
            <Info label="Renewal">
              {renewed ? (renewed + ",") : ""} {data?.support}
            </Info>
          )}

          {togglePlanUpdated && (
            <Info label="Renewal">
              {renewalOptionState}              
            </Info>
          )}

          {isToggled ? (
            <>
              <If condition={hasOptions}>
                <div className='cmp-triangle-up' key={Math.random()}>
                  <i className="fas fa-caret-up" style={iconStyle} />
                </div>
              </If>

            </>
          ) : (
            <>
              <If condition={hasOptions}>
                <div className='cmp-triangle-down' key={Math.random()}>
                  <i className="fas fa-caret-down" style={iconStyle} />
                </div>
              </If>
            </>
          )}
        </div>
      </>
    ) : ""}</>
  );
}

export default ContractColumn;
