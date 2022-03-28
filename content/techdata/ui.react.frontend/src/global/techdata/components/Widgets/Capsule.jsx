import React from "react";

const DefaultCapsule = () => (
  <span className="td-capsule__text">This is a capsule</span>
);

const CloseBtn = ({ closeClick }) => {
  return (
    <span onClick={closeClick}>
      <i className="fas fa-times td-capsule__close"></i>
    </span>
  );
};

const Capsule /** Pill was taken 😔 */ = ({
  children = <DefaultCapsule />,
  closeClick = () => null,
  hasCloseBtn = false,
}) => (
  <div className="td-capsule">
    {children}
    {hasCloseBtn && <CloseBtn closeClick={closeClick} />}
  </div>
);

export default Capsule;
