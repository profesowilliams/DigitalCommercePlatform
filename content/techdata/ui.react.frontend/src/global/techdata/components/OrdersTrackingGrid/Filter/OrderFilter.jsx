import React from 'react'
import { OptionsIcon } from '../../../../../fluentIcons/FluentIcons'
import "../../../../../../src/styles/TopIconsBar.scss"

function OrderFilter() {
  return (
    <div className='cmp-order-tracking-grid__filter'>
        <OptionsIcon fill="#262626" className="icon-hover"/>
    </div>
  )
}

export default OrderFilter