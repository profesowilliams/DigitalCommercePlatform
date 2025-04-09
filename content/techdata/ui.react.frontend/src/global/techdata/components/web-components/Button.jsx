import React, { useEffect, useRef } from 'react';
import { pushDataLayer } from '../Analytics/analytics.js';
import { isDataLayerEnabled } from '../../../../utils/dataLayerUtils';

/**
 * A wrapper component for the `tds-button` web component with additional functionality.
 *
 * @param {object} props - The properties object.
 * @param {boolean} props.primary - Whether the button has primary styling.
 * @param {string} props.backgroundColor - Background color of the button.
 * @param {string} props.size - Size of the button (`small`, `medium`, `large`).
 * @param {string} props.label - Label text for the button.
 * @param {function} props.onClick - Click handler for the button.
 * @param {boolean} props.disabled - If `true`, disables the button.
 * @param {string} props.type - Button type (`button`, `link`, `submit`, `reset`).
 * @param {string} props.url - URL to navigate to on click.
 * @param {string} props.target - Target attribute (`_blank`, `_self`, etc.).
 * @param {string} props.variant - Button variant (`primary`, `secondary`, etc.).
 * @param {string} props.theme - Theme of the button (`light` or `dark`).
 * @param {boolean} props.minimal - Whether the button uses minimal styling.
 * @param {string} props.id - ID attribute for the button.
 * @param {string} props.name - Name attribute for the button.
 * @param {string} props.className - Additional class names for custom styling.
 * @param {string} props.color - Color of the button text or icon.
 * @param {boolean} props.compact - If `true`, makes the button compact.
 * @param {function} props.analyticsCallback - Optional callback for analytics events.
 * @param {React.ReactNode} props.children - Additional content or custom label.
 * @returns {JSX.Element} The rendered `tds-button` component.
 */
const Button = ({
  primary,
  backgroundColor,
  size,
  label,
  onClick,
  disabled,
  type,
  url,
  target,
  variant,
  theme,
  minimal,
  id,
  name,
  className,
  color,
  compact,
  analyticsCallback,
  children,
  ...rest
}) => {
  const buttonRef = useRef();

  useEffect(() => {
    /**
     * Handles the button click event, including analytics tracking.
     *
     * @param {Event} e - The click event.
     */
    const handleClick = (e) => {
      const analytics = analyticsCallback ? analyticsCallback() : undefined;
      if (isDataLayerEnabled() && analytics) {
        pushDataLayer(analytics);
      }
      if (onClick) {
        onClick(e);
      }
    };

    const buttonElement = buttonRef.current;
    if (buttonElement) {
      buttonElement.addEventListener('click', handleClick);
    }

    return () => {
      if (buttonElement) {
        buttonElement.removeEventListener('click', handleClick);
      }
    };
  }, [onClick, analyticsCallback]);


  return (
    <tds-button
      ref={buttonRef}
      primary={primary}
      backgroundColor={backgroundColor}
      size={size}
      label={label}
      {...(disabled ? { disabled: true } : {})}
      type={type}
      url={url}
      target={target}
      variant={variant}
      theme={theme}
      id={id}
      name={name}
      className={className}
      color={color}
      {...(compact ? { compact: true } : {})}
      {...rest} // Spread any additional props
    >
      {label || children}
    </tds-button>
  );
};

export default Button;
