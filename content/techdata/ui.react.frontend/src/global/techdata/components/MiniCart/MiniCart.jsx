import React, { useEffect, useState } from 'react';
import { usGet } from '../../../../utils/api';
import {isAlreadySignedIn} from "../../../../store/action/authAction";

const MiniCartWrapper = ({children, cartActive, shopUrl}) => {

  const sessionId = localStorage.getItem("sessionId");
  if(!sessionId) return "";

  const className = `cmp-cart ${cartActive}`;
  return <a href={shopUrl} className={className}>{children}</a>
}

const MiniCart = ({componentProp}) => {
  const { maxItems, endpoint, shopUrl } = JSON.parse(componentProp);
  const [cartItems, setCartItems] = useState(0);
  const [cartActive, setCartActive] = useState(false);
  useEffect(() => {

    const getActiveCart = async () => {
        try{
            let totalQuantity = 0;
            try {
                let { data: { content: { data: {totalQuantity} } } } = await usGet(endpoint, { });
                setCartItems(totalQuantity);
                localStorage.setItem('ActiveCart', JSON.stringify({ totalQuantity }) );
                // Updating sessionIdleTimeout with current time + 1 hour
                var dt = new Date();
                dt.setHours(dt.getHours() + 1);
                localStorage.setItem('sessionIdleTimeout', dt.valueOf());
            } catch {
            }

            if(window.SHOP && window.SHOP.authentication) {
                if(window.SHOP.authentication.isAuthenticated()) {
                    totalQuantity = window.SHOP.dataLayer.cart.totItemCount;
                    setCartItems(totalQuantity);
                    localStorage.setItem('ActiveCart', JSON.stringify({ totalQuantity }) );
                }
            }
        } catch{
            localStorage.setItem('ActiveCart', '' );
        }
    }
    if (isAlreadySignedIn() || (window.SHOP && window.SHOP.authentication && window.SHOP.authentication.isAuthenticated()))
    {
      getActiveCart();
    }else{

    }

    document.addEventListener("cart:updated", () => {
      getActiveCart();
    });

  },[]);
  useEffect(() => {
    const newActive = cartItems ? 'cmp-cart__active' : '';
    setCartActive(newActive);
  },[cartItems]);
  return (
    <MiniCartWrapper shopUrl={shopUrl} cartActive={cartActive} >
      <span className="cmp-cart__icon">
        {cartActive ? (
        <svg viewBox="0 0 34 28" xmlns="http://www.w3.org/2000/svg">
                        <title>Cart</title>
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Nav-Masthead---Hot" transform="translate(-1385.000000, -24.000000)">
                    <g id="Cart-" transform="translate(1385.999924, 24.999904)">
                        <polyline id="Stroke-1" stroke="#000C21" stroke-width="1.14705882" stroke-linecap="round" stroke-linejoin="round" points="0 0 5.33535294 0 9.23516176 20.2392794 26.4119853 20.2392794"></polyline>
                        <path d="M29.2828632,23.1100426 C29.2828632,24.6954691 27.9975838,25.9809397 26.4119662,25.9809397 C24.8265397,25.9809397 23.5412603,24.6954691 23.5412603,23.1100426 C23.5412603,21.524425 24.8265397,20.2391456 26.4119662,20.2391456 C27.9975838,20.2391456 29.2828632,21.524425 29.2828632,23.1100426 Z" id="Stroke-3" stroke="#000C21" stroke-width="1.14705882" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M13.7507118,23.1100426 C13.7507118,24.6954691 12.4654324,25.9809397 10.8798147,25.9809397 C9.29438824,25.9809397 8.0093,24.6954691 8.0093,23.1100426 C8.0093,21.524425 9.29438824,20.2391456 10.8798147,20.2391456 C12.4654324,20.2391456 13.7507118,21.524425 13.7507118,23.1100426 Z" id="Stroke-5" stroke="#000C21" stroke-width="1.14705882" stroke-linecap="round" stroke-linejoin="round"></path>
                        <g id="Group-10" transform="translate(6.082165, 3.875549)">
                            <polyline id="Fill-7" fill="#000C21" points="2.61376471 13.5645441 22.9861029 13.5645441 25.6338971 0 0 0"></polyline>
                            <polyline id="Stroke-9" stroke="#000C21" stroke-width="1.14705882" stroke-linecap="round" stroke-linejoin="round" points="2.61376471 13.5645441 22.9861029 13.5645441 25.6338971 0 0 0"></polyline>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
        ) : (
            <svg viewBox="0 0 49 41" xmlns="http://www.w3.org/2000/svg">
              <title>Cart</title>
              <g id="Illustrations---Production" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
                <g id="Cart---Empty" transform="translate(-6.000000, -11.000000)" stroke="#000C21" stroke-width="2.63414634">
                  <g id="Group-9" transform="translate(8.000000, 13.000000)">
                    <polyline id="Stroke-1" points="0 0 7.57002755 0 13.1032435 28.8231814 37.4744574 28.8231814"></polyline>
                    <path d="M41.5477821,32.9114954 C41.5477821,35.1693344 39.7241725,37 37.4744302,37 C35.2249592,37 33.4013496,35.1693344 33.4013496,32.9114954 C33.4013496,30.6533841 35.2249592,28.8229908 37.4744302,28.8229908 C39.7241725,28.8229908 41.5477821,30.6533841 41.5477821,32.9114954 Z" id="Stroke-3"></path>
                    <path d="M19.5100995,32.9114954 C19.5100995,35.1693344 17.68649,37 15.4367477,37 C13.1872766,37 11.3636671,35.1693344 11.3636671,32.9114954 C11.3636671,30.6533841 13.1872766,28.8229908 15.4367477,28.8229908 C17.68649,28.8229908 19.5100995,30.6533841 19.5100995,32.9114954 Z" id="Stroke-5"></path>
                    <polyline id="Stroke-7" points="11.4941922 20.4418423 42.0979029 20.4418423 45 5.51935868 9.06379785 5.51935868"></polyline>
                  </g>
                </g>
              </g>
            </svg>
        )}
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