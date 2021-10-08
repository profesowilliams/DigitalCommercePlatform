import React, { useState } from "react";

import Loader from "../../Widgets/Loader";
import Button from "../../Widgets/Button";
import { usGet } from "../../../../../utils/api";

function CompanyInfo({ reseller, info, url }) {
  const initialAddress = reseller[0];
  const [editView, setEditView] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(initialAddress);
  const [addressIndex, setAddressIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (e) => {
    setAddressIndex(+e.target.value);
  };

  const handleCancelBtn = (e) => {
    e.preventDefault();
    setEditView(false);
  };

  const handleDefaultAddress = () => {
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
        console.log(err);
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
          <span>{selectedAddress.name}</span>
          <span>{selectedAddress.line1}</span>
          <span>
            {selectedAddress.city}, {selectedAddress.state}{" "}
            {selectedAddress.zip}
          </span>
          <span>{selectedAddress.country}</span>
        </p>
        <p>
          <span>Email: {selectedAddress.email || "NA"}</span>
          <span>Phone: {selectedAddress.phoneNumber}</span>
        </p>
      </div>
    );
  };

  const CompanyInfoEdit = () => {
    return (
      <form>
        {addresses.map((address, index) => {
          return (
            <div key={`address${index}`} className="form-check">
              <label>
                <input
                  type="radio"
                  name={`address${index}`}
                  value={index}
                  checked={addressIndex === index}
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
      </form>
    );
  };

  const FormActions = () => {
    return (
      <div className="form-group">
          <Button
            btnClass="cmp-qp--save-information"
            disabled={false}
            onClick={handleDefaultAddress}
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
      <p onClick={handleDefaultAddress} className="cmp-qp__company-info--title">
        {info.yourCompanyHeaderLabel}
      </p>
      <p className="cmp-qp__company-info--sub-title">
        {selectedAddress.companyName}
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
