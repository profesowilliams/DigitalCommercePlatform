import React, { useEffect, memo, useCallback, useRef, useState } from "react";
import Drawer from "@mui/material/Drawer";
import { CheckmarkCircle, Dismiss, CautionIcon } from "../../../../fluentIcons/FluentIcons";
import { teal, red } from "@mui/material/colors";
import shallow from "zustand/shallow";


function Toaster({   
  onClose,
  MuiDrawerProps,  
  store 
}) {

  const toaster = store( state => state.toaster, shallow);
  const {isOpen, Child, isSuccess, title, message, isAutoClose = false } = toaster;
  const positionRef = useRef({});
  const [, updateState] = useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  useEffect(() => {
    if (isOpen && isAutoClose) {      
      const timeout = setTimeout(() => {
        onClose();
      }, 6000);
      return () => clearTimeout(timeout);
    } 
  }, [isOpen]);  

  const calculateSubheaderPosition = useCallback(() => {
    const subHeaderElement = document.querySelector('.subheader');
    if (!subHeaderElement) return;

    const { top, height } = subHeaderElement.getBoundingClientRect();
    if (top < 0) {
      forceUpdate();
      return
    };
    const gap = 7;
    const topCalculation = top + gap + height;
    return {"& .MuiPaper-root" : {top: `${topCalculation}px`}};
  },[])

  useEffect(()=>{
    const setPositionRef = () => positionRef.current = calculateSubheaderPosition();
    setPositionRef();
  },[])

  useEffect(() => toaster?.isOpen && window.scrollTo(0,0),[toaster.isOpen])
  
  return (
    <div className="cmp-toaster-drawer">
      <Drawer
        anchor="right"
        open={isOpen}
        hideBackdrop={true}
        className="toaster-modal"
        sx={{height: "max-content", ...positionRef.current}}
       
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
