import React, { useEffect, useState } from 'react';
import { get } from '../../../../utils/api'

const LineTable = ({ color, label }) => (
  <tr>
    <td className={`cmp-deals__sub-title-color-${color}`}></td>
    <td className="cmp-deals__sub-title">{label}</td>
  </tr>
);

const ValueItem = ({ icon, value, color }) => (
  <section>
    <span className={`cmp-deals__icon-color-${color}`}>
      <i className={`fa-3x fas fa-${icon}`}></i>
    </span>
    <div className="cmp-deals__count">
      { value }
    </div>
  </section>
);

const MyOrderDeals = ({ componentProp }) => {
  let { label, endpoint } = JSON.parse(componentProp);
  const [ status, setStatus ] = useState([])
  useEffect(async () => {
      try{
            const { data: { content: { items } } } = await get(endpoint, {});
            setStatus(items);
      } catch {
      }
  },[])
  return(
    <>
      <div className="cmp-deals">
        <div className="cmp-deals__table">
          <table cellPadding="0" cellSpacing="6">
            <thead>
              <tr className="cmp-deals__title">
                <td colSpan="2">{ label }</td>
              </tr>
              <tr>
                <td>
                  <br />
                </td>
              </tr>
            </thead>
            <tbody>
              <LineTable color="1" label="On Hold" />
              <LineTable color="2" label="In Process" />
              <LineTable color="3" label="Shipped" />
            </tbody>
          </table>
        </div>

        <div className="cmp-deals__bar-Graph">
        <ValueItem icon="bell" value={status.onHold} color="1" />
        <ValueItem icon="clock" value={status.inProcess} color="2" />
        <ValueItem icon="calendar-week" value={status.shipped} color="3" />
        </div>

      </div>
    </>
  )
}

export default MyOrderDeals;