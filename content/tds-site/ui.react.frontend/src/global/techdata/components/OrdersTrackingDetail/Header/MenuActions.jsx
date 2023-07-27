import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

const MenuActions = ({ items = [] }) => {
  return (
    <ul>
      {items.map(
        (item) =>
          item.condition && (
            <li key={item.label} onClick={item.onClick}>
              {getDictionaryValueOrKey(item.label)}
            </li>
          )
      )}
    </ul>
  );
};
export default MenuActions;
