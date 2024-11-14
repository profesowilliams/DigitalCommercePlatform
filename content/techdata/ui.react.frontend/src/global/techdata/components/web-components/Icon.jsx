import React, { useRef } from 'react';

/**
 * A wrapper component for the `tds-icon` web component, allowing for icon customization.
 *
 * @param {object} props - The properties object.
 * @param {string} props.name - The name of the icon to display.
 * @param {string} props.state - The state of the icon (e.g., `default`, `active`).
 * @param {string} props.size - The size of the icon, usually in pixels.
 * @param {string} props.viewbox - The viewbox attribute for SVG scaling.
 * @param {string} props.flip - Specifies flipping of the icon (`horizontal`, `vertical`).
 * @param {string} props.rotate - Specifies rotation for the icon (degrees as a string).
 * @param {string} props.width - Width of the icon, typically in pixels.
 * @param {string} props.height - Height of the icon, typically in pixels.
 * @param {string} props.svgContent - Raw SVG content for the icon.
 * @param {object} props.rest - Additional props passed to the `tds-icon` element.
 * @returns {JSX.Element} The rendered `tds-icon` component.
 */
const Icon = ({
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
    <tds-icon
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
    ></tds-icon>
  );
};

export default Icon;
