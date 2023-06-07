import React from 'react';
import Pill from './../../Widgets/Pill';

const OrderSearchCapsule = ({
  isSearchCapsuleVisible,
  handleCapsuleClose,
  handleCapsuleTextClick,
  label,
  capsuleSearchValue,
  inputValue,
}) => {
  return (
    <>
      {isSearchCapsuleVisible && (
        <Pill closeClick={handleCapsuleClose} hasCloseButton>
          <span onClick={handleCapsuleTextClick} className="td-capsule__text">
            {`${label}: ${capsuleSearchValue || inputValue}`}
          </span>
        </Pill>
      )}
    </>
  );
};
export default OrderSearchCapsule;
