import { PDFDownloadLink } from '@react-pdf/renderer';
import React, { useEffect, useRef, useState } from "react";
import { generateExcelFileFromPost } from "../../../../utils/utils";
import { dateToString, thousandSeparator } from "../../helpers/formatting";
import useGet from "../../hooks/useGet";
import { openPDF } from "../PDFWindow/PDFRenewalWindow";
import PDFRenewalPlanOption from "./PDFRenewalPlanOption";
import { useRenewalGridState } from "./store/RenewalsStore";

function RenewalPlanOptions({ labels, data, node }) {
    const effects = useRenewalGridState(st => st.effects);
    //const renewalOptionState = useRenewalGridState(st => st.renewalOptionState);
    const aemConfig = useRenewalGridState((state) => state.aemConfig);
    const [optionIdSelected, setOptionIdSelected] = useState();
    const optionIdSelectedRef = useRef();
    const rowIndexRef = useRef(node?.rowIndex)
    const { detailUrl = "", exportXLSRenewalsEndpoint = "", renewalDetailsEndpoint = "" } = aemConfig;
    const selectPlan = (value) => effects.setCustomState({ key: 'renewalOptionState', value })
    // const isPlanSelected = option => option?.contractDuration + " " + data?.support === renewalOptionState;
    const isPlanSelected = ({id}) => id === optionIdSelected;
    const isCurrentPlan = plan => plan.quoteCurrent;
    const [showPdf, setShowPdf] = useState(false);
    const findAndReturnCurrentPlanId = (options) => {
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
        generateExcelFileFromPost({ url, name, postData })
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

    const renderPDF = () => setShowPdf(true);

    const DownloadPDF = () => {
        const [apiResponse, isLoading] = useGet(
            `${renewalDetailsEndpoint}?id=${data?.source?.id}&type=renewal`
        );
        const [renewalsDetails, setRenewalsDetails] = useState({});

        useEffect(() => {
            if (apiResponse?.content?.details) {
                setRenewalsDetails(apiResponse?.content?.details[0]);
            }
        }, [apiResponse]);

        return (Object.keys(renewalsDetails).length && <PDFDownloadLink
            document={<PDFRenewalPlanOption renewalsDetails={renewalsDetails} />}
            fileName={"Renewals.pdf"}>
            {({ blob, url, loading, error }) => {
                loading ? "loading..." : openPDF(url);
            }}
        </PDFDownloadLink>
        )
    };
    const showPlanLabels = (option) => {
        const planLabels = {
            selected:"Selected Plan",
            current:"Current Plan"
        };
        if(isPlanSelected(option)){
            return isCurrentPlan(option) ? planLabels.current : planLabels.selected;
        }
        return "";
    } 
    const computeMarketingCssStyle = () => {      
        return "card-right-border";  
    }

    const setStylesOnSelected = (option) => {
        return { fontSize: isPlanSelected(option) && '20px' }
    }

    const changeRadioButton = (event) => {
        const id = event?.target?.value;
        setOptionIdSelected(id);
        optionIdSelectedRef.current = id;
    }

    const setDefaultCheckedOption = (option) => optionIdSelected === option?.id;

    return (
        <>
            <div className="pdf-container">
                {showPdf && <DownloadPDF />}
            </div>           
            <div className="cmp-renewal-plan-column">
                <div className={`cmp-card-marketing-section ${computeMarketingCssStyle()}`}>
                    <div className="marketing-body"></div>
                </div>
                {data?.options && data?.options.map((option, index) => (
                    <>
                        <div className={computeClassName(data?.options, index)} key={option?.id}>
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
                                <p>{labels.quoteIdLabel}  {option?.quoteID ? option?.quoteID : 'No data provided'}</p>
                                <p>{labels.refNoLabel}  {option?.id}</p>
                                <p>{labels.expiryDateLabel}  {dateToString(option?.expiryDate.replace(/[zZ]/g, ''), "MM/dd/uu")}</p>
                            </div>
                            {isPlanSelected(option) && (
                                <div className="footer">
                                    <button
                                        onClick={renderPDF}
                                    >
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
                    </>
                ))}
            </div>
        </>
    );
}

export default RenewalPlanOptions;
