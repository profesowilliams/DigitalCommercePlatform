import React, { useCallback } from "react";
import * as DataLayerUtils from "../../../../../utils/dataLayerUtils";
import OrderDetailsSerialNumbers from "../../OrderDetails/OrderDetailsSerialNumbers/OrderDetailsSerialNumbers";

function RenewalProductLinesItemInformation({ line, isLinkDisabled="false", shopDomainPage = "", invokeModal }) {
  const {product = [false,false]} = line;
  const [techdata, manufacturer] = product;
  const description = manufacturer?.name;
  const formatDescription = (description = "") => {
    if (!description) return "N/A";
    const matchFirstWords = /^(.*?\s){12}/;
    const matched = description.match(matchFirstWords);
    if (!matched || (!matched.length)) return <p>{description}</p>
    const firstTextRow = matched[0];
    const secondTextRow = description.substring(firstTextRow.length);
    return (
      <>
        <p>{firstTextRow}</p>
        <p>{secondTextRow}</p>
      </>
    )
  }
  const formatShopDomainUrl = useCallback(() => {
    if (shopDomainPage.length > 1 && line.product) {
      const hasHttp = /^(http|https):/gm.test(shopDomainPage);
      const tdNumber = line.product.find(p => p.type === 'TECHDATA')?.id.replace(/^0+/gm, "");
      if (!tdNumber) {
        return null;
      }
      if (!hasHttp) {
        const hasSlash = /^\//gm.test(shopDomainPage);
        const shopUrlFormatted = hasSlash
          ? shopDomainPage.replace("/", "")
          : shopDomainPage;

        return `https://${shopUrlFormatted}/${tdNumber}/?P=${tdNumber}`;
      } else {
        return `${shopDomainPage}/${tdNumber}/?P=${tdNumber}`;
      }
    }
    return null;
  }, []);

  const handleClick = () => {
    DataLayerUtils.pushEvent(
      DataLayerUtils.ANALYTICS_TYPES.events.click,
      {
        name: line.displayName,
        type: DataLayerUtils.ANALYTICS_TYPES.types.link,
      },
      {
        click: {
          category: DataLayerUtils.ANALYTICS_TYPES.category.quoteDetailTableInteraction,
        },
        products: {
          productInfo: { parentSKU: line.tdNumber, name: line.displayName },
        },
      }
    );
  };

  return (
    <section>
      <div
        onClick={handleClick}
        className="cmp-product-lines-grid__item-information"
        style={{width:'100%', gridTemplateColumns:'100% 86%'}}
      >
        <div className="cmp-product-lines-grid__item-information__box-text">
          <div className={`cmp-renewal-preview__prod-details ${!isLinkDisabled ? "" : "no-link"}`}>
            <a
              href={!isLinkDisabled ? formatShopDomainUrl() : null}
              target={!isLinkDisabled ? "_blank" : null}
              className={`cmp-product-lines-grid__item-information__box-text__header__link ${!isLinkDisabled ? "" : "no-link"}`}
            >
              {formatDescription(description)}
            </a>
            <br />
            <span>
              <b>Serial №: </b>
              {line.serialNumbers && line.serialNumbers.length && !line.serialNumbers.every(e => e === null) ? (
                <a
                  className="cmp-grid-url-underlined"
                  href="#"
                  target="_blank"
                  onClick={(e) => {
                    e.preventDefault();
                    invokeModal({
                      content: (
                        <OrderDetailsSerialNumbers
                          data={line.serialNumbers}
                        ></OrderDetailsSerialNumbers>
                      ),
                      properties: {
                        title: line.serialModal
                          ? line.serialModal
                          : "Serial Numbers",
                      },
                    });
                  }}
                >
                  {line.serialNumbers.length > 1 ? "view multiple" : line.serialNumbers[0]}
                </a>
              ) : (line.serialCellNotFoundMessage
                    ? line.serialCellNotFoundMessage
                    : "N/A"
              )}
            </span>
            <span>
              <b>Instance: </b>
              {line.instance || " N/A "}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RenewalProductLinesItemInformation;
