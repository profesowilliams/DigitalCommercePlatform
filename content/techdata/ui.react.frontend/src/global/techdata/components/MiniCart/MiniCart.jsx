import React, { useEffect, useState } from 'react';
import { get } from '../../../../utils/api';

const MiniCart = ({componentProp}) => {
  const { maxItems, endpoint } = JSON.parse(componentProp);
  const [cartItems, setCartItems] = useState(0);
  const [cartActive, setCartActive] = useState(false);
  useEffect(async() => {
    const { data: { content: { data: {totalQuantity} } } } = await get(endpoint, { });
    setCartItems(totalQuantity);
    if( totalQuantity )
      localStorage.setItem('ActiveCart', JSON.stringify({ totalQuantity }) );
  },[]);
  useEffect(() => {
    const newActive = cartItems ? 'cmp-cart__active' : '';
    setCartActive(newActive);
  },[cartItems]);
  return (
    <div className={`cmp-cart ${cartActive}`}>
      <div className="cmp-cart__icon">
        <i className="fas fa-shopping-cart fa-2x"></i>
      </div>
      <div className="cmp-cart__number">
        <span>
          { maxItems && maxItems < cartItems ? `${maxItems}+` : cartItems }
        </span>
      </div>
    </div>
  )
};

export default MiniCart