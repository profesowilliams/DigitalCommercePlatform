import React from 'react';
import Tooltip from '@mui/material/Tooltip';

function DropdownOrderShippedTabGridDetails({ data }) {
  const ProductTable = ({ data }) => {
    const defaultWidth = {
      line: '50px',
      thumbnail: '50px',
      item: '475px',
      pnsku: '148px',
      qty: '130px',
      deliveryEstimate: '50px',
    };

    return (
      <div className="order-line-details__content__innerTable">
        {data.map((item, index) => {
          const {
            line,
            urlProductImage,
            urlProductDetailsPage,
            displayName,
            mfrNumber,
            tdNumber,
            shipQuantity,
            orderQuantity,
          } = item || {};
          return (
            <div
              key={index}
              className="order-line-details__content__innerTable__line"
            >
              <div style={{ width: defaultWidth.line }}>
                <span className="order-line-details__content__innerTable__text">
                  {line}
                </span>
              </div>
              <div
                style={{
                  width: defaultWidth.thumbNail,
                }}
                className="order-line-details__content__innerTable__column"
              >
                <img
                  className={'order-line-details__content__innerTable__image'}
                  src={urlProductImage}
                  alt=""
                />
              </div>

              <Tooltip
                title={displayName ?? ''}
                placement="top"
                arrow
                disableInteractive={true}
                disableHoverListener={displayName?.length < 56}
              >
                <div
                  style={{ width: defaultWidth.item }}
                  className="order-line-details__content__innerTable__column"
                >
                  {urlProductDetailsPage ? (
                    <a href={urlProductDetailsPage} target="_blank">
                      <span
                        style={{ maxWidth: defaultWidth.item }}
                        className="order-line-details__content__displayNameLinked"
                      >
                        {displayName}
                      </span>
                    </a>
                  ) : (
                    <span
                      style={{ maxWidth: defaultWidth.item }}
                      className="order-line-details__content__innerTable__text"
                    >
                      {displayName}
                    </span>
                  )}
                </div>
              </Tooltip>
              <div
                style={{ width: defaultWidth.pnsku }}
                className="order-line-details__content__innerTable__column"
              >
                <div>
                  <span
                    style={{ maxWidth: defaultWidth.mfrNumber }}
                    className="order-line-details__content__innerTable__text"
                  >
                    {mfrNumber}
                  </span>
                </div>
                <div>
                  <span
                    style={{ maxWidth: defaultWidth.tdNumber }}
                    className="order-line-details__content__innerTable__text"
                  >
                    {tdNumber}
                  </span>
                </div>
              </div>
              <div
                style={{ width: defaultWidth.qty }}
                className="order-line-details__content__innerTable__column"
              >
                <span className="order-line-details__content__innerTable__quantity">
                  {shipQuantity} / {orderQuantity}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return <div>{data && <ProductTable data={data} />}</div>;
}
export default DropdownOrderShippedTabGridDetails;
