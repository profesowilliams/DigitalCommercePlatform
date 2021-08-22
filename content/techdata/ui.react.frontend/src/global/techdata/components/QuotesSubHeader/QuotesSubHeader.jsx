import React from "react";
import PropTypes from "prop-types";
import { getUrlParams } from "../../../../utils";
import { If } from "../../helpers/If";
import { dateToString } from "../../helpers/dates";

const QuotesSubHeader = ({
  label,
  title,
  dates = {},
}) => {
  const urlParams = getUrlParams();
  const { created='', expires='' } = dates;
  const getQuoteId = ({ id }) => id;
  return (
    <div className="cmp-td-quote-subheader">
      <div className="cmp-td-quote-subheader__sub-title">
        {urlParams.hasOwnProperty("id") ? (
          <>
            <span>{label}</span> {getQuoteId(urlParams)}
          </>
        ) : (
          <>
            <span>{label}</span> {title}
          </>
        )}
      </div>

      <div className="cmp-td-quote-subheader__dates">
        <If condition={created || expires}>
          <span className="date-created">Created: {dateToString(created)}</span>|
          <span className="date-expires">Expires: {dateToString(expires)}</span>
        </If>
      </div>
    </div>
  );
};

export default QuotesSubHeader;

QuotesSubHeader.propTypes = {
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  dates: PropTypes.object
};
