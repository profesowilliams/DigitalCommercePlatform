import React from "react";
import { CloseIcon } from "../../../../fluentIcons/FluentIcons";
import { useRenewalGridState } from '../../components/RenewalsGrid/store/RenewalsStore'

const DefaultCapsule = () => (
  <span className="td-capsule__text">This is a capsule</span>
);

const CloseBtn = ({ closeClick }) => {
  const isTDSynnex = useRenewalGridState( state => state.isTDSynnex || false);
  return (
    <span onClick={closeClick}>
      {isTDSynnex 
        ? <CloseIcon/>
        : <i className="fas fa-times td-capsule__close"></i>}
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
