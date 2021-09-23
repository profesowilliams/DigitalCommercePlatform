import React, { useState } from 'react';
import Button from '../../Widgets/Button';

function CompanyInfo({data, info}) {
    const {content: {items}} = data;
    const res = items[0];
    const [defaultAddress, setDefaultAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(1);

    const handleOptionChange = e => {
        setSelectedAddress(+(e.target.value))
    };

    const handleDefaultAddress = () => {
        setDefaultAddress(prevDefaultAddress => !prevDefaultAddress);
    };

    return (
        <div className="cmp-qp__company-info">
            <p onClick={handleDefaultAddress} className="cmp-qp__company-info--title">{info.yourCompanyHeaderLabel}</p>
            <p className="cmp-qp__company-info--sub-title">{res.name}</p>
            {!defaultAddress && 
                <div className="cmp-qp__company-info--address-group">
                    <p>
                        {/* <span>Wade Wilson</span> */}
                        <span>{selectedAddress ? res.addresses[0]['addressLine' + '' + selectedAddress] : res.addresses[0].addressLine1}</span>
                        <span>{res.addresses[0].city}, {res.addresses[0].state} {res.addresses[0].zip}</span>
                        <span>{res.addresses[0].country}</span>
                    </p>
                    <p>
                        <span>Email: {res.addresses[0].email || 'NA'}</span>
                        <span>Phone: {res.addresses[0].phone}</span>
                    </p>
                </div>
            }
            {defaultAddress &&
                <div className="cmp-qp__edit-mode">
                    <form>
                        <div className="form-check">
                            <label>
                                <input type="radio" name="address1" 
                                        value={1}  
                                        checked={selectedAddress === 1} 
                                        onChange={handleOptionChange} />
                                <span>Default Address</span>
                                <span><b>{res.addresses[0].addressLine1}</b></span>
                                {/* commenting out as there's nothing from API as of now */}
                                {/* <span>West Hollywood, CA 90069</span> */}
                            </label>
                        </div>
                        <div className="form-check">
                            <label>
                                <input type="radio" name="addres2" 
                                        value={2} 
                                        checked={selectedAddress === 2} 
                                        onChange={handleOptionChange} />
                                <span><b>{res.addresses[0].addressLine2}</b></span>
                                {/* <span>Homestead, FL 33033</span> */}
                            </label>
                        </div>
                        <div className="form-check">
                            <label>
                                <input type="radio" name="address3" 
                                        value={3}
                                        checked={selectedAddress === 3}
                                        onChange={handleOptionChange} />
                                <span><b>{res.addresses[0].addressLine3}</b></span>
                                {/* <span>Lake Wales, FL 33853</span> */}
                            </label>
                        </div>
                        <div className="form-group">
                            <Button btnClass="cmp-qp--save-information" disabled={false} onClick={handleDefaultAddress}>
                                {"Submit"}
                            </Button>
                            <Button btnClass="cmp-qp--cancel-information" disabled={false} onClick={handleDefaultAddress}>
                                {"Cancel"}
                            </Button>
                        </div>
                    </form>
                </div>
            }
        </div>
    )
}

export default CompanyInfo;
