import React, { useEffect, memo } from "react";
import Drawer from "@mui/material/Drawer";
import { CheckmarkCircle, Dismiss, CautionIcon } from "../../../../fluentIcons/FluentIcons";
import { teal, red } from "@mui/material/colors";
import shallow from "zustand/shallow";


function Toaster({   
  onClose,
  MuiDrawerProps,  
  store,
  triggerByRenewalDetails = false
}) {

  const toaster = store( state => state.toaster, shallow);

  const {isOpen, Child, isSuccess, title, message, isAutoClose = false } = toaster;

  useEffect(() => {
    if (isOpen && isAutoClose) {      
      const timeout = setTimeout(() => {
        onClose();
      }, 6000);
      return () => clearTimeout(timeout);
    } 
  }, [isOpen]);  

  return (
    <div className="cmp-toaster-drawer">
      <Drawer
        anchor="right"
        open={isOpen}
        hideBackdrop={true}
        className={`toaster-modal ${triggerByRenewalDetails && 'cmp-toaster-renewal-details'}`}
        sx={{height: "max-content"}}
        onClose={onClose}
        {...MuiDrawerProps}
      >
        <div className={`cmp-toaster-content${!isSuccess ? '-error' : ''}`}>
          <div className="cmp-toaster-content__icon">
            {isSuccess ? <CheckmarkCircle fill={teal[800]} /> : <CautionIcon fill={red[900]} />}
          </div>
          <div className="cmp-toaster-content__message">
            <p>{isSuccess ? message : (<>
              <span className="cmp-toaster-content__error-title">{title}</span>
              {message}
            </>)}</p>
            {isSuccess && !!Child &&  <br />}
            {Child && Child}
          </div>
          {!isAutoClose && (
            <div className="cmp-toaster-content__closeIcon">
              <Dismiss onClick={onClose} />
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
}

export default memo(Toaster);
