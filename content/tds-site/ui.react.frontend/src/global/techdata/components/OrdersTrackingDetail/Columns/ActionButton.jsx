import React, { useState } from 'react';
import { EllipsisIcon } from '../../../../../fluentIcons/FluentIcons';
import MenuActions from '../Header/MenuActions';

const ActionsButton = ({ line, element, index, menuActionsItems }) => {
  const iconStyle = {
    color: '#21314D',
    cursor: 'pointer',
    fontSize: '1.2rem',
    width: '1.3rem',
  };
  const [actionsDropdownVisible, setActionsDropdownVisible] = useState(false);
  const multiple = line?.lineDetails?.length > 1;
  const isLastElement = multiple && index === line?.lineDetails?.length - 1;
  const isSingleElement = !multiple;

  const isShipment = element?.isShipment === true;

  const handleActionMouseOver = () => {
    setActionsDropdownVisible(true);
  };
  const handleActionMouseLeave = () => {
    setActionsDropdownVisible(false);
  };

  return (
    <div
      className={`cmp-order-tracking-grid-details__splitLine${
        isSingleElement || isLastElement
          ? '__separateLine'
          : '__separateLineMultiple'
      } cmp-order-tracking-grid-details__splitLine--centerAlignActionButton`}
      onMouseOver={handleActionMouseOver}
      onMouseLeave={handleActionMouseLeave}
    >
      <EllipsisIcon
        className="cmp-order-tracking-grid-details__splitLine__separateLineText"
        style={iconStyle}
      />
      {actionsDropdownVisible && isShipment && (
        <div
          className="actions-dropdown"
          onMouseOver={handleActionMouseOver}
          onMouseLeave={handleActionMouseLeave}
        >
          <MenuActions items={menuActionsItems} />
        </div>
      )}
    </div>
  );
};

export default ActionsButton;
