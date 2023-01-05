import React from 'react'

function TotalColumn({data}) {
  return (<div className='cmp-price-column'>{`${data?.priceFormatted} ${data?.currency}`}</div>
  )
}

export default TotalColumn