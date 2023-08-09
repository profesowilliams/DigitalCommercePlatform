import React from 'react';
function DropdownOrderShippedTabGridDetails({ data, aemConfig }) {
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
          const { name, manufacturerPart, divNumber } = item;
          return (
            <div
              key={index}
              className="order-line-details__content__innerTable__line"
            >
              <div style={{ width: defaultWidth.line }}>
                <span className="order-line-details__content__innerTable__text">
                  11
                </span>
              </div>
              <div
                style={{ width: defaultWidth.thumbNail }}
                className="order-line-details__content__innerTable__column"
              >
                Thumbnail
              </div>
              <div
                style={{ width: defaultWidth.item }}
                className="order-line-details__content__innerTable__column"
              >
                <span className="order-line-details__content__innerTable__text">
                  {name}
                </span>
              </div>
              <div
                style={{ width: defaultWidth.pnsku }}
                className="order-line-details__content__innerTable__column"
              >
                <div>
                  <span className="order-line-details__content__innerTable__text">
                    {manufacturerPart}
                  </span>
                </div>
                <div>
                  <span className="order-line-details__content__innerTable__text">
                    {divNumber}
                  </span>
                </div>
              </div>
              <div
                style={{ width: defaultWidth.qty }}
                className="order-line-details__content__innerTable__column"
              >
                <span className="order-line-details__content__innerTable__text">
                  1 / 11
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
      {data && <ProductTable data={data?.product} />}
    </div>
  );
}
export default DropdownOrderShippedTabGridDetails;
