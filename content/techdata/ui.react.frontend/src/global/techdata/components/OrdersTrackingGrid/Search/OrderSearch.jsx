import React from 'react'
import { SearchIcon } from '../../../../../fluentIcons/FluentIcons'

function OrderSearch() {
  //using it as a container for the order tracking state and refactoring it to use a more generic search component
  return (
    <div className='cmp-order-tracking-grid__search'>
        <label>Search</label>
        <SearchIcon className="search-icon__light"/>
    </div>
  )
}

export default OrderSearch