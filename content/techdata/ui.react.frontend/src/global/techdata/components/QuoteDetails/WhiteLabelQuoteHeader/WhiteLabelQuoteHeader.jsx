import React, { useState, useEffect } from "react";
import { getUrlParams } from "../../../../../utils";
import WhiteLabelQuoteContactInfo from "./WhiteLabelQuoteContactInfo";
import WhitelabelExportConfiguration from "./WhitelabelExportConfiguration";
import useGet from "../../../hooks/useGet";
import Loader from "../../Widgets/Loader";
import FullScreenLoader from "../../Widgets/FullScreenLoader";

const WhiteLabelQuoteHeader = ({ componentProp, logoUploadHandler }) => {
  const { uiServiceEndPoint, whiteLabel } = JSON.parse(componentProp);
  const { information, titleLabel, subtitleLabel, checkboxItems } = whiteLabel || {};

  const { id } = getUrlParams();
  const [response, loading] = useGet(`${uiServiceEndPoint}?id=${id}`);
  const [quoteDetails, setQuoteDetails] = useState(null);

  useEffect(() => {
    response?.content?.details && setQuoteDetails(response.content.details);
  }, [response]);

  return quoteDetails ? (
    <div className="cmp-whitelabelquoteheader">
      <WhitelabelExportConfiguration 
        titleLabel={titleLabel} 
        subtitleLabel={subtitleLabel} 
        checkboxItems={checkboxItems} 
        information={information}
        logoUploadHandler = {logoUploadHandler}
        base64LogoHandler={(base64String)=>{
          console.log("base64String :: ", base64String)
        }}
        optionsHandeler = {(optionsList)=>{
          console.log('optionsList ::', optionsList);
        }}

        />
      <WhiteLabelQuoteContactInfo
        label={
          information?.yourCompanyHeaderLabel
            ? information?.yourCompanyHeaderLabel
            : ""
        }
        contact={quoteDetails?.reseller}
      />
      <WhiteLabelQuoteContactInfo
        label={
          information?.endUserHeaderLabel ? information.endUserHeaderLabel : ""
        }
        contact={quoteDetails?.endUser}
      />
    </div>
  ) : loading ? (
    <FullScreenLoader>
      <Loader visible={true}></Loader>
    </FullScreenLoader>
  ) : (
        <div className="cmp-error">
          <div className="cmp-error__header">
            Error {error.code && error.code} {error.status && error.status}.
          </div>
          <div className="cmp-error__message">
            {" "}
            {error.code === 401 || error.status === 401
              ? "You have to be logged in to use this feature."
              : "Contact your site administrator."}
          </div>
        </div>
      );
};

export default WhiteLabelQuoteHeader;
