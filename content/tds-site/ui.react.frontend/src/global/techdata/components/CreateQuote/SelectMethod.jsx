import React, { Fragment } from 'react';
import Dropdown from '../Widgets/Dropdown';
import WidgetTitle from '../Widgets/WidgetTitle';

const SelectMethod = ({ 
  title, 
  method, 
  setMethod, 
  methods, 
  createQuote, 
  buttonTitle,
  placeholderText
}) => {
  return(
    <Fragment>
      <WidgetTitle>{title}</WidgetTitle>
      <Dropdown selected={method} setValue={setMethod} options={methods} placeholderText={placeholderText} />
      <button disabled={!method} className="cmp-quote-button" onClick={() => createQuote()}>{buttonTitle}</button>
    </Fragment>
  );
};

export default SelectMethod;