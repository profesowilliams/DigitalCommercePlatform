import React, { useState, useEffect } from "react";
import ConfigGrid from "./ConfigGrid/ConfigGrid";
import RenewalPreviewGrid from "./RenewalPreviewGrid/RenewalPreviewGrid";
import useGet from "../../hooks/useGet";
import Loader from "../Widgets/Loader";
import { getUrlParams } from "../../../../utils";

function RenewalsDetails(props) {
  const componentProp = JSON.parse(props.componentProp);
  const { id = "41103698521", type = "renewal" } = getUrlParams();
  const [apiResponse, isLoading] = useGet(
    `${componentProp.uiServiceEndPoint}?id=${id}&type=${type}`
  );
  const [renewalsDetails, setRenewalsDetails] = useState(null);

  componentProp.productLines.agGridLicenseKey = componentProp.agGridLicenseKey;

  useEffect(() => {
    if (apiResponse?.content?.details) {
      setRenewalsDetails(apiResponse?.content?.details[0]);
    }
  }, [apiResponse]);

  return (
    <div className="cmp-quote-preview cmp-renewal-preview">
      {renewalsDetails ? (
        <section>
          <ConfigGrid data={renewalsDetails} gridProps={componentProp} />
          <RenewalPreviewGrid
            data={renewalsDetails}
            gridProps={componentProp.productLines}
            shopDomainPage={componentProp.shopDomainPage}
          />
        </section>
      ) : (
        <Loader visible={isLoading} />
      )}
    </div>
  );
}

export default RenewalsDetails;
