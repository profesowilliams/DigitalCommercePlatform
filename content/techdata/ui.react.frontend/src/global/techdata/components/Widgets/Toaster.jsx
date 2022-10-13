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
  const {isOpen, Child, isSuccess, origin, title, message, isAutoClose = false } = toaster;
  const positionRef = useRef({});
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const [DOMLoaded, setDOMLoaded] = useState(false);


  useEffect(() => {
    if (isOpen && isAutoClose) {      
      const timeout = setTimeout(() => {
        onClose();
      }, 6000);
      return () => clearTimeout(timeout);
    } 
  }, [isOpen]);  

  const calculateSubheaderPosition = useCallback(() => {
    const subHeaderElement = document.querySelector('.subheader > div > div');
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
    const onPageLoad = () => setDOMLoaded(true);
    const setPositionRef = () => positionRef.current = calculateSubheaderPosition();
    if (!document.querySelector('.subheader')) return;
    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad);
      return () => window.removeEventListener("load", onPageLoad);
    }    
    setPositionRef();
  },[])

  const paddingOnJustUpdating = {
    "& .MuiPaper-root .cmp-toaster-content" : {padding: origin === 'fromUpdate' && '1rem !important'}
  }

  useEffect(() => toaster?.isOpen && window.scrollTo(0,0),[toaster.isOpen])
  
  return DOMLoaded && (
    <div className="cmp-toaster-drawer">
      <Drawer
        anchor="right"
        open={isOpen}
        hideBackdrop={true}
        disableScrollLock={true}
        className="toaster-modal"
        sx={{height: "max-content", ...positionRef.current, ...paddingOnJustUpdating }}
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
