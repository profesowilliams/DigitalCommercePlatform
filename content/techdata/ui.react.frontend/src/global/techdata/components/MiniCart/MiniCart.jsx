import React, { useEffect, useState } from 'react';
import { usGet } from '../../../../utils/api';
import {isAlreadySignedIn} from "../../../../store/action/authAction";

const MiniCartWrapper = ({children, cartActive, shopUrl}) => {
  const className = `cmp-cart ${cartActive}`;
  if( cartActive )
    return <a href={shopUrl} className={className}>{children}</a>
  
  return <div className={className}>{children}</div>
}

const MiniCart = ({componentProp}) => {
  const { maxItems, endpoint, shopUrl } = JSON.parse(componentProp);
  const [cartItems, setCartItems] = useState(0);
  const [cartActive, setCartActive] = useState(false);
  useEffect(() => {

    if (isAlreadySignedIn())
    {
      const getActiveCart = async () => {
        try{
          const { data: { content: { data: {totalQuantity} } } } = await usGet(endpoint, { });
          setCartItems(totalQuantity);
          localStorage.setItem('ActiveCart', JSON.stringify({ totalQuantity }) );
        }catch{
          localStorage.setItem('ActiveCart', '' );
        }
      }
      getActiveCart();
    }else{

    }

  },[]);
  useEffect(() => {
    const newActive = cartItems ? 'cmp-cart__active' : '';
    setCartActive(newActive);
  },[cartItems]);
  return (
    <MiniCartWrapper shopUrl={shopUrl} cartActive={cartActive} >
      <span className="cmp-cart__icon">
        <i className="fas fa-shopping-cart fa-2x"></i>
      </span>
      <span className="cmp-cart__number">
        <span>
          { maxItems && maxItems < cartItems ? `${maxItems}+` : cartItems }
        </span>
      </span>
    </MiniCartWrapper>
  )
};

export default MiniCart