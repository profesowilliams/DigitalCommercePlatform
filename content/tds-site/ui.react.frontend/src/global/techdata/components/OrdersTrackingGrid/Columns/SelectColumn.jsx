import React, { useEffect, useState, useMemo } from 'react'
import { Icon } from '@iconify/react';

function SelectColumn({data, eventProps}) {
  const [isToggled, setIsToggled] = useState(false);
  
  // removed unnecessary useEffect, state change will actually rerender the component
  // added useMemo for future optimization, when another state or props change will trigger a rerender with stale value of `isToggle`
  useMemo(() => eventProps.node.setExpanded(isToggled), [isToggled])

  const toggleDetails = () => {
    setIsToggled(!isToggled)
  }

  return (
    <div className='cmp-order-tracking-grid__select-column' onClick={toggleDetails}>
      <input onClick={e => e.stopPropagation()} className='cmp-order-tracking-grid__select-column__checkbox' type="checkbox" name="ordertracking-checked" id="" />
      <Icon className='cmp-order-tracking-grid__select-column__caret' icon={isToggled ? "ph:caret-down-light" : "ph:caret-right-light"} />
    </div>
  )
}

export default SelectColumn