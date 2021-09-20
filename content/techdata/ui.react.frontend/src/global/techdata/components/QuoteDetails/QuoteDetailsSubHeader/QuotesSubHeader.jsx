import React from "react";
import { getUrlParams } from "../../../../../utils";
import { If } from "../../../helpers/If";
import { dateToString } from "../../../helpers/dates";

const QuotesSubHeader = ({
  label,  
  title,
  quoteDetails={},
  dateLabels = {},
}) => {
  const urlParams = getUrlParams();
  const {createdDateLabel,expiresDateLabel}= dateLabels;
  const {created, expires} = quoteDetails;
  const getQuoteId = ({ id }) => id;
  return (
    <div className="cmp-td-quote-subheader">
      <div className="cmp-td-quote-subheader__sub-title">
        {urlParams.hasOwnProperty("id") ? (
          <>
            <span>{label}: </span> {getQuoteId(urlParams)}
          </>
        ) : (
          <>
            <span>{label}: </span> {title}
          </>
        )}
      </div>

      <div className="cmp-td-quote-subheader__dates">
        <If condition={createdDateLabel || expiresDateLabel}>
          <span className="date-created">
            {createdDateLabel}: {dateToString(created)}
          </span>
          |
          <span className="date-expires">
            {expiresDateLabel}: {dateToString(expires)}
          </span>
        </If>
      </div>
    </div>
  );
};

export default QuotesSubHeader;
