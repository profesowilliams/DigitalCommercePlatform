import React from 'react'

function TotalColumn({data}) {
  return (<>{`${data?.priceFormatted} ${data?.currency}`}</>
  )
}

export default TotalColumn