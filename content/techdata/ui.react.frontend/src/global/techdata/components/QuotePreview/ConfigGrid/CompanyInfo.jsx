import React, { useState } from "react";

import Loader from "../../Widgets/Loader";
import Button from "../../Widgets/Button";
import { usGet } from "../../../../../utils/api";

function CompanyInfo({ reseller, info, url, companyInfoChange }) {
  const initialAddress = reseller[0];
  const [editView, setEditView] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(0);
  const [savedAddressId, setSavedAddressId] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

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
    /* don't make API call if customer address was already fetched. */
    if (addresses.length !== 0) {
      setEditView(true);
      return;
    }
    setLoading(true);
    setEditView(true);

    const fetchCustomerAddress = async () => {
      try {
        const res = await usGet(
          `${url}?criteria=CUS&ignoreSalesOrganization=false`
        );
        const data = res?.data?.content?.items[0];
        setAddresses(data["addresses"]);
      } catch (err) {
        throw new Error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerAddress();
  };

  const CompanyInfo = () => {
    return (
      <div className="cmp-qp__company-info--address-group">
        <p>
          <span>{initialAddress.name}</span>
          <span>{initialAddress.line1}</span>
          <span>
            {initialAddress.city}, {initialAddress.state}{" "}
            {initialAddress.zip}
          </span>
          <span>{initialAddress.country}</span>
        </p>
        <p>
          <span>Email: {initialAddress.email || "NA"}</span>
          <span>Phone: {initialAddress.phoneNumber}</span>
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
            btnClass="cmp-qp--save-information"
            disabled={false}
            onClick={handleSubmitBtn}
          >
            {info.submitLabel}
          </Button>
          <Button
            btnClass="cmp-qp--cancel-information"
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
    </div>
  );
}

export default CompanyInfo;
