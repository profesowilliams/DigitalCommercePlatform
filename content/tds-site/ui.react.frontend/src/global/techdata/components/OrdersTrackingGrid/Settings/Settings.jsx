import React, { useState } from 'react';
import {
  SettingsIcon,
  SettingsIconFilled,
} from '../../../../../fluentIcons/FluentIcons';
import '../../../../../../src/styles/TopIconsBar.scss';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';

const Settings = ({ settings }) => {
  const { setCustomState } = useOrderTrackingStore((st) => st.effects);
  const [settingsHovered, setSettingsHovered] = useState(false);

  const handleMouseOverSettings = () => {
    setSettingsHovered(true);
  };
  const handleMouseLeaveSettings = () => {
    setSettingsHovered(false);
  };
  const triggerSettingsFlyout = () => {
    setCustomState({
      key: 'settingsFlyout',
      value: { show: true, data: settings },
    });
  };

  return (
    <div
      onClick={triggerSettingsFlyout}
      onMouseOver={handleMouseOverSettings}
      onMouseLeave={handleMouseLeaveSettings}
      className="cmp-order-tracking-grid__settings"
    >
      {settingsHovered ? <SettingsIconFilled /> : <SettingsIcon />}
    </div>
  );
};

export default Settings;
