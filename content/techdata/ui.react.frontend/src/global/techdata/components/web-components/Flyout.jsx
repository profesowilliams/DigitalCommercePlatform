/**
 * @fileoverview Contains the Flyout component and related subcomponents
 * such as FlyoutHeader, FlyoutBody, and FlyoutButton, for creating modular Flyout UIs.
 */
import React, { forwardRef } from 'react';

/**
 * Flyout component that serves as a wrapper for modal content.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.title - The title of the flyout.
 * @param {boolean|string} props.backdrop - Controls backdrop display, can be `true`, `false`, or `'static'`.
 * @param {boolean} props.show - Whether the flyout is visible.
 * @param {'sm'|'md'|'lg'|'xl'} props.size - Size of the flyout.
 * @param {'start'|'end'|'top'|'bottom'} props.placement - Placement of the flyout.
 * @param {React.ReactNode} props.children - The content of the flyout.
 * @param {Object} rest - Additional props passed to the `tds-flyout` element.
 * @param {React.Ref} ref - React reference for the flyout component.
 * @returns {JSX.Element} The rendered Flyout component.
 */
const Flyout = forwardRef(
  ({ title, backdrop, show, size, placement, children, ...rest }, ref) => (
    <tds-flyout
      ref={ref}
      title={title}
      backdrop={backdrop}
      show={show}
      size={size}
      placement={placement}
      {...rest}
    >
      {children}
    </tds-flyout>
  )
);

/**
 * Header section of the Flyout.
 *
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - The content inside the flyout header.
 * @returns {JSX.Element} The rendered FlyoutHeader component.
 */
const FlyoutHeader = ({ children }) => (
  <tds-flyout-header>{children}</tds-flyout-header>
);

/**
 * Title component for the FlyoutHeader section.
 *
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - The title content.
 * @returns {JSX.Element} The rendered FlyoutTitle component.
 */
const FlyoutTitle = ({ children }) => (
  <tds-flyout-title>{children}</tds-flyout-title>
);

/**
 * Body section of the Flyout for main content.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.id - Optional ID for the flyout body.
 * @param {React.ReactNode} props.children - The main content inside the flyout body.
 * @returns {JSX.Element} The rendered FlyoutBody component.
 */
const FlyoutBody = ({ id, children }) => (
  <tds-flyout-body id={id}>{children}</tds-flyout-body>
);

/**
 * Footer section of the Flyout for actions or additional content.
 *
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - The content inside the flyout footer.
 * @returns {JSX.Element} The rendered FlyoutFooter component.
 */
const FlyoutFooter = ({ children }) => (
  <tds-flyout-footer>{children}</tds-flyout-footer>
);

/**
 * Button component inside the Flyout, for user actions.
 *
 * @param {Object} props - Component properties.
 * @param {React.Ref} ref - React reference for the button.
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @returns {JSX.Element} The rendered FlyoutButton component.
 */
const FlyoutButton = forwardRef((props, ref) => (
  <tds-flyout-button ref={ref} {...props}>
    {props.children}
  </tds-flyout-button>
));

// Export all components
export {
  Flyout,
  FlyoutHeader,
  FlyoutTitle,
  FlyoutBody,
  FlyoutFooter,
  FlyoutButton,
};
export default Flyout;
