import { Drawer } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import usePositionBelowSubheader from '../../hooks/usePositionBelowSubheader';
import { DismissFilledIcon, LoaderIcon} from '../../../../fluentIcons/FluentIcons';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

function BaseFlyout({
  children,
  open,
  onClose,
  width = '350px',
  anchor = 'right',
  subheaderReference,
  titleLabel,
  buttonLabel,
  secondaryButtonLabel,
  isLoading,
  enableButton,
  disabledButton,
  onClickButton,
  bottomContent,
  selected,
  secondaryButton,
}) {
  const BottomContent = () => bottomContent("footer")
  const SecondaryButton = () => secondaryButton(selected, secondaryButtonLabel)
  const { positioning, calculatePosition } = usePositionBelowSubheader({unmountedFn:false}, subheaderReference);
  const { top, height } = positioning;
  useEffect(() => {
    let timer;
    if(open) {
      timer = setTimeout(() => document.body.style.paddingRight = '0px', 333);
    } else {
      document.body.style.removeProperty('padding-right');
    };
    return () => {
      document.body.style.removeProperty('padding-right');
      clearTimeout(timer);
    }
  },[open])
  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiPaper-root': {
          width,
          ...(top && height ? { top, height } : {}),
          '@media (max-width: 600px)': {
            width: '100%',
          }
        },
      }}
    >
      <div className="cmp-flyout">
        <section className="cmp-flyout__header">
          <h4 className="cmp-flyout__header-title">
            {getDictionaryValueOrKey(titleLabel)}
          </h4>
          <div
            className="cmp-flyout__header-icon"
            onClick={onClose}
          >
            <DismissFilledIcon width="30" height="30" />
          </div>
        </section>
          {children}
        <section className="cmp-flyout__footer">
          {bottomContent && <BottomContent />}
          {enableButton && secondaryButton && <SecondaryButton/>}
          <button
            className={`cmp-flyout__footer-button ${enableButton ? 'cmp-flyout__footer-button--enabled' : ''}`}
            disabled={disabledButton}
            onClick={onClickButton}
          >
            {!isLoading && getDictionaryValueOrKey(buttonLabel)} {isLoading && <LoaderIcon />}
          </button>
        </section>
      </div>
    </Drawer>
  );
}

export default BaseFlyout;
