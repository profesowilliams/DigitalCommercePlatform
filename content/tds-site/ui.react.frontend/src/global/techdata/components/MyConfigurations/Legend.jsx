import React from 'react';

const LegendWidget = ({items}) => (
  <>{
    items.map((item, i) => {
      return (
        <div className="cmp-dcp-widget-chart__sub-title-wrapp" key={Symbol(i).toString()}>
          <span className={`cmp-dcp-widget-chart__sub-title-color-${i + 1}`}></span>
          <span className='cmp-dcp-widget-chart__sub-title'>{item.label}</span>
        </div>
      );
    })
  }</>
);

export default LegendWidget;