import React from 'react'

function RenewalManufacturer({data}) {
    const {product = [false,false]} = data;
    const [techdata, manufacturer] = product;
    const manufacturerId = manufacturer?.id;
  return (
    <div className='manufacturer-id'>{manufacturerId}</div>
  )
}

export default RenewalManufacturer