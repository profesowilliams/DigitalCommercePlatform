import React from "react";
import { removeCommaIfContentNull } from "../../../helpers/formatting";
import { If } from "../../../helpers/If";

class ErrorDisplayItemBoundary extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {hasError:false};
  }
  static getDerivedStateFromError(error){
    return {hasError:true};
  }
  componentDidCatch(error, errorInfo){
    console.log(console.log('🚀this.props.children >>',this.props.children));
    console.log('🚀error and errorInfo>>',error, errorInfo);
  }
  render() {
    if(this.state.hasError){
      // TODO: Make this authorable. Find a better message post demo.
      return <p>Missing data</p>
    }
    return this.props.children;
  }
}

function DisplayItemInfo({
  children = null,
  label = null,
  condition = null,
  noColon = false,
  boldLabel = false,
  multipleOrderFlag = false,
  disableMultipleAgreement = false,
  spaceBetween = false
}) {

  const SpanInfo = (
    <ErrorDisplayItemBoundary>
      <If condition={children}>
        <span>{!label && removeCommaIfContentNull(children)}</span>
      </If>
    </ErrorDisplayItemBoundary>
  );

  const toggleBoldLabel = () => (boldLabel ? <b>{label}</b> : label);

  const italicText = (text) => (multipleOrderFlag ? <i>{text}</i> : text);

  const handleObjectResponseForApj = (child) => {
    const res = typeof child === "object" ? child?.text : child;
    return res;
  };

  return (
    <>
    <ErrorDisplayItemBoundary>
      <If condition={label && children} Else={SpanInfo}>
        {spaceBetween ? (<div className="info-custom-component--space-between">
            <span>
              {toggleBoldLabel()}
              {!noColon ? ":" : ""} 
            </span>
            <span>
              {disableMultipleAgreement ? italicText(handleObjectResponseForApj(children)) : handleObjectResponseForApj(children)}
            </span>
          </div>): (<span>
            {toggleBoldLabel()}
            {!noColon ? ":" : ""} 
            {disableMultipleAgreement ? italicText(handleObjectResponseForApj(children)) : handleObjectResponseForApj(children)}
          </span>)}
      </If>
    </ErrorDisplayItemBoundary>
    </>
  );
}

export default DisplayItemInfo;
