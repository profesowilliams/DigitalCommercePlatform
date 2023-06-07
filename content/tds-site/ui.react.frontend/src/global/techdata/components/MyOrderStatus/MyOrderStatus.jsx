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

const MyOrderStatus = ({ componentProp }) => {
  let { label, fromDateInYears, endpoint } = JSON.parse(componentProp);
  const [ status, setStatus ] = useState([])
  useEffect(async () => {
      try{
          let date = new Date();
          let toDateInUSFormat = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear(1);
          date.setFullYear(date.getFullYear() - fromDateInYears);
          let fromDateInUSFormat = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear(1);
          endpoint = endpoint + "?fromDate=" + fromDateInUSFormat + "&toDate=" + toDateInUSFormat;
          const { data: { content: { items } } } = await get(endpoint, {});

          setStatus(items);
      } catch {}
  },[])
  return(
    <>
    <div className="cmp-deals__title">
        <p>{ label }</p>
    </div>
      <div className="cmp-deals">
        <div className="cmp-deals__table">
          <table cellPadding="0" cellSpacing="6">
            <thead>
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

export default MyOrderStatus;