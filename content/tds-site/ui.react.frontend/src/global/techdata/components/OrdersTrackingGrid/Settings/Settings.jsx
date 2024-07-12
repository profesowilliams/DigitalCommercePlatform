import React from 'react';
import { SettingsIcon, SettingsIconFilled } from '../../../../../fluentIcons/FluentIcons';
import '../../../../../../src/styles/TopIconsBar.scss';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';
import Tooltip from '@mui/material/Tooltip';
import Hover from '../../Hover/Hover';

const Settings = ({ settings }) => {
  const { setCustomState } = useOrderTrackingStore((state) => state.effects);
  const uiTranslations = useOrderTrackingStore(
    (state) => state.uiTranslations
  );
  const translations = uiTranslations?.['OrderTracking.MainGrid.SettingsFlyout'];

  const triggerSettingsFlyout = () => {
    setCustomState({
      key: 'settingsFlyout',
      value: { show: true, data: settings },
    });
  };

  return (
    <Tooltip
      title={translations?.Tooltip}
      placement="top"
      arrow
      disableInteractive={true}
    >
      <div
        onClick={triggerSettingsFlyout}
        className="cmp-order-tracking-grid__settings"
      >
        <Hover onHover={<SettingsIconFilled />}>
          <SettingsIcon />
        </Hover>
      </div>
    </Tooltip>
  );
};

export default Settings;