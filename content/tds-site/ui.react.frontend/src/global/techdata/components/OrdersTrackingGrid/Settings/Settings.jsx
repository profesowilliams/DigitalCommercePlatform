import React, { useState } from 'react';
import { SettingsIcon } from '../../../../../fluentIcons/FluentIcons';
import '../../../../../../src/styles/TopIconsBar.scss';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';

const Settings = () => {
  const { setCustomState } = useOrderTrackingStore((st) => st.effects);

  const triggerSettingsFlyout = () => {
    setCustomState({
      key: 'settingsFlyout',
      value: { show: true },
    });
  };
  const isSettingsHovered = useState(false);

  return (
    <div
      onClick={triggerSettingsFlyout}
      className="cmp-order-tracking-grid__settings"
    >
      {isSettingsHovered ? (
        <SettingsIcon fill="#262626" className="icon-hover" />
      ) : (
        <SettingsIcon fill="#262626" className="icon-hover" />
      )}
    </div>
  );
};

export default Settings;
