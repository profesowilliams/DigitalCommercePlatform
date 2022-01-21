import React, { useState } from 'react';
import Button from './Button';

const WidgetList = ({ items, onChange, openlist, buttonLabel }) => {
  const [localSelected, setLocalSelected] = useState(false);
  const onSelect = (item) => {
    setLocalSelected(item);
  }
  const confirm = () =>{
    onChange(localSelected);
  }
 
  return(
    <div className={`cmp-widget-list__list-wrapper ${ openlist ? 'cmp-widget-list__list-wrapper--open' : '' }`}>
      <ul className="cmp-widget-list__list-wrapper-content">
        {items.map((item) => {
          return <li key={Symbol(item.id).toString()}>
            <a className={localSelected.id === item.id ? 'cmp-widget-list__list-item--active':''} onClick={() => onSelect(item)}>
              <i className="fas fa-check"></i> {item.name}
            </a>
          </li>
        })}
      </ul>
      <Button btnClass="cmp-quote-button" disabled={!localSelected} onClick={confirm}>{buttonLabel}</Button>
    </div>
  );
};

export default WidgetList;
