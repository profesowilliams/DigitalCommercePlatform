import React from 'react';

function DropdownOrderShippedTabGridDetails({ data }) {
  const ProductTable = ({ data }) => {
    const defaultWidth = {
      line: '50px',
      thumbnail: '50px',
      item: '475px',
      pnsku: '148px',
      qty: '70px',
      deliveryEstimate: '50px',
    };
   
    return (
      <div className="order-line-details__content__innerTable">
        {data.map((item, index) => {
          const {
            line,
            urlProductImage,
            displayName,
            mfrNumber,
            tdNumber,
            shipQuantity,
            orderQuantity,
          } = item;
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
              <div
                style={{ width: defaultWidth.item }}
                className="order-line-details__content__innerTable__column"
              >
                <span className="order-line-details__content__innerTable__text">
                  {displayName}
                </span>
              </div>
              <div
                style={{ width: defaultWidth.pnsku }}
                className="order-line-details__content__innerTable__column"
              >
                <div>
                  <span className="order-line-details__content__innerTable__text">
                    {mfrNumber}
                  </span>
                </div>
                <div>
                  <span className="order-line-details__content__innerTable__text">
                    {tdNumber}
                  </span>
                </div>
              </div>
              <div
                style={{ width: defaultWidth.qty }}
                className="order-line-details__content__innerTable__column"
              >
                <span className="order-line-details__content__innerTable__text">
                  {shipQuantity} / {orderQuantity}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="order-line-details">
      {data && <ProductTable data={data} />}
    </div>
  );
}
export default DropdownOrderShippedTabGridDetails;
