import React from "react";
import { dateToString, thousandSeparator } from "../../helpers/formatting";
import { useRenewalGridState } from "./store/RenewalsStore";

function RenewalPlanOptions({ labels, data }) {
    const effects = useRenewalGridState(st => st.effects);
    const renewalOptionState = useRenewalGridState(st => st.renewalOptionState);
    const { detailUrl = "" } = useRenewalGridState((state) => state.aemConfig);
    const selectPlan = (value) => effects.setCustomState({ key: 'renewalOptionState', value })
    const isCurrentPlan = plan => plan === data?.renewedDuration;
    const isSamePlan = option => option?.contractDuration+" "+data?.support === renewalOptionState;
    React.useEffect(()=>{
        const currentPlan = data?.options.find(({contractDuration}) => isCurrentPlan(contractDuration));
        if (currentPlan) {
            const value = currentPlan?.contractDuration+" "+data?.support
            effects.setCustomState({key:'renewalOptionState', value});
        }       
    } ,[])
    const redirectToRenewalDetail = (id = "") => {
        const renewalDetailsURL = encodeURI(
          `${window.location.origin}${detailUrl}.html?id=${id}`
        );
        window.location.href = renewalDetailsURL;
      };
    return (
        <div className="cmp-renewal-plan-column">
            {data?.options && data?.options.map(option => (
                <>
                    <div className="card" key={option?.id}>
                        <div className="header">
                            <div className="leftHeader">                              
                                <h4>
                                    <input 
                                        key={Math.random()}
                                        value={isSamePlan(option)}
                                        defaultChecked={isSamePlan(option)}
                                        id={option?.id}
                                        type="radio"
                                        onClick={() => selectPlan(option?.contractDuration+" "+data?.support)}
                                        />
                                    <label htmlFor={option?.id}>&nbsp;&nbsp;{option?.contractDuration}, {data?.support}</label></h4>
                            </div>
                            <div className="rightHeader"><h4>$ {thousandSeparator(option?.total)}</h4></div>
                            <div className="clear"></div>
                        </div>
                        <div className="planDetails">
                            <span className="currentPlan">{isCurrentPlan(option?.contractDuration) && 'Current Plan'}</span>
                            <p>{labels.quoteIdLabel}  {option?.quoteID ? option?.quoteID : 'No data provided'}</p>
                            <p>{labels.refNoLabel}  {option?.id}</p>
                            <p>{labels.expiryDateLabel}  {dateToString(option?.expiryDate.replace(/[zZ]/g, ''), "MM/dd/uu")}</p>
                        </div>
                        {isSamePlan(option) && (
                               <div className="footer">
                               <button>
                                   <i className="fas fa-file-pdf"></i>
                                   &nbsp;&nbsp;{labels.downloadPDFLabel}
                               </button>
                               <span className="vertical-separator"></span>
                               <button>
                                   <i className="fas fa-file-excel"></i>
                                   &nbsp;&nbsp;{labels.downloadXLSLabel}
                               </button>
                               <span className="vertical-separator"></span>
                               <button onClick={() => redirectToRenewalDetail(option?.id)}>
                                   <i className="far fa-eye"></i>
                                   &nbsp;&nbsp;{labels.seeDetailsLabel}
                               </button>
                           </div>
                        )} 
                     
                    </div>
                </>
            ))}
        </div>
    );
}

export default RenewalPlanOptions;
