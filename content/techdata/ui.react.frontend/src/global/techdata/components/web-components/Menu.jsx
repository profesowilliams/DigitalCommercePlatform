/**
 * @fileoverview Contains the Menu and MenuItem components as React wrappers
 * for the `tds-menu` and `tds-menu-item` web components.
 */

import React, { forwardRef, useEffect, useRef } from 'react';

/**
 * Menu component wrapper for the `tds-menu` web component.
 *
 * @param {Object} props - The properties object.
 * @param {boolean} props.open - Whether the menu is open.
 * @param {string} props.placement - The placement of the menu (e.g., 'top', 'bottom-start').
 * @param {string} props.strategy - The positioning strategy (e.g., 'absolute', 'fixed').
 * @param {boolean} props.autoPlacement - Enable automatic placement.
 * @param {boolean} props.arrow - Display the arrow element.
 * @param {string} props.triggerSelector - CSS selector for the menu trigger element.
 * @param {string | Element | Array<Element> | 'clippingAncestors'} props.boundary - The boundary element or type.
 * @param {React.ReactNode} props.children - The menu content.
 * @param {React.Ref} ref - React reference for the menu component.
 * @returns {JSX.Element} The rendered Menu component.
 */
const Menu = forwardRef(
  (
    {
      open,
      strategy,
      triggerSelector,
      boundary,
      children,
      ...rest
    },
    ref
  ) => {
    const menuRef = useRef();

    // Use provided ref or internal ref
    const combinedRef = ref || menuRef;

    // Handle attribute updates for the web component
    useEffect(() => {
      const menuElement = combinedRef.current;

      if (menuElement) {
        menuElement.open = open;
        menuElement.strategy = strategy;
        menuElement.triggerSelector = triggerSelector;

        // Pass boundary to the web component
        menuElement.boundary = boundary;
      }
    }, [
      open,
      strategy,
      triggerSelector,
      boundary,
      combinedRef,
    ]);

    return (
      <tds-menu ref={combinedRef} {...rest}>
        {children}
      </tds-menu>
    );
  }
);

/**
 * MenuItem component wrapper for the `tds-menu-item` web component.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.value - The value of the menu item.
 * @param {boolean} props.disabled - Whether the menu item is disabled.
 * @param {React.ReactNode} props.children - The content of the menu item.
 * @param {React.Ref} ref - React reference for the menu item component.
 * @returns {JSX.Element} The rendered MenuItem component.
 */
const MenuItem = forwardRef(({ onClick, children, ...props }, ref) => {
  const handleClick = (event) => {
    // Call the onClick handler if provided
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <tds-menu-item ref={ref} onClick={handleClick} {...props}>
      {children}
    </tds-menu-item>
  );
});

/**
 * Button component inside the Menu, for user actions.
 *
 * @param {Object} props - Component properties.
 * @param {React.Ref} ref - React reference for the button.
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @returns {JSX.Element} The rendered MenuButton component.
 */
const MenuButton = forwardRef((props, ref) => (
  <tds-menu-button ref={ref} {...props}>
    {props.children}
  </tds-menu-button>
));

const MenuIcon = ({
  name,
  state,
  size,
  viewbox,
  flip,
  rotate,
  width,
  height,
  svgContent,
  ...rest
}) => {
  const iconRef = useRef();

  return (
    <tds-menu-icon
      ref={iconRef}
      name={name}
      state={state}
      size={size}
      viewbox={viewbox}
      flip={flip}
      rotate={rotate}
      width={width}
      height={height}
      svgContent={svgContent}
      {...rest}
    ></tds-menu-icon>
  );
};

// Export all components
export { Menu, MenuItem, MenuButton, MenuIcon };
export default Menu;
