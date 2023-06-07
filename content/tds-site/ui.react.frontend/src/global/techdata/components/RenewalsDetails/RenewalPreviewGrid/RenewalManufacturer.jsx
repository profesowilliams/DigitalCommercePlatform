import React from 'react'

export const getRenewalManufacturer = (data) => {
  const {product = [false,false]} = data;
  const [techdata, manufacturer] = product;
  return manufacturer?.id;
}

function RenewalManufacturer({data}) {
    const manufacturerId = getRenewalManufacturer(data);
  return (
    <div className='manufacturer-id'>{manufacturerId}</div>
  )
}

export default RenewalManufacturer