import React, { useEffect, useRef, useState } from "react";
import { dateToString, thousandSeparator } from "../../../helpers/formatting";
import { fileExtensions, generateFileFromPost } from "../../../../../utils/utils";
import { useRenewalGridState } from "../store/RenewalsStore";
import { getLocalStorageData, setLocalStorageData } from "../renewalUtils";
import { PLANS_ACTIONS_LOCAL_STORAGE_KEY } from "../../../../../utils/constants";
import Grid from "../../Grid/Grid";

function RenewalPlanOptions({ labels, data, node }) {
    const effects = useRenewalGridState(st => st.effects);
    const aemConfig = useRenewalGridState((state) => state.aemConfig);
    const { pageNumber } = useRenewalGridState((state) => state.pagination);
    const [optionIdSelected, setOptionIdSelected] = useState();
    const optionIdSelectedRef = useRef();
    const rowIndexRef = useRef(node?.rowIndex)
    const { detailUrl = "", exportXLSRenewalsEndpoint = "", exportPDFRenewalsEndpoint = "" } = aemConfig;
    const selectPlan = (value) => effects.setCustomState({ key: 'renewalOptionState', value })

    const isPlanSelected = ({id}) => {
        if ("selectedPlanId" in getLocalStorageData(PLANS_ACTIONS_LOCAL_STORAGE_KEY)) {
            return (id === getLocalStorageData(PLANS_ACTIONS_LOCAL_STORAGE_KEY)["selectedPlanId"]);
        }
        return id === optionIdSelected;
    };
    const isCurrentPlan = plan => plan.quoteCurrent;
    const findAndReturnCurrentPlanId = (options) => {
        if ("selectedPlanId" in getLocalStorageData(PLANS_ACTIONS_LOCAL_STORAGE_KEY)) {
            return getLocalStorageData(PLANS_ACTIONS_LOCAL_STORAGE_KEY)["selectedPlanId"];
        }

        const currentPlan = options.find((plan) => isCurrentPlan(plan));
        return currentPlan ? currentPlan?.id : 0;
    }
    const optionToParent = (idSelected) => {    
        const option = data?.options.find(opt => opt.id === idSelected)
        return {...option, rowIndex: rowIndexRef.current}
    }

    useEffect(() => {
        setOptionIdSelected(findAndReturnCurrentPlanId(data?.options))
        return () => selectPlan(optionToParent(optionIdSelectedRef.current))
    }, [])
    
    const dataToPush = (name) => ({
        type: ANALYTICS_TYPES.types.button,
        category: ANALYTICS_TYPES.category.renewalsActionColumn,
        name,
    });


    const redirectToRenewalDetail = (id = "") => {
        const renewalDetailsURL = encodeURI(
            `${window.location.origin}${detailUrl}.html?id=${id}`
        );
        window.location.href = renewalDetailsURL;
    };
    const exportXlsPlan = (id) => {
        const postData = { id };
        const name = `renewal-${id}.xlsx`;
        const url = exportXLSRenewalsEndpoint;
        generateFileFromPost({ url, name, postData })
    }
    const computeClassName = (optionList, index) => {
        const mediumScreenWidth = 1160;
        const largeScreenWidth = 1638;
        const availWidth = window.screen.availWidth;
        const isLastElement = ({ cols }) => (index + 1) % cols == 0;
        //on 1 single row no border bottom and last element no right border
        if (optionList.length <= 4) {
            if (optionList.length - 1 === index) return "card-no-border";
            return "card-right-border";
        }
        //on 4 cols and multiple rows hide right border only on the last element
        if (availWidth >= largeScreenWidth) {
            if (isLastElement({ cols: 4 })) return "card-bottom-border";
        }
        //on 3 cols and multiple rows hide right border only on the last element
        if (availWidth >= mediumScreenWidth) {
            if (isLastElement({ cols: 3 })) return "card-bottom-border";
        }
        return "card-full-border";
    }


    const downloadPDF = (Id) => {
        try {      
          generateFileFromPost({
            url: exportPDFRenewalsEndpoint,
            name: `Renewals Quote ${Id}.pdf`,
            postData: {
              Id
            },
            fileTypeExtension: fileExtensions.pdf
          })
        } catch (error) {
          console.error("error", error);
        }
        }

    const showPlanLabels = (option) => {
        const planLabels = {
            selected:"Selected Plan",
            current:"Current Plan"
        };
        if(isPlanSelected(option)){
            return isCurrentPlan(option) ? planLabels.current : planLabels.selected;
        }
        if(!isPlanSelected(option) && isCurrentPlan(option)){
            return planLabels.current
        }
        return "";
    } 
    const computeMarketingCssStyle = () => {      
        return "card-right-border";  
    }

    const setStylesOnSelected = (option) => {
        return { fontSize: isPlanSelected(option) && '17px' }
    }

    const changeRadioButton = (event) => {
        const id = event?.target?.value;
        setOptionIdSelected(id);
        optionIdSelectedRef.current = id;
        setLocalStorageData(PLANS_ACTIONS_LOCAL_STORAGE_KEY, {
          ...getLocalStorageData(PLANS_ACTIONS_LOCAL_STORAGE_KEY),
          selectedPlanId: id,
          capturedPlanPage: pageNumber,
        });
    }

    const formatExpiryDateLabel = (option) => {
        if (!option?.expiryDate) return "No date provided"
        return dateToString(option?.expiryDate.replace(/[zZ]/g, ''), "MM/dd/uu")
    }

    const setDefaultCheckedOption = (option) => {
        if ("selectedPlanId" in getLocalStorageData(PLANS_ACTIONS_LOCAL_STORAGE_KEY)) {
            return option?.id === getLocalStorageData(PLANS_ACTIONS_LOCAL_STORAGE_KEY)["selectedPlanId"];
        }
        return optionIdSelected === option?.id;
    }
    const gridConfig = {
        ...aemConfig,
        serverSide: false,
        paginationStyle: "none",
      };

    var res = [];

    const [columnDefs] = useState([
        { 
          field: 'res',         
        },
      ]);
    const _onAfterGridInit = (config) => {
        config.api.gridOptionsWrapper.gridOptions.getRowHeight = () => 35;
        config.api.gridOptionsWrapper.gridOptions.api.resetRowHeights();
    }
    return (
        <div key={rowIndexRef.current + Math.random()}>
            <div className="cmp-renewal-plan-column">
                <div className={`cmp-card-marketing-section ${computeMarketingCssStyle()}`}>
                    <div className="marketing-body"></div>
                </div>
                {data?.options && data?.options.map((option, index) => {
                    res = [];
                    res.push({res: `${labels.quoteIdLabel}  ${option?.quoteID ? option?.quoteID : 'No data provided'}`});
                    res.push({res: `${labels.refNoLabel}  ${option?.id}`});
                    res.push({res: `${labels.expiryDateLabel}  ${formatExpiryDateLabel(option)}`});
                    return (
                    <div key={option?.id}>
                        <div className={computeClassName(data?.options, index)}>
                            <div className="header">
                                <div className="leftHeader">
                                    <h4 onChange={changeRadioButton}>
                                        <input
                                            key={Math.random()}                                        
                                            id={option?.id}
                                            name="planOption"
                                            type="radio"    
                                            defaultChecked={setDefaultCheckedOption(option)}
                                            value={option?.id}                                     
                                        />
                                        <label htmlFor={option?.id} style={{...setStylesOnSelected(option)}}>&nbsp;&nbsp;{option?.contractDuration}, {option?.support}</label></h4>
                                </div>
                                <div className="rightHeader"><h4 htmlFor={option?.id} style={{...setStylesOnSelected(option)}}>$ {thousandSeparator(option?.total)}</h4></div>
                                <div className="clear"></div>
                            </div>
                            <div className="planDetails">
                                <span className="currentPlan">{showPlanLabels(option)}</span>
                                <Grid
                                    columnDefinition={columnDefs}
                                    config={gridConfig}
                                    data={res}
                                    onAfterGridInit={_onAfterGridInit}
                                    />
                            </div>
                            {isPlanSelected(option) && (
                                <div className="footer">
                                    <button onClick={() => downloadPDF(option.id)}>
                                        <i className="fas fa-file-pdf"></i>
                                        <span>&nbsp;&nbsp;{labels.downloadPDFLabel}</span>
                                    </button>
                                    <span className="vertical-separator"></span>
                                    <button onClick={() => exportXlsPlan(option?.id)}>
                                        <i className="fas fa-file-excel"></i>
                                        <span>&nbsp;&nbsp;{labels.downloadXLSLabel}</span>
                                    </button>
                                    <span className="vertical-separator"></span>
                                    <button onClick={() => redirectToRenewalDetail(option?.id)}>
                                        <i className="far fa-eye"></i>
                                        <span>&nbsp;&nbsp;{labels.seeDetailsLabel}</span>
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                )})}
            </div>
        </div>
    );
}

export default RenewalPlanOptions;
