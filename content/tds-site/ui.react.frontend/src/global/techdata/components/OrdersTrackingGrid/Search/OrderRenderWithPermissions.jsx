import React from 'react';
import { isHouseAccount } from '../../../../../utils/user-utils';

const OrderRenderWithPermissions = ({ option, changeHandler }) => {
  const hasNotPrivilege = option?.showIfIsHouseAccount && !isHouseAccount();
  if (hasNotPrivilege) return <></>;
  return (
    <>
      <label onClick={() => changeHandler(option)}>{option.searchLabel}</label>
    </>
  );
};
export default OrderRenderWithPermissions;
