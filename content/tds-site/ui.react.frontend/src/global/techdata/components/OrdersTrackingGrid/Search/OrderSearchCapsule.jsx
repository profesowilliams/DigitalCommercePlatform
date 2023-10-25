import React from 'react';
import Pill from './../../Widgets/Pill';

const OrderSearchCapsule = ({
  handleCapsuleClose,
  handleCapsuleTextClick,
  label,
  capsuleSearchValue,
  inputValue,
}) => {
  return (
    <Pill closeClick={handleCapsuleClose} hasCloseButton>
      <span onClick={handleCapsuleTextClick} className="td-capsule__text">
        {`${label}: ${capsuleSearchValue || inputValue}`}
      </span>
    </Pill>
  );
};
export default OrderSearchCapsule;
