import React from 'react';
import { isHouseAccount } from '../../../../../utils/user-utils';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

const OrderRenderWithPermissions = ({ option, changeHandler }) => {
  const hasNotPrivilege = option?.showIfIsHouseAccount && !isHouseAccount();
  if (hasNotPrivilege) return <></>;
  return (
    <>
      <label onClick={() => changeHandler(option)}>
        {getDictionaryValueOrKey(option.searchLabel)}
      </label>
    </>
  );
};
export default OrderRenderWithPermissions;
