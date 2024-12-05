import React from 'react';

/**
 * Wrapper for the `tds-dropdown` component inside the flyout.
 *
 * @param {object} props - The properties object.
 * @param {string} props.id - The id for the dropdown component.
 * @param {boolean} [props.required] - Whether the dropdown is required.
 * @param {string} props.optionTextKey - Key for option text.
 * @param {string} props.optionValueKey - Key for option value.
 * @param {string} props.options - JSON stringified options.
 * @param {boolean} [props.disabled] - Whether the dropdown is disabled.
 * @param {function} props.onValueChanged - Callback when value changes.
 * @param {React.ReactNode} props.children - Dropdown label or content.
 * @returns {JSX.Element} The rendered `tds-dropdown` component.
 */
const Dropdown = ({
  id,
  required,
  optionTextKey,
  optionValueKey,
  options,
  disabled,
  onValueChanged,
  children,
  ...rest
}) => {
  const handleValueChanged = (event) => {
    if (onValueChanged) {
      onValueChanged(event.detail); // Pass the event detail to the handler
    }
  };

  return (
    <tds-dropdown
      id={id}
      required={required}
      optionTextKey={optionTextKey}
      optionValueKey={optionValueKey}
      options={options}
      disabled={disabled}
      onValueChanged={handleValueChanged} // Attach listener here
      {...rest}
    >
      {children}
    </tds-dropdown>
  );
};

export default Dropdown;
