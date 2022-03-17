import { PDFDownloadLink } from '@react-pdf/renderer';
import React, { useEffect, useRef, useState } from "react";
import { generateExcelFileFromPost } from "../../../../utils/utils";
import { dateToString, thousandSeparator } from "../../helpers/formatting";
import useGet from "../../hooks/useGet";
import { openPDF } from "../PDFWindow/PDFRenewalWindow";
import PDFRenewalPlanOption from "./PDFRenewalPlanOption";
import { useRenewalGridState } from "./store/RenewalsStore";

function RenewalPlanOptions({ labels, data }) {
    const effects = useRenewalGridState(st => st.effects);
    const renewalOptionState = useRenewalGridState(st => st.renewalOptionState);
    const aemConfig = useRenewalGridState((state) => state.aemConfig);
    const { detailUrl = "", exportXLSRenewalsEndpoint = "", renewalDetailsEndpoint = "" } = aemConfig;
    const selectPlan = (value) => effects.setCustomState({ key: 'renewalOptionState', value })
    const isPlanSelected = option => option?.contractDuration + " " + data?.support === renewalOptionState;
    const isCurrentPlan = plan => plan.quoteCurrent;
    const [showPdf, setShowPdf] = useState(false);
    const PDFContainerRef = useRef(null);
    const dataToPush = (name) => ({
        type: ANALYTICS_TYPES.types.button,
        category: ANALYTICS_TYPES.category.renewalsActionColumn,
        name,
    });

    useEffect(() => {
        const currentPlan = data?.options.find((plan) => isCurrentPlan(plan));
        if (currentPlan) {
            const value = currentPlan?.contractDuration + " " + data?.support
            effects.setCustomState({ key: 'renewalOptionState', value });
        }
    }, [])

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

    return (
        <>
            <div className="pdf-container" ref={PDFContainerRef}>
                {showPdf && <DownloadPDF />}
            </div>
            <div className="cmp-renewal-plan-column">
                {data?.options && data?.options.map((option, index) => (
                    <>
                        <div className={computeClassName(data?.options, index)} key={option?.id}>
                            <div className="header">
                                <div className="leftHeader">
                                    <h4>
                                        <input
                                            key={Math.random()}
                                            value={isPlanSelected(option)}
                                            defaultChecked={isPlanSelected(option)}
                                            id={option?.id}
                                            type="radio"
                                            onClick={() => selectPlan(option?.contractDuration + " " + data?.support)}
                                        />
                                        <label htmlFor={option?.id} style={{ fontSize: isPlanSelected(option) && '18px' }}>&nbsp;&nbsp;{option?.contractDuration}, {data?.support}</label></h4>
                                </div>
                                <div className="rightHeader"><h4 htmlFor={option?.id} style={{ fontSize: isPlanSelected(option) && '18px' }}>$ {thousandSeparator(option?.total)}</h4></div>
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
                                        &nbsp;&nbsp;{labels.downloadPDFLabel}
                                    </button>
                                    <span className="vertical-separator"></span>
                                    <button onClick={() => exportXlsPlan(option?.id)}>
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
        </>
    );
}

export default RenewalPlanOptions;
