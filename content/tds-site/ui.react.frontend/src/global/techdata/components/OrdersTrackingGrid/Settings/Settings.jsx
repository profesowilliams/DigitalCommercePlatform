import React from 'react';
import {
  SettingsIcon,
  SettingsIconFilled,
} from '../../../../../fluentIcons/FluentIcons';
import '../../../../../../src/styles/TopIconsBar.scss';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';
import Tooltip from '@mui/material/Tooltip';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import Hover from '../../Hover/Hover';

const Settings = ({ settings, gridConfig }) => {
  const { setCustomState } = useOrderTrackingStore((state) => state.effects);

  const triggerSettingsFlyout = () => {
    setCustomState({
      key: 'settingsFlyout',
      value: { show: true, data: settings },
    });
  };

  return (
    <Tooltip
      title={getDictionaryValueOrKey(gridConfig?.settingsTooltip)}
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
