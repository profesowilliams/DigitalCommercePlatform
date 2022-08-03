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
      return <p>Something went wrong.</p>
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
}) {

  const SpanInfo = (
    <ErrorDisplayItemBoundary>
      <If condition={children}>
        <span>{!label && removeCommaIfContentNull(children)}</span>
      </If>
    </ErrorDisplayItemBoundary>
  );

  const toggleBoldLabel = () => (boldLabel ? <b>{label}</b> : label);

  const handleObjectResponseForApj = (child) => {
    const res = typeof child === "object" ? child?.text : child;
    console.log('🚀res >>',res, " wtf", typeof res);
    return res;
  };

  return (
    <>
    <ErrorDisplayItemBoundary>
      <If condition={label && children} Else={SpanInfo}>
        <span>
          {toggleBoldLabel()}
          {!noColon ? ":" : ""} {handleObjectResponseForApj(children)}
        </span>
      </If>
    </ErrorDisplayItemBoundary>
    </>
  );
}

export default DisplayItemInfo;
