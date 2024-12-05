import React, { forwardRef, useRef, useEffect } from 'react';

/**
 * Toast component that wraps the `tds-toast` web component.
 *
 * @param {Object} props - Component properties.
 * @param {'information' | 'confirmation' | 'alert' | 'error'} props.variant - Variant of the toast.
 * @param {'small' | 'medium' | 'large'} props.size - Size of the toast.
 * @param {'top-center' | 'middle-center' | 'bottom-center'} props.placement - Placement of the toast on the screen.
 * @param {boolean} props.show - Determines if the toast is visible.
 * @param {React.ReactNode} props.children - Slot content inside the toast.
 * @param {Object} rest - Additional props for the `tds-toast` element.
 * @param {React.Ref} ref - React reference to the toast.
 * @returns {JSX.Element} The rendered Toast component.
 */
const Toast = forwardRef(
  (
    {
      variant,
      size,
      placement,
      show,
      children,
      ...rest
    },
    ref
  ) => {
    const toastRef = useRef();
    const combinedRef = ref || toastRef;

    useEffect(() => {
      const toastElement = combinedRef.current;
      if (toastElement) {
        // Add any required event listeners
      }
    }, [combinedRef]);

    return (
      <tds-toast
        ref={combinedRef}
        variant={variant}
        size={size}
        placement={placement}
        show={show}
        {...rest}
      >
        {children}
      </tds-toast>
    );
  }
);

/**
 * ToastHeader component for the header of the toast.
 *
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Content for the toast header.
 * @returns {JSX.Element} The rendered ToastHeader component.
 */
const ToastHeader = ({ children, ...rest }) => (
  <tds-toast-header {...rest}>{children}</tds-toast-header>
);

/**
 * ToastBody component for the body of the toast.
 *
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Content for the toast body.
 * @returns {JSX.Element} The rendered ToastBody component.
 */
const ToastBody = ({ children, ...rest }) => (
  <tds-toast-body {...rest}>{children}</tds-toast-body>
);

/**
 * ToastLink component for the link inside the toast body.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.url - URL for the link.
 * @param {string} props.target - Target for the link (_self, _blank, etc.).
 * @param {React.ReactNode} props.children - Content for the link text.
 * @returns {JSX.Element} The rendered ToastLink component.
 */
const ToastLink = ({ url, target, children, ...rest }) => (
  <tds-toast-link url={url} target={target} {...rest}>
    {children}
  </tds-toast-link>
);

// Export components
export { Toast, ToastHeader, ToastBody, ToastLink };
export default Toast;
