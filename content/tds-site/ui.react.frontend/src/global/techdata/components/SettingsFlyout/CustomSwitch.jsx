import React from 'react';

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

export default CustomSwitch;
