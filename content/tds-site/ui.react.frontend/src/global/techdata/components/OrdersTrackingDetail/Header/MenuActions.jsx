import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

const MenuActions = ({ items = [] }) => {
  return (
    <ul>
      {items.map((item) => (
        <li
          key={item.label}
          className={!item.condition ? 'disabled' : null}
          onClick={item.condition ? item.onClick : null}
        >
          {getDictionaryValueOrKey(item.label)}
        </li>
      ))}
    </ul>
  );
};
export default MenuActions; 
