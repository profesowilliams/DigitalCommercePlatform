import { Drawer } from '@mui/material';
import React, { useEffect } from 'react';
import Button from '../Widgets/Button';
import usePositionBelowSubheader from '../../hooks/usePositionBelowSubheader';
import { DismissFilledSmallIcon, LoaderIcon } from '../../../../fluentIcons/FluentIcons';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

/**
 * BaseFlyout component
 * - Renders a flyout panel with a header, content, and footer.
 * - Provides functionality to handle opening, closing, and positioning.
 * @param {Object} props - Component props
 * @param {boolean} props.open - Determines if the flyout is open
 * @param {Function} props.onClose - Callback function invoked when the flyout closes
 * @param {string} props.width - Width of the flyout
 * @param {string} props.anchor - Side of the screen where the flyout appears
 * @param {React.Ref} props.subheaderReference - Reference to the subheader element for positioning
 * @param {string} props.titleLabel - Title label for the flyout header
 * @param {string} props.buttonLabel - Label for the primary button in the footer
 * @param {string} props.secondaryButtonLabel - Label for the secondary button in the footer
 * @param {boolean} props.isLoading - Indicates if the primary button is in a loading state
 * @param {boolean} props.disabledButton - Indicates if the primary button is disabled
 * @param {Function} props.onClickButton - Callback function invoked when the primary button is clicked
 * @param {Function} props.bottomContent - Function to render custom content in the footer
 * @param {boolean} props.selected - Indicates if an item is selected
 * @param {Function} props.secondaryButton - Function to render the secondary button
 * @param {boolean} props.isTDSynnex - Determines if the TDSynnex styling should be applied
 * @param {Function} props.analyticsCallback - Callback function for analytics tracking
 * @param {React.ReactNode} props.buttonsSection - Custom buttons section for the footer
 */
function BaseFlyout({
  children,
  open,
  onClose,
  width = '360px',
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
  analyticsCallback,
  buttonsSection = null,
}) {
  // Component for rendering custom bottom content
  const BottomContent = () => bottomContent('footer');

  // Component for rendering the secondary button
  const SecondaryButton = () => secondaryButton(selected, secondaryButtonLabel);

  // Use custom hook for positioning the flyout below the subheader
  const { positioning } = usePositionBelowSubheader(
    { unmountedFn: false },
    subheaderReference
  );
  const { top, height } = positioning;

  // Side effect to handle flyout open/close behavior
  useEffect(() => {
    document.documentElement.style.setProperty('overflow-y', 'visible');
    let timer;

    if (open) {
      timer = setTimeout(() => {
        document.body.style.paddingRight = '0px';
      }, 333);
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
          ...(top && height ? { top, height } : {}),
          '@media (max-width: 600px)': {
            width: '100%',
          },
        },
      }}
    >
      <div className={`cmp-flyout ${isTDSynnex && 'cmp-flyout-td-synnex'}`}>
        <section className="cmp-flyout__header">
          <h4 className="cmp-flyout__header-title">
            {getDictionaryValueOrKey(titleLabel)}
          </h4>
          <div className="cmp-flyout__header-icon" onClick={onClose}>
            <DismissFilledSmallIcon />
          </div>
        </section>
        {children}
        <section className="cmp-flyout__footer">
          {bottomContent && <BottomContent />}
          {buttonsSection || (
            <div className="cmp-flyout__footer-buttons">
              {!disabledButton && secondaryButton && <SecondaryButton />}
              <Button
                btnClass={`cmp-flyout__footer-button ${!disabledButton && 'cmp-flyout__footer-button--enabled'
                  }`}
                disabled={disabledButton}
                onClick={onClickButton}
                analyticsCallback={analyticsCallback}
              >
                {!isLoading && getDictionaryValueOrKey(buttonLabel)}{' '}
                {isLoading && <LoaderIcon />}
              </Button>
            </div>
          )}
        </section>
      </div>
    </Drawer>
  );
}

export default BaseFlyout;
