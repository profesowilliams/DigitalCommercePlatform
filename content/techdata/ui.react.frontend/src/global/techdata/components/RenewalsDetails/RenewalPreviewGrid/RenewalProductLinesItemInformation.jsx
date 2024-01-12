import React, { useCallback } from "react";
import * as DataLayerUtils from "../../../../../utils/dataLayerUtils";
import OrderDetailsSerialNumbers from "../../OrderDetails/OrderDetailsSerialNumbers/OrderDetailsSerialNumbers";
import { formatDetailsShortDescription } from "../../RenewalsGrid/utils/renewalUtils";

const hasSerialNumbers = (line) => line.serialNumbers && line.serialNumbers.length > 0 && line.serialNumbers[0];

export const getItemInformation = (line) => {
  const description = formatDetailsShortDescription(line)

  const serialNumbers = hasSerialNumbers(line) && !line.serialNumbers.every(e => e === null)
      ? `
Serial №: ${line.serialNumbers.join(", ")}`
      : "";

  const instance = line.instance
      ? `
Instance:${line.instance}`
      : "";

  return `${description}${serialNumbers}${instance}`;
}


function RenewalProductLinesItemInformation({ line, dataObj, isLinkDisabled="false", shopDomainPage = "", invokeModal, lineDetailsLabels }) {
  const description =  formatDetailsShortDescription(line);
  const serialHasValue = hasSerialNumbers(line);
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
              <p>{description}</p>
            </a>
            <br />
            {serialHasValue && <span>
              <b>{lineDetailsLabels.serialNumberLabel}</b>
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
            </span>}
            {line.instance && <span>
              <b>{lineDetailsLabels?.instanceLabel}</b>
              {line.instance}
            </span>}
          </div>
        </div>
      </div>
    </section>
  );
}

export default RenewalProductLinesItemInformation;
