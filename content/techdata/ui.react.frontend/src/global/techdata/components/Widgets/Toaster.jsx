import React, { useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import { CheckmarkCircle, Dismiss, CautionIcon } from "../../../../fluentIcons/FluentIcons";
import { teal, red } from "@mui/material/colors";

function Toaster({
  isToasterOpen, 
  onClose,
  children,
  MuiDrawerProps,
  isSuccess,  
  message,
  autoClose
}) {
  
  useEffect(() => {
    if (autoClose) {
      const timeout = setTimeout(() => {
        onClose();
      }, 6000);
      return () => {clearTimeout(timeout);}
    } 
  }, [isToasterOpen]);  

  return (
    <div className="cmp-toaster-drawer">
      <Drawer
        anchor="right"
        open={isToasterOpen}
        hideBackdrop={true}
        className="toaster-modal"
        sx={{height: "max-content"}}
        onClose={onClose}
        {...MuiDrawerProps}
      >
        <div className={`cmp-toaster-content${!isSuccess ? '-error' : ''}`}>
          <div className="cmp-toaster-content__icon">
          { isSuccess ?<CheckmarkCircle fill={teal[800]} /> :  <CautionIcon fill={red[900]} />}
          </div>
          <div className="cmp-toaster-content__message">
            <p>{ isSuccess ? message?.successSubmission : message?.failedSubmission}</p>
            {children}
          </div>
          {!autoClose && (
            <div className="cmp-toaster-content__closeIcon">
              <Dismiss onClick={onClose} />
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
}

export default Toaster;
