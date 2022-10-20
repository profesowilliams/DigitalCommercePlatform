import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { thousandSeparator } from "../../../helpers/formatting";
import { fileExtensions, generateFileFromPost, getLocaleFormattedDate } from "../../../../../utils/utils";
import { useRenewalGridState } from "../store/RenewalsStore";
import { getLocalStorageData, setLocalStorageData } from "../renewalUtils";
import { PLANS_ACTIONS_LOCAL_STORAGE_KEY } from "../../../../../utils/constants";
import { If } from "../../../helpers/If";
import { CartIcon } from "../../../../../fluentIcons/FluentIcons";
import useTriggerOrdering from "../Orders/hooks/useTriggerOrdering";
import PlaceOrderDialog from "../Orders/PlaceOrderDialog";
import Link from "../../Widgets/Link";
import useIsTDSynnexClass from "../../RenewalFilter/components/useIsTDSynnexClass";
import { redirectToRenewalDetail } from "../renewalUtils";
import useIsIconEnabled from "../Orders/hooks/useIsIconEnabled";

function RenewalPlanOptions({ labels, data, node }) {
    const effects = useRenewalGridState(st => st.effects);
    const aemConfig = useRenewalGridState((state) => state.aemConfig);
    const { updateRenewalOrderEndpoint, getStatusEndpoint, orderRenewalEndpoint, renewalDetailsEndpoint } = aemConfig;
    const { pageNumber } = useRenewalGridState((state) => state.pagination);
    const { orderingFromDashboard } = useRenewalGridState(state => state.aemConfig);
    const [optionIdSelected, setOptionIdSelected] = useState();
    const optionIdSelectedRef = useRef();
    const rowIndexRef = useRef(node?.rowIndex)
    const { detailUrl = "", exportXLSRenewalsEndpoint = "", exportPDFRenewalsEndpoint = "" } = aemConfig;
    const orderEndpoints = { updateRenewalOrderEndpoint, getStatusEndpoint, orderRenewalEndpoint };
    const { handleCartIconClick, details, toggleOrderDialog, closeDialog } = useTriggerOrdering({ renewalDetailsEndpoint, data, detailUrl });
    const selectPlan = (value) => effects.setCustomState({ key: 'renewalOptionState', value })
    const { computeClassName: computeTDSynnexClass, isTDSynnex } = useIsTDSynnexClass();
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
    const optionToParent = (idSelected) => {
        const option = data?.options.find(opt => opt.id === idSelected)
        return { ...option, rowIndex: rowIndexRef.current }
    }

    useEffect(() => {
        setOptionIdSelected(findAndReturnCurrentPlanId(data?.options))
        return () => selectPlan(optionToParent(optionIdSelectedRef.current))
    }, [])

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
        if (optionList.length - 1  === index ) {
            return "card-no-border";
        }
        if (index >= 3 ) {
            return "card-right-border"
        }
        //on 1 single row no border bottom and last element no right border
        if (optionList.length < 4) {
            if (optionList.length - 1 === index) return "card-no-border";
            return "card-right-border";
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
            selected: "Selected Plan",
            current: "Current Plan"
        };
        if (isPlanSelected(option)) {
            return isCurrentPlan(option) ? planLabels.current : planLabels.selected;
        }
        if (!isPlanSelected(option) && isCurrentPlan(option)) {
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
        return getLocaleFormattedDate(option?.expiryDate)
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

    const formatRenewedDuration = renewed  => {
        const matchAfterYear = /(?<=Year).*$/gm
        return renewed.replace(matchAfterYear, ' ');
    }        

    const hasTwoRows = (options) => {
        if (!options) return '';
        if (options.length < 3) return '';
        return 'four-columns-only';
    }

    const calcPlanColumnClassName = (data) => `${computeTDSynnexClass("cmp-renewal-plan-column")} ${hasTwoRows(data?.options)}`;

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
                                        <h4 onChange={changeRadioButton}>
                                            <input
                                                key={Math.random()}
                                                id={option?.id}
                                                name="planOption"
                                                type="radio"
                                                defaultChecked={setDefaultCheckedOption(
                                                    option
                                                )}
                                                value={option?.id}
                                            />
                                            <label
                                                htmlFor={option?.id}
                                                style={{ ...setStylesOnSelected(option) }}
                                            >
                                                &nbsp;&nbsp;{formatRenewedDuration(option?.contractDuration)},{' '}
                                                {option?.support}
                                            </label>
                                        </h4>
                                    </div>
                                    <div className="rightHeader">
                                        <h4
                                            htmlFor={option?.id}
                                            style={{ ...setStylesOnSelected(option) }}
                                        > {formatTotalValue(option)}
                                        </h4>
                                    </div>
                                    <div className="clear"></div>
                                </div>
                                <div className="planDetails">
                                    <span className="currentPlan">
                                        {showPlanLabels(option)}
                                    </span>
                                    <p>{labels.quoteIdLabel}  {option?.quoteID ? option?.quoteID : 'No data provided'}</p>
                                    <p>{labels.refNoLabel} {optionPlanLink(option?.id)}</p>
                                    <p>{labels.expiryDateLabel}  {formatExpiryDateLabel(option)}</p>
                                </div>
                                {isPlanSelected(option) && (
                                    <div className="footer">
                                        {
                                            labels?.showDownloadPDFButton && (
                                                <>
                                                <button onClick={() => downloadPDF(option.id)}>
                                                    <i className="fas fa-file-pdf"></i>
                                                    <span>
                                                        &nbsp;&nbsp;{labels.downloadPDFLabel}
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
                                                    <i className="fas fa-file-excel"></i>
                                                    <span>&nbsp;&nbsp;{labels.downloadXLSLabel}</span>
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
                                                        &nbsp;&nbsp;{labels.seeDetailsLabel}
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
                                                            <span>Order</span>
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
