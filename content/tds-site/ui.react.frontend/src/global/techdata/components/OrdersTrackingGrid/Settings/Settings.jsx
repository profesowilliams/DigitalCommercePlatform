import React, { useState, useEffect } from 'react';
import { SettingsIcon } from '../../../../../fluentIcons/FluentIcons';
import '../../../../../../src/styles/TopIconsBar.scss';

const Settings = () => {
  const handleClick = () => {};
  const isSettingsHovered = useState(false);

  return (
    <div onClick={handleClick} className="cmp-order-tracking-grid__settings">
      {isSettingsHovered ? (
        <SettingsIcon fill="#262626" className="icon-hover" />
      ) : (
        <SettingsIcon fill="#262626" className="icon-hover" />
      )}
    </div>
  );
};

export default Settings;
