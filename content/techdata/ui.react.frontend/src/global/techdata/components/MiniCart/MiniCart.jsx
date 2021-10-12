import React, { useEffect, useState } from "react";
import { usGet } from "../../../../utils/api";
import { isAlreadySignedIn } from "../../../../store/action/authAction";

const MiniCartWrapper = ({ children, cartActive, shopUrl }) => {
  const sessionId = localStorage.getItem("sessionId");
  const className = `cmp-cart ${cartActive}`;
  if (window.SHOP?.authentication?.isAuthenticated() || sessionId) {
    return (
      <a href={shopUrl} className={className}>
        {children}
      </a>
    );
  }
  return "";
};

const MiniCart = ({ componentProp }) => {
  const { maxItems, endpoint, shopUrl } = JSON.parse(componentProp);
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
    <MiniCartWrapper shopUrl={shopUrl} cartActive={cartActive}>
      <span className="cmp-cart__icon">
        {cartActive ? (
          <svg width="30px" height="27px" viewBox="0 0 30 27" version="1.1">
            <title>Icon_Cart_Line (1)</title>
            <g id="Page-1" stroke-width="1" fill="none" fill-rule="evenodd">
              <g
                id="Artboard"
                transform="translate(0.000000, 1.000000)"
                stroke="#000C21"
                stroke-width="2.63414634"
              >
                <g
                  id="Icon_Cart_Line-(1)"
                  transform="translate(-0.000000, 1.000000)"
                >
                  <polyline
                    id="Stroke-1"
                    points="0 -1.10422182e-15 4.7056928 -1.10422182e-15 8.14525947 17.9171128 23.294933 17.9171128"
                  ></polyline>
                  <path
                    d="M25.8269997,20.4584971 C25.8269997,21.8620187 24.6934045,23 23.2949161,23 C21.8965963,23 20.7630011,21.8620187 20.7630011,20.4584971 C20.7630011,19.0548063 21.8965963,17.9169943 23.2949161,17.9169943 C24.6934045,17.9169943 25.8269997,19.0548063 25.8269997,20.4584971 Z"
                    id="Stroke-3"
                  ></path>
                  <path
                    d="M12.1278997,20.4584971 C12.1278997,21.8620187 10.9943046,23 9.59581614,23 C8.19749626,23 7.06390117,21.8620187 7.06390117,20.4584971 C7.06390117,19.0548063 8.19749626,17.9169943 9.59581614,17.9169943 C10.9943046,17.9169943 12.1278997,19.0548063 12.1278997,20.4584971 Z"
                    id="Stroke-5"
                  ></path>
                  <polyline
                    id="Stroke-7"
                    points="7.14503839 12.7070912 26.1689667 12.7070912 27.972973 3.43095269 5.63425272 3.43095269"
                  ></polyline>
                </g>
              </g>
            </g>
          </svg>
        ) : (
          <svg width="31px" height="26px" viewBox="0 0 31 26" version="1.1">
            <title>Icon_Cart_Solid</title>
            <g id="Page-1" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="Artboard" transform="translate(2.000000, 1.000000)">
                <g
                  id="Icon_Cart_Solid"
                  transform="translate(-1.000000, 0.000000)"
                >
                  <polyline
                    id="Stroke-1"
                    stroke="#000C21"
                    stroke-width="1.14705882"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    points="0 0 4.92855425 0 8.5310187 18.6961177 24.3981801 18.6961177"
                  ></polyline>
                  <path
                    d="M27.0501654,21.347997 C27.0501654,22.8125413 25.8628833,24 24.3981625,24 C22.9336182,24 21.7463361,22.8125413 21.7463361,21.347997 C21.7463361,19.8832762 22.9336182,18.6959941 24.3981625,18.6959941 C25.8628833,18.6959941 27.0501654,19.8832762 27.0501654,21.347997 Z"
                    id="Stroke-3"
                    stroke="#000C21"
                    stroke-width="1.14705882"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M12.7022766,21.347997 C12.7022766,22.8125413 11.5149944,24 10.0502736,24 C8.58572939,24 7.39862384,22.8125413 7.39862384,21.347997 C7.39862384,19.8832762 8.58572939,18.6959941 10.0502736,18.6959941 C11.5149944,18.6959941 12.7022766,19.8832762 12.7022766,21.347997 Z"
                    id="Stroke-5"
                    stroke="#000C21"
                    stroke-width="1.14705882"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <g id="Group-10" transform="translate(5.618425, 3.580054)">
                    <polyline
                      id="Fill-7"
                      fill="#000C21"
                      fill-rule="nonzero"
                      points="2.4144759 12.5303034 21.2335072 12.5303034 23.679418 0 0 0"
                    ></polyline>
                    <polyline
                      id="Stroke-9"
                      stroke="#000C21"
                      stroke-width="1.14705882"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      points="2.4144759 12.5303034 21.2335072 12.5303034 23.679418 0 0 0"
                    ></polyline>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        )}
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
