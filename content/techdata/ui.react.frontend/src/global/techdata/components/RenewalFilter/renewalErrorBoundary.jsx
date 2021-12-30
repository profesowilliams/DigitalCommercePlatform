import React from "react";
import { useRenewalGridState } from "../RenewalsGrid/store/RenewalsStore";

export class RenewalErrorBoundary extends React.Component {
  state = { hasError: false };

  componentDidCatch(error) {
      this.setState({ hasError: true});
      console.log("📛 catched renewal error", error.toString())
      // close modal on catched error
      useRenewalGridState.getState().effects.toggleFilterModal({justClose:true})
    
  }
  render = () =>
    this.state.hasError ? (
      <>
        <p style={{textAlign:center,background:white}}>Something went wrong please refresh the page</p>
      </>
    ) : (
      this.props.children
    );
}
