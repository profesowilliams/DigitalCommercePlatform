import React from 'react';
import { CloseIcon } from '../../../../fluentIcons/FluentIcons';

const DefaultCapsule = () => (
  <span className="td-capsule__text">This is a capsule</span>
);

const Pill = ({
  children = <DefaultCapsule />,
  closeClick = () => null,
  hasCloseButton = false,
}) => (
  <div className="td-capsule">
    {children}
    {hasCloseButton && <CloseIcon onClick={closeClick} />}
  </div>
);

export default Pill;
