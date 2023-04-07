import React, {useState} from 'react'
import { OptionsIcon, OptionsIconFilled } from '../../../../../fluentIcons/FluentIcons'
import "../../../../../../src/styles/TopIconsBar.scss"

function OrderFilter() {
  const [isFilterHovered, setIsFilterHovered] = useState(false);
  const handleMouseOverFilter = () => {
    setIsFilterHovered(true);
  }
  const handleMouseLeaveFilter = () => {
    setIsFilterHovered(false);
  }
  return (
    <div className='cmp-order-tracking-grid__filter' onMouseOver={handleMouseOverFilter} onMouseLeave={handleMouseLeaveFilter}>
        {isFilterHovered?<OptionsIconFilled fill="#262626" className="icon-hover"/>:<OptionsIcon fill="#262626" className="icon-hover"/>}
    </div>
  )
}

export default OrderFilter