import React from 'react';
import { addSeparator } from '../../../../../../utils/utils';

export const AddressDetails = ({ address }) => {
  const { name, line1, postalCode, city, stateName } = address;
  
  return (
    <div className="cmp-renewals-qp__edit-panel__ship-to">
      {name && (
        <div className="cmp-renewals-qp__edit-panel__ship-to--item">
          <div className="cmp-renewals-qp__edit-panel__ship-to--name">
            <label>{name}</label>
          </div>
          <div>
            {line1}
          </div>
          <div>
            {addSeparator([postalCode, city, stateName])}
          </div>
        </div>
      )}
    </div>
  );
};