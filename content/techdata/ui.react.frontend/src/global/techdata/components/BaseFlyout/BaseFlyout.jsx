import { Drawer } from '@mui/material';
import React, { useEffect } from 'react';
import Button from "../Widgets/Button";
import { DismissFilledIcon, LoaderIcon, SyncIcon} from '../../../../fluentIcons/FluentIcons';
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
  disabledButton,
  onClickButton,
  bottomContent,
  selected,
  secondaryButton,
  isTDSynnex,
  analyticsData,
  analyticsCallback,
  buttonsSection = null,
  classText = '',
  isShareFlyout,
  loadingButtonLabel
}) {
  const BottomContent = () => bottomContent('footer');
  const SecondaryButton = () => secondaryButton(selected, secondaryButtonLabel);

  useEffect(() => {
    let timer;
    if (open) {
      timer = setTimeout(() => (document.body.style.paddingRight = '0px'), 333);
    } else {
      document.body.style.removeProperty('padding-right');
    }
    return () => {
      document.body.style.removeProperty('padding-right');
      clearTimeout(timer);
    };
  }, [open]);

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiPaper-root': {
          width,
          '@media (max-width: 600px)': {
            width: '100%',
          },
        },
      }}
    >
      <div className={`cmp-flyout ${classText} ${isTDSynnex && 'cmp-flyout-td-synnex'}`}>
        <section className="cmp-flyout__header">
          <h4 className="cmp-flyout__header-title">
            {getDictionaryValueOrKey(titleLabel)}
          </h4>
          <div className="cmp-flyout__header-icon" onClick={onClose}>
            <DismissFilledIcon width="30" height="30" />
          </div>
        </section>
        {children}
        <section className="cmp-flyout__footer">
          {bottomContent && <BottomContent />}
          {buttonsSection || (
            <div className="cmp-flyout__footer-buttons">
              {!disabledButton && secondaryButton && <SecondaryButton />}
              <Button
                btnClass={`cmp-flyout__footer-button ${
                  !disabledButton && 'cmp-flyout__footer-button--enabled'
                }`}
                disabled={disabledButton}
                onClick={onClickButton}
                analyticsCallback={analyticsCallback}
              >
                {
                  (isLoading && isShareFlyout) ? (
                    <>
                      <SyncIcon />{getDictionaryValueOrKey(loadingButtonLabel)}
                    </>
                  ) : getDictionaryValueOrKey(buttonLabel)
                }
                {isLoading && !isShareFlyout && <LoaderIcon />}
              </Button>
            </div>
          )}
        </section>
      </div>
    </Drawer>
  );
}

export default BaseFlyout;
