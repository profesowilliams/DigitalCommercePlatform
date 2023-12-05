import React, { useState, useEffect } from 'react';
import BaseFlyout from '../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import { useOrderTrackingStore } from '../OrdersTrackingGrid/store/OrderTrackingStore';
import {
  SwitchOn,
  SwitchOnHovered,
  SwitchOnActive,
  SwitchOnDisabled,
  SwitchOffDisabled,
  SwitchOff,
  SwitchOffHovered,
  SwitchOffActive,
} from '../../../../fluentIcons/FluentIcons';
import useGet from '../../hooks/useGet';

const CustomSwitch = ({
  on,
  hovered = false,
  active = false,
  disabled = false,
}) => {
  const stateMap = {
    on: {
      disabled: <SwitchOnDisabled />,
      active: <SwitchOnActive />,
      hovered: <SwitchOnHovered />,
      default: <SwitchOn />,
    },
    off: {
      disabled: <SwitchOffDisabled />,
      active: <SwitchOffActive />,
      hovered: <SwitchOffHovered />,
      default: <SwitchOff />,
    },
  };

  const currentType = on ? 'on' : 'off';
  const component =
    stateMap[currentType][
      disabled
        ? 'disabled'
        : active
        ? 'active'
        : hovered
        ? 'hovered'
        : 'default'
    ];

  return component;
};

const SettingsFlyout = ({
  subheaderReference,
  isTDSynnex = true,
  labels = {},
  config,
}) => {
  const settingsFlyoutConfig = useOrderTrackingStore((st) => st.settingsFlyout);
  const effects = useOrderTrackingStore((st) => st.effects);
  const [isSwitchHovered, setIsSwitchHovered] = useState(false);
  const [isSwitchPressed, setIsSwitchPressed] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(true);

  const [apiResponse, isLoading, error] = useGet(
    `${config.uiProactiveServiceDomain}/v1`
  );

  const closeFlyout = () => {
    effects.setCustomState({
      key: 'settingsFlyout',
      value: { data: null, show: false },
    });
  };
  const disabled = false;

  const saveData = () => {
    // TO DO: send data to BE
    closeFlyout();
  };

  const handleSwitchMouseDown = () => {
    setIsSwitchPressed(true);
  };

  const handleSwitchMouseUp = () => {
    setIsSwitchPressed(false);
    setIsSwitchOn(!isSwitchOn);
  };

  const handleSwitchMouseOver = () => {
    setIsSwitchHovered(true);
  };

  const handleSwitchMouseLeave = () => {
    setIsSwitchHovered(false);
  };

  const buttonsSection = (
    <div className="cmp-flyout__footer-buttons settings">
      <button className="secondary" onClick={closeFlyout}>
        {getDictionaryValueOrKey(labels?.cancelSettingsChange)}
      </button>
      <button disabled={false} className="primary" onClick={saveData}>
        {getDictionaryValueOrKey(labels?.save)}
      </button>
    </div>
  );

  return (
    <BaseFlyout
      open={settingsFlyoutConfig?.show}
      onClose={closeFlyout}
      width="465px"
      anchor="right"
      subheaderReference={subheaderReference}
      titleLabel={getDictionaryValueOrKey('Notifications')}
      buttonLabel={getDictionaryValueOrKey('Download selected')}
      secondaryButtonLabel={getDictionaryValueOrKey('Clear all')}
      disabledButton={true}
      secondaryButton={null}
      isTDSynnex={isTDSynnex}
      buttonsSection={buttonsSection}
    >
      <section className="cmp-flyout__content settings">
        <div className="switch-wrapper">
          <p className="switch-label">
            {getDictionaryValueOrKey(labels?.switchLabel)}
          </p>
          <div
            className="switch-icon-wrapper"
            onMouseDown={handleSwitchMouseDown}
            onMouseUp={handleSwitchMouseUp}
            onMouseOver={handleSwitchMouseOver}
            onMouseLeave={handleSwitchMouseLeave}
          >
            <CustomSwitch
              on={isSwitchOn}
              active={isSwitchPressed}
              hovered={isSwitchHovered}
              disabled={disabled}
            />
          </div>
        </div>
      </section>
    </BaseFlyout>
  );
};

export default SettingsFlyout;
