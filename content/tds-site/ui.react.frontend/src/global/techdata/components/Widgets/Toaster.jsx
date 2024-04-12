import React, { useEffect, memo, useCallback, useRef, useState } from "react";
import Drawer from "@mui/material/Drawer";
import {
  CheckmarkCircle,
  Dismiss,
  ErrorIcon,
} from '../../../../fluentIcons/FluentIcons';
import { teal, red } from '@mui/material/colors';
import shallow from 'zustand/shallow';

function Toaster({
  classname = '',
  onClose,
  closeEnabled,
  MuiDrawerProps,
  store,
}) {
  const toaster = store((state) => state.toaster, shallow);
  const {
    isOpen,
    Child,
    isSuccess,
    origin,
    title,
    message,
    isAutoClose = false,
  } = toaster;
  const [DOMLoaded, setDOMLoaded] = useState(false);
  const [subheaderPosition, setSubheaderPosition] = useState('');
  const autocloseTimeout = 5000;

  useEffect(() => {
    if (isOpen && isAutoClose) {
      const timeout = setTimeout(() => {
        onClose();
      }, autocloseTimeout);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const calculateSubheaderPosition = useCallback(() => {
    const subHeaderElement = document.querySelector('.subheader > div > div');
    if (!subHeaderElement) return '';
    const { top, height } = subHeaderElement.getBoundingClientRect();
    const gap = 7;
    if (top < 0) {
      const offSetHeight = subHeaderElement.offsetHeight;
      const scrollY = window.scrollY;
      const offsetTop = scrollY + top;
      return `${offSetHeight + offsetTop + gap}px`;
    }
    const topCalculation = top + gap + height;
    return `${topCalculation}px`;
  }, []);

  useEffect(() => {
    const onPageLoad = () => {
      setPositionRef();
      setDOMLoaded(true);
    };
    const setPositionRef = () => {
      const topPosition = calculateSubheaderPosition();
      topPosition && setSubheaderPosition(topPosition);
    };
    const timer = setTimeout(onPageLoad, 1600);
    if (!document.querySelector('.subheader')) return;
    if (document.readyState === 'complete') {
      onPageLoad();
    } else {
      window.addEventListener('load', onPageLoad);
      window.addEventListener('scroll', setPositionRef);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('load', onPageLoad);
        window.removeEventListener('scroll', setPositionRef);
      };
    }
  }, []);

  const paddingOnJustUpdating = {
    '& .MuiPaper-root .cmp-toaster-content': {
      padding: origin === 'fromUpdate' && '1rem !important',
    },
  };

  return (
    DOMLoaded && (
      <div className="cmp-toaster-drawer">
        <Drawer
          anchor="right"
          open={isOpen}
          hideBackdrop={true}
          disableScrollLock={true}
          className={`toaster-modal ${classname}`}
          sx={{
            height: 'max-content',
            ...paddingOnJustUpdating,
            '& .MuiPaper-root': { top: subheaderPosition },
          }}
          onClose={onClose}
          {...MuiDrawerProps}
        >
          <div className={`cmp-toaster-content${!isSuccess ? '-error' : ''}`}>
            <div className="cmp-toaster-content__icon">
              {isSuccess ? (
                <CheckmarkCircle fill={teal[800]} />
              ) : (
                <ErrorIcon fill={red[900]} />
              )}
            </div>
            <div className="cmp-toaster-content__message">
              <p>
                {isSuccess ? (
                  message
                ) : (
                  <>
                    {title && (
                      <span className="cmp-toaster-content__error-title">
                        {title}
                      </span>
                    )}
                    {message}
                  </>
                )}
              </p>
              {isSuccess && !!Child && <br />}
              {Child && Child}
            </div>
          </div>
          {(!isAutoClose || closeEnabled) && (
            <div className="cmp-toaster-content__closeIcon">
              <Dismiss onClick={onClose} />
            </div>
          )}
        </Drawer>
      </div>
    )
  );
}

export default memo(Toaster);
