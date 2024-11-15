import React, { useEffect, useRef } from 'react';

/**
 * A wrapper component for the `tds-tooltip` web component with additional functionality.
 *
 * @param {object} props - The properties object.
 * @param {string} props.text - The tooltip text.
 * @param {string} props.placement - The tooltip placement (e.g., 'top', 'bottom', 'right', etc.).
 * @param {string} props.strategy - The positioning strategy, either 'absolute' or 'fixed'.
 * @param {number|object|function} props.offset - Offset options for distance, axes, or custom function.
 * @param {boolean} props.shift - Enables shifting to prevent overflow.
 * @param {boolean} props.flip - Enables flipping to keep the tooltip in view.
 * @param {boolean} props.arrow - Enables arrow positioning to point to the reference element.
 * @param {number} props.arrowPadding - Padding between the arrow and edges of the floating element.
 * @param {boolean} props.size - Limits tooltip size based on viewport.
 * @param {boolean} props.hide - Controls whether the tooltip should be hidden when detached.
 *  * @param {React.ReactNode} props.children - Additional content or elements to be wrapped by the tooltip.
 * @returns {JSX.Element} The rendered `tds-tooltip` component.
 */
const Tooltip = ({
  text,
  placement,
  strategy,
  offset,
  shift,
  flip,
  arrow,
  arrowPadding,
  size,
  hide,
    children,
  ...rest
}) => {
  const tooltipRef = useRef();

  return (
    <tds-tooltip
      ref={tooltipRef}
      text={text}
      placement={placement}
      strategy={strategy}
      offset={offset}
      shift={shift}
      flip={flip}
      arrow={arrow}
      arrow-padding={arrowPadding}
      size={size}
      hide={hide}
      {...rest} // Spread any additional props
    >
      {children}
    </tds-tooltip>
  );
};

export default Tooltip;
