import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { thousandSeparator } from "../../../helpers/formatting";
import { fileExtensions, generateFileFromPost, getDictionaryValue, getLocaleFormattedDate } from "../../../../../utils/utils";
import { useRenewalGridState } from "../store/RenewalsStore";
import { getLocalStorageData, setLocalStorageData } from "../renewalUtils";
import { PLANS_ACTIONS_LOCAL_STORAGE_KEY } from "../../../../../utils/constants";
import { CartIcon, DownloadIcon } from "../../../../../fluentIcons/FluentIcons";
import useTriggerOrdering from "../Orders/hooks/useTriggerOrdering";
import PlaceOrderDialog from "../Orders/PlaceOrderDialog";
import Link from "../../Widgets/Link";
import useComputeBranding from "../../../hooks/useComputeBranding";
import { redirectToRenewalDetail, formatRenewedDuration } from "../renewalUtils";
import useIsIconEnabled from "../Orders/hooks/useIsIconEnabled";

function RenewalPlanOptions({ labels, data, node }) {  
    const aemConfig = useRenewalGridState((state) => state.aemConfig);
    const { updateRenewalOrderEndpoint, getStatusEndpoint, orderRenewalEndpoint, renewalDetailsEndpoint } = aemConfig;
    const { pageNumber } = useRenewalGridState((state) => state.pagination);
    const { orderingFromDashboard } = useRenewalGridState(state => state.aemConfig);
    const [optionIdSelected, setOptionIdSelected] = useState();
    const rowIndexRef = useRef(node?.rowIndex)
    const { detailUrl = "", exportXLSRenewalsEndpoint = "", exportPDFRenewalsEndpoint = "" } = aemConfig;
    const orderEndpoints = { updateRenewalOrderEndpoint, getStatusEndpoint, orderRenewalEndpoint };
    const { handleCartIconClick, details, toggleOrderDialog, closeDialog } = useTriggerOrdering({ renewalDetailsEndpoint, data, detailUrl });
    const { computeClassName: computeTDSynnexClass, isTDSynnex } = useComputeBranding(useRenewalGridState);
    const isIconEnabled = useIsIconEnabled(data?.firstAvailableOrderDate, data?.canPlaceOrder, orderingFromDashboard?.showOrderingIcon);


    const isPlanSelected = ({ id }) => {
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

    useEffect(() => setOptionIdSelected(findAndReturnCurrentPlanId(data?.options)), [])
    
    const exportXlsPlan = (id) => {
        const postData = { id };
        const name = `renewal-${id}.xlsx`;
        const url = exportXLSRenewalsEndpoint;
        generateFileFromPost({ url, name, postData })
    }

    const computeClassName = (optionList, index) => {
        const isLastElement = index+1 === optionList.length || (index + 1) % 3 == 0;
        const isMultiRows = optionList.length > 3;
        let className = 'card-full-border';

        if (!isMultiRows) {        
            className = index === 2 ? 'card-no-border' : 'card-right-border' ;
            className = isLastElement ? 'card-no-border' : className;
        } 
        if (isMultiRows && index === 2) {        
            className = 'card-no-border card-bottom-border';
        } 
        if (isMultiRows && index > 2) {        
            className = isLastElement ? 'card-no-border': 'card-right-border';
        } 
       
        return className;
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
            selected: getDictionaryValue("grids.renewal.label.selectedPlan", "Selected Plan"),
            current:  getDictionaryValue("grids.renewal.label.currentPlan", "Current Plan")
        };
        if (isPlanSelected(option)) {
            return isCurrentPlan(option) ? planLabels.current : planLabels.selected;
        }
        return "";
    }
    const computeMarketingCssStyle = () => {
        return "card-right-border";
    }

    const setStylesOnSelected = (option) => {
        return isPlanSelected(option) && { fontWeight: 700 };
    }

    const changeRadioButton = (event) => {
        const id = event?.target?.value;
        setOptionIdSelected(id);
        setLocalStorageData(PLANS_ACTIONS_LOCAL_STORAGE_KEY, {
            ...getLocalStorageData(PLANS_ACTIONS_LOCAL_STORAGE_KEY),
            selectedPlanId: id,
            capturedPlanPage: pageNumber,
        });
    }

    const formatExpiryDateLabel = (option) => {
        if (!option?.formattedExpiryDate) return "No date provided"
        return option?.formattedExpiryDate
    }

    const setDefaultCheckedOption = (option) => {
        if (option?.quoteCurrent) return true
        if ("selectedPlanId" in getLocalStorageData(PLANS_ACTIONS_LOCAL_STORAGE_KEY)) {
             return option?.id === getLocalStorageData(PLANS_ACTIONS_LOCAL_STORAGE_KEY)["selectedPlanId"];
        }
        return optionIdSelected === option?.id;
    }

    const renewalDetailsURL = id => encodeURI(
        `${window.location.origin}${detailUrl}.html?id=${id ?? ""}`
    );

    const formatTotalValue = (option) => {
      return aemConfig?.displayCurrencyName
        ? `${thousandSeparator(option?.total)} ${data?.renewal?.currency}`
        : `$ ${thousandSeparator(option?.total)}`;
    };

    const optionPlanLink = id => <Link
        href={renewalDetailsURL(id)}
        variant="renewal-links__secondary"
        underline="none"
    >
        {id}
    </Link>     

    const hasTwoRows = (options) => {
        if (!options) return '';
        if (options.length < 3) return '';
        return 'four-columns-only';
    }

    const calcPlanColumnClassName = (data) => `${computeTDSynnexClass("cmp-renewal-plan-column")} ${hasTwoRows(data?.options)}`;

    const PlanLeftHeader = (data) => {
      const durationSplit = formatRenewedDuration(null, data.option?.contractDuration, data.option?.support)?.split(' ');
      let durationLine1 = '';
      let durationLine2 = '';

      if (durationSplit?.length > 4) {
        durationLine1 = durationSplit.slice(0, 4).join(' ');
        durationLine2 = durationSplit.slice(4).join(' ');
      } else {
        durationLine1 = durationSplit.join(' ');
      }

      return (
        <>
          <input
            key={Math.random()}
            id={data.option?.id}
            name="planOption"
            type="radio"
            defaultChecked={setDefaultCheckedOption(data.option)}
            value={data.option?.id}
          />
          <label
            htmlFor={data.option?.id}
            style={{ ...setStylesOnSelected(data.option) }}
          >
            &nbsp;&nbsp;{durationLine1}
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp; {durationLine2}
          </label>
        </>
      );
    };
    
    return (
        <div key={rowIndexRef.current + Math.random()}>
            <div className={calcPlanColumnClassName(data)}>
                <div className={`cmp-card-marketing-section ${computeMarketingCssStyle()}`}>
                    <div className="marketing-body"></div>
                </div>
                {data?.options && data.options.map((option, index) => {     
                    return (
                        <div className="cmp-renewal-plan-column__item" key={option?.id}>
                            <div className={computeClassName(data?.options, index)}>
                                <div className="header">
                                    <div className="leftHeader">
                                        <div onChange={changeRadioButton}>
                                            <PlanLeftHeader option={option} /> 
                                        </div>
                                    </div>
                                    <div className="rightHeader">
                                        <div
                                            htmlFor={option?.id}
                                            style={{ ...setStylesOnSelected(option) }}
                                        > {formatTotalValue(option)}
                                        </div>
                                    </div>
                                    <div className="clear"></div>
                                </div>
                                <div className="planDetails">
                                    <span className="currentPlan">
                                        {showPlanLabels(option)}
                                    </span>
                                    <p>{`${getDictionaryValue("details.renewal.label.quoteId", "Quote ID")}:`}  {option?.quoteID ? option?.quoteID : 'No data provided'}</p>
                                    <p>{`${getDictionaryValue("grids.renewal.label.refNo", "Ref No")}:`} {optionPlanLink(option?.id)}</p>
                                    <p>{`${getDictionaryValue("grids.renewal.label.expiryDate", "Expiry Date")}:`}  {formatExpiryDateLabel(option)}</p>
                                </div>
                                {isPlanSelected(option) && (
                                    <div className="footer">
                                        {
                                            labels?.showDownloadPDFButton && (
                                                <>
                                                <button onClick={() => downloadPDF(option.id)}>
                                                    <DownloadIcon className="cmp-svg-icon__charcoal"/>
                                                    <span>
                                                        &nbsp;&nbsp;{getDictionaryValue("button.common.label.downloadPDF", "Download PDF")}
                                                    </span>
                                                </button>
                                                </>
                                            )
                                        }
                                                                         
                                        {
                                            labels?.showDownloadXLSButton && (
                                            <>
                                                <span className="vertical-separator"></span>
                                                <button onClick={() => exportXlsPlan(option?.id)}>
                                                    <DownloadIcon className="cmp-svg-icon__charcoal"/>
                                                    <span>&nbsp;&nbsp;{getDictionaryValue("button.common.label.downloadXLS", "Download XLS")}</span>
                                                </button>
                                            </>
                                        )}  
                                        {
                                            labels?.showSeeDetailsButton && (
                                            <>
                                                <span className="vertical-separator"></span>
                                                <button
                                                    onClick={() =>
                                                        redirectToRenewalDetail(detailUrl, option?.id)
                                                    }>
                                                    <i className="far fa-eye"></i>
                                                    <span>
                                                        &nbsp;&nbsp;{getDictionaryValue("button.common.label.seeDetails", "See Details")}
                                                    </span>
                                                </button>
                                            </>
                                            )
                                        }                                     
                                        
                                        {
                                            orderingFromDashboard?.showOrderingIcon && (
                                                <>
                                                    <span className="vertical-separator"></span>
                                                    {isIconEnabled ? (
                                                        <span className="cmp-renewals-cart-icon" onClick={(event) => handleCartIconClick(event, option)} >
                                                            <CartIcon />{' '}
                                                            <span>{ getDictionaryValue("button.common.label.order", "Order")}</span>
                                                        </span>
                                                    ) : (
                                                        <>
                                                            <button>
                                                                <CartIcon
                                                                    fill="#c6c6c6"
                                                                    style={{ pointerEvents: 'none' }}
                                                                />{' '}
                                                                <span className="cmp-order-label-disabled">Order</span>
                                                            </button>
                                                        </>
                                                    )}
                                                </>
                                            )
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            <PlaceOrderDialog
                key={node?.rowIndex}
                isDialogOpen={toggleOrderDialog}
                onClose={closeDialog}
                orderingFromDashboard={orderingFromDashboard}
                renewalData={details}
                closeOnBackdropClick={false}
                orderEndpoints={orderEndpoints}
                store={useRenewalGridState}             
            />
        </div>
    );
}

export default RenewalPlanOptions;
