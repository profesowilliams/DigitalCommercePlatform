import React from "react";

function RenewalPlanDetails(props) {
    const { labels } = props;
    return (
        <div className="cmp-renewal-plan-column">
            <div className="card">
                <div className="header">
                    <div className="leftHeader">
                        <h4><input type="radio"></input> &nbsp;&nbsp;1 Year, basic</h4>
                    </div>
                    <div className="rightHeader"><h4>$99</h4></div>
                    <div className="clear"></div>
                </div>
                <div className="planDetails">
                    <span className="currentPlan">Current plan</span>
                    <p>{labels.quoteIdLabel} 123456</p>
                    <p>{labels.refNoLabel} 123456</p>
                    <p>{labels.expiryDateLabel} 10/20/2023</p>
                </div>
                <div className="footer">
                    <button>
                        <i className="fas fa-file-pdf"></i>
                        &nbsp;&nbsp;{labels.downloadPDFLabel}
                    </button>
                    |
                    <button>
                        <i className="fas fa-file-excel"></i>
                        &nbsp;&nbsp;{labels.downloadXLSLabel}
                    </button>
                    |
                    <button>
                        <i className="far fa-eye"></i>
                        &nbsp;&nbsp;{labels.seeDetailsLabel}
                    </button>
                </div>
            </div>
            <div className="card">
                <div className="header">
                    <div className="leftHeader">
                        <h4><input type="radio"></input> &nbsp;&nbsp;1 Year, basic</h4>
                    </div>
                    <div className="rightHeader"><h4>$99</h4></div>
                    <div className="clear"></div>
                </div>
                <div className="planDetails">
                    <span className="currentPlan">Current plan</span>
                    <p>{labels.quoteIdLabel} 123456</p>
                    <p>{labels.refNoLabel} 123456</p>
                    <p>{labels.expiryDateLabel} 10/20/2023</p>
                </div>
                <div className="footer">
                    <button>
                        <i className="fas fa-file-pdf"></i>
                        &nbsp;&nbsp;{labels.downloadPDFLabel}
                    </button>
                    |
                    <button>
                        <i className="fas fa-file-excel"></i>
                        &nbsp;&nbsp;{labels.downloadXLSLabel}
                    </button>
                    |
                    <button>
                        <i className="far fa-eye"></i>
                        &nbsp;&nbsp;{labels.seeDetailsLabel}
                    </button>
                </div>
            </div>
            <div className="card">
                <div className="header">
                    <div className="leftHeader">
                        <h4><input type="radio"></input> &nbsp;&nbsp;1 Year, basic</h4>
                    </div>
                    <div className="rightHeader"><h4>$99</h4></div>
                    <div className="clear"></div>
                </div>
                <div className="planDetails">
                    <span className="currentPlan">Current plan</span>
                    <p>{labels.quoteIdLabel} 123456</p>
                    <p>{labels.refNoLabel} 123456</p>
                    <p>{labels.expiryDateLabel} 10/20/2023</p>
                </div>
                <div className="footer">
                    <button>
                        <i className="fas fa-file-pdf"></i>
                        &nbsp;&nbsp;{labels.downloadPDFLabel}
                    </button>
                    |
                    <button>
                        <i className="fas fa-file-excel"></i>
                        &nbsp;&nbsp;{labels.downloadXLSLabel}
                    </button>
                    |
                    <button>
                        <i className="far fa-eye"></i>
                        &nbsp;&nbsp;{labels.seeDetailsLabel}
                    </button>
                </div>
            </div>

        </div>
    );
}

export default RenewalPlanDetails;
