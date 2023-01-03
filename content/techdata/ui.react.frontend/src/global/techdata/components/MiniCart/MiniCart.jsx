import React, { useEffect, useState } from "react";
import { usGet } from "../../../../utils/api";
import { isAlreadySignedIn } from "../../../../store/action/authAction";
import useAuth from "../../hooks/useAuth";

const MiniCartWrapper = ({ children, cartActive, shopUrl, cartLabel }) => {
  const sessionId = localStorage.getItem("sessionId");
  const { isUserLoggedIn } = useAuth();
  const className = `cmp-cart ${cartActive}`;
  if (window.SHOP?.authentication?.isAuthenticated() || isUserLoggedIn) {
    return (
      <a href={shopUrl} className="cmp-cart-link">
          <div className={className}>
            {children}
        </div>
        <span className="cmp-button__text">{cartLabel}</span>
      </a>
    );
  }
  return "";
};

const MiniCart = ({ componentProp }) => {
  const { maxItems, endpoint, shopUrl, cartLabel } = JSON.parse(componentProp);
  const [cartItems, setCartItems] = useState(0);
  const [cartActive, setCartActive] = useState(false);
  useEffect(() => {
    const getActiveCart = async () => {
      try {
        let totalQuantity = 0;
        try {
          let {
            data: {
              content: {
                data: { totalQuantity },
              },
            },
          } = await usGet(endpoint, {});
          setCartItems(totalQuantity);
          localStorage.setItem("ActiveCart", JSON.stringify({ totalQuantity }));
          // Updating sessionIdleTimeout with current time + 1 hour
          var dt = new Date();
          dt.setHours(dt.getHours() + 1);
          localStorage.setItem("sessionIdleTimeout", dt.valueOf());
        } catch {}

        if (window.SHOP && window.SHOP.authentication) {
          if (window.SHOP.authentication.isAuthenticated()) {
            totalQuantity = window.SHOP.dataLayer.cart.totItemCount;
            setCartItems(totalQuantity);
            localStorage.setItem(
              "ActiveCart",
              JSON.stringify({ totalQuantity })
            );
          }
        }
      } catch {
        localStorage.setItem("ActiveCart", "");
      }
    };
    if (
      isAlreadySignedIn() ||
      (window.SHOP &&
        window.SHOP.authentication &&
        window.SHOP.authentication.isAuthenticated())
    ) {
      getActiveCart();
    } else {
    }

    document.addEventListener("cart:updated", () => {
      getActiveCart();
    });
  }, []);
  useEffect(() => {
    const newActive = cartItems ? "cmp-cart__active" : "";
    setCartActive(newActive);
  }, [cartItems]);
  return (
    <MiniCartWrapper shopUrl={shopUrl} cartActive={cartActive} cartLabel={cartLabel}>
      <span className={cartActive ? 'cmp-cart__icon' : 'cmp-cart__icon active'}>
      </span>
      <span className="cmp-cart__number">
        <span>
          {maxItems && maxItems < cartItems ? `${maxItems}+` : cartItems}
        </span>
      </span>
    </MiniCartWrapper>
  );
};

export default MiniCart;
