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

const MyDeals = ({ componentProp }) => {
  const { label, endpoint } = JSON.parse(componentProp);
  const [ expires, setExpires ] = useState([])
  useEffect(async () => {
    const { data: { content: { items } } } = await get(endpoint, {});
    setExpires(items);
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
              <LineTable color="1" label="Expires in 2 days" />
              <LineTable color="2" label="Expires in 7 days" />
              <LineTable color="3" label="+ 14 days" />
            </tbody>
          </table>
        </div>
        { expires.length > 0 &&
          (
            <div className="cmp-deals__bar-Graph">
              { expires[0] && <ValueItem icon="bell" value={expires[0].value} color="1" /> }
              { expires[1] && <ValueItem icon="clock" value={expires[1].value} color="2" /> }
              { expires[2] && <ValueItem icon="calendar-week" value={expires[2].value} color="3" /> }
            </div>
          )
        }
      </div>
    </>
  )
}

export default MyDeals;