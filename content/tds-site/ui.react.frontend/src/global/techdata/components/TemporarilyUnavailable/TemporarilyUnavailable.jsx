import React from 'react';
import { TemporarilyUnavailableIcon } from '../../../../fluentIcons/FluentIcons';

const TemporarilyUnavailable = ({ noAccessProps }) => {
  const { unavailableTitle, unavailableText } = noAccessProps;
  return (
    <div className="temporarily-unavailable__wrap">
      <div className="temporarily-unavailable__icon">
        <TemporarilyUnavailableIcon />
      </div>
      <div className="temporarily-unavailable__content">
        <div className="temporarily-unavailable__title">{unavailableTitle}</div>
        <div className="temporarily-unavailable__text">{unavailableText}</div>
      </div>
    </div>
  );
};
export default TemporarilyUnavailable;
