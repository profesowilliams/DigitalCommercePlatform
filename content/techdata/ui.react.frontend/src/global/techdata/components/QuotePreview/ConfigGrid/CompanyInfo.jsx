import React, { useState } from 'react';
import Button from '../../Widgets/Button';

function CompanyInfo({info}) {
    const [defaultAddress, setDefaultAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState('');

    const handleOptionChange = e => {
        setSelectedAddress(e.target.value)
    };

    const handleDefaultAddress = () => {
        setDefaultAddress(prevDefaultAddress => !prevDefaultAddress);
    };

    return (
        <div className="cmp-qp__company-info">
            <p onClick={handleDefaultAddress} className="cmp-qp__company-info--title">{info.yourCompanyHeaderLabel}</p>
            <p className="cmp-qp__company-info--sub-title">Sis Margaret’s Inc.</p>
            {!defaultAddress && 
                <div className="cmp-qp__company-info--address-group">
                    <p>
                        <span>Wade Wilson</span>
                        <span>9071 Santa Monica Blvd</span>
                        <span>West Hollywood, CA 90069</span>
                        <span>United States</span>
                    </p>
                    <p>
                        <span>Email: dpool@sismargarets.com</span>
                        <span>Phone: (424) 777-8399</span>
                    </p>
                </div>
            }
            {defaultAddress &&
                <div className="cmp-qp__default-address">
                    <form>
                        <div className="form-check">
                            <label>
                                <input type="radio" name="address1" 
                                        value={"Default address"}  
                                        checked={selectedAddress === "Default address"} 
                                        onChange={handleOptionChange} />
                                <span>Default Address</span>
                                <span><b>9071 Santa Monica Blvd</b></span>
                                <span>West Hollywood, CA 90069</span>
                            </label>
                        </div>
                        <div className="form-check">
                            <label>
                                <input type="radio" name="addres2" 
                                        value={"Second address"} 
                                        checked={selectedAddress === "Second address"} 
                                        onChange={handleOptionChange} />
                                <span><b>28655 S Dixie Hwy</b></span>
                                <span>Homestead, FL 33033</span>
                            </label>
                        </div>
                        <div className="form-check">
                            <label>
                                <input type="radio" name="address3" 
                                        value={"Third address"}
                                        checked={selectedAddress === "Third address"}
                                        onChange={handleOptionChange} />
                                <span><b>1151 Tower Blvd</b></span>
                                <span>Lake Wales, FL 33853</span>
                            </label>
                        </div>
                        <div className="form-group">
                            <Button btnClass={"cmp-qp--save-address"} disabled={false} onClick={handleDefaultAddress}>
                                {"Submit"}
                            </Button>
                            <Button btnClass={"cmp-qp--cancel-address"} disabled={false} onClick={handleDefaultAddress}>
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