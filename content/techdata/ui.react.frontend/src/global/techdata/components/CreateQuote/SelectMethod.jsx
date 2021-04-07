import React, { Fragment } from 'react';
import Dropdown from './Dropdown'

const SelectMethod = ({ method, setMethod, methods, createQuote, buttonTitle }) => {
  return(
    <Fragment>
      <Dropdown selected={method} setValue={setMethod} options={methods} />
      <button disabled={!method} className="cmp-quote-button" onClick={createQuote}>{buttonTitle}</button>
    </Fragment>
  );
};

export default SelectMethod;