import React, { useEffect, useState } from "react";

import Loader from "../../Widgets/Loader";
import Button from "../../Widgets/Button";
import { usGet } from "../../../../../utils/api";
import { If } from "../../../helpers/If";
import Info from "../../common/quotes/DisplayItemInfo";
import { ANALYTICS_TYPES, pushEvent } from "../../../../../utils/dataLayerUtils";
import { LOCAL_STORAGE_KEY_USER_DATA } from "../../../../../utils/constants";
import { getUserDataInitialState } from "../../../../../utils/user-utils";

function CompanyInfo({ reseller, info, url, companyInfoChange }) {
  const initialAddress = reseller != null ? reseller[0] : {};
  const [editView, setEditView] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(0);
  const [savedAddressId, setSavedAddressId] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localReseller, setLocalReseller] = useState(null);
  const defaultReseller = {
    "companyName": "default",
    "name": "default",
    "addressNumber": "default",
    "line1": "",
    "line2": "",
    "line3": "",
    "city": "",
    "state": "",
    "country": "",
    "postalCode": "",
    "email": '',
    "phoneNumber": "",
    "salesOrganization": "",
  };
  const USER_DATA = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_USER_DATA));

  useEffect(() => {
    if (localReseller === null) {
      if (reseller?.companyName){
        setLocalReseller(reseller)
      } else {
        if (addresses.length === 0) {
          fetchCustomerAddress();
        }
        setLocalReseller(defaultReseller)
      }
    }
  }, [localReseller, reseller]);

  useEffect(() => {
    if (addresses.length === 1) {
      setSelectedAddressId(0);
      companyInfoChange(addresses[selectedAddressId]);
      setSavedAddressId(selectedAddressId);
    }
  }, [addresses]);

  const handleOptionChange = (e) => {
    setSelectedAddressId(+e.target.value);
  };

  const handleSubmitBtn = () => {
    companyInfoChange(addresses[selectedAddressId]);
    setEditView(false);
    setSavedAddressId(selectedAddressId);
  };

  const handleCancelBtn = (e) => {
    e.preventDefault();
    setEditView(false);
    setSelectedAddressId(savedAddressId);
  };

  const handleTitleClick = () => {
    handleCompanyInfoAnalytics();

    /* don't make API call if customer address was already fetched. */
    if (addresses.length !== 0) {
      setEditView(true);
      return;
    }
    setLoading(true);
    setEditView(true);

    fetchCustomerAddress();
  };

  const fetchCustomerAddress = async () => {
    try {
      const res = await usGet(
        `${url}?criteria=CUS&ignoreSalesOrganization=false`
      );
      const userName = `${USER_DATA?.firstName} ${USER_DATA?.lastName}`
      const data = res?.data?.content?.items[0];
      data.addresses.forEach(address => {
        address.companyName = data.name;
        address.name = userName;
        address.email = USER_DATA.email;
      });
      setAddresses(data["addresses"]);
    } catch (err) {
      throw new Error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyInfoAnalytics = () => {
    pushEvent(
      ANALYTICS_TYPES.events.click,
      {
        /** FOR REVIEWERS: is this ok like this?*/
        name: "Your Company Information",
        type: ANALYTICS_TYPES.types.button,
        category: ANALYTICS_TYPES.category.quotePreviewTableInteractions,
      },
    );
  };

  const CompanyInfo = () => {
    return (
      <div className="cmp-qp__company-info--address-group">
        <p>
          <Info>{initialAddress.name}</Info>
          <Info>{initialAddress.line1}</Info>
          <Info>{initialAddress.city}, {initialAddress.state} {initialAddress.zip}</Info>
          <Info>{initialAddress.country}</Info>
        </p>
        <p>
          <Info label="Email">{initialAddress.email}</Info>
          <Info label="Phone">{initialAddress.phoneNumber}</Info>
        </p>
      </div>
    );
  };

  const CompanyInfoEdit = () => {
    return (
      <div>
        {addresses.map((address, index) => {
          return (
            <div key={`address${index}`} className="form-check">
              <label>
                <input
                  type="radio"
                  name={`address${index}`}
                  value={index}
                  checked={selectedAddressId === index}
                  onChange={handleOptionChange}
                />
                {index === 0 ? <span>Default Address</span> : null}
                <span>
                  <b>{address.addressLine1}</b>
                </span>
                <span>
                  {address.city}, {address.state} {address.zip}
                </span>
              </label>
            </div>
          );
        })}
        <FormActions />
      </div>
    );
  };

  const FormActions = () => {
    return (
      <div className="form-group">
          <Button
            btnClass="cmp-quote-button cmp-qp--save-information"
            disabled={false}
            onClick={handleSubmitBtn}
          >
            {info.submitLabel}
          </Button>
          <Button
            btnClass="cmp-quote-button cmp-qp--cancel-information"
            disabled={false}
            onClick={handleCancelBtn}
          >
            {info.cancelLabel}
          </Button>
        </div>
    )
  }

  return (
    <div className="cmp-qp__company-info">
      <p onClick={handleTitleClick} className="cmp-qp__company-info--title">
        {info.yourCompanyHeaderLabel}
      </p>
      <If condition={localReseller}>
        <p className="cmp-qp__company-info--sub-title">
          {initialAddress.companyName}
        </p>
        {editView ? (
          <div className="cmp-qp__edit-mode">
            {addresses && !loading ? (
              <CompanyInfoEdit />
              ) : (
                <Loader visible={loading} />
                )}
          </div>
        ) : (
          <CompanyInfo />
          )}
      </If>
    </div>
  );
}

export default CompanyInfo;
