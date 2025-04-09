import React, { useRef, forwardRef } from 'react';

/**
 * A wrapper component for the `tds-input` web component with additional functionality.
 *
 * @param {object} props - The properties object.
 * @param {string} props.type - The type of the input (e.g., 'text', 'password', 'email', etc.).
 * @param {string} props.placeholder - Placeholder text for the input.
 * @param {string} props.label - The label for the input.
 * @param {boolean} props.disabled - Whether the input is disabled.
 * @param {boolean} props.required - Whether the input is required.
 * @param {boolean} props.checked - For checkbox and radio, whether the input is checked.
 * @param {boolean} props.indeterminate - For checkbox, whether the input is in an indeterminate state.
 * @param {string} props.pattern - Regex pattern for validation (for types like 'tel').
 * @param {React.ReactNode} props.children - Additional elements or content to render inside the input.
 * @param {React.Ref} ref - A ref to be forwarded to the `tds-input` web component.
 * @returns {JSX.Element} The rendered `tds-input` component.
 */
const Input = forwardRef(
  (
    {
      type,
      placeholder,
      label,
      disabled,
      required,
      checked,
      indeterminate,
      pattern,
      readonly,
      value,
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <tds-input
        ref={ref}
        type={type}
        placeholder={placeholder}
        label={label}
        {...(disabled ? { disabled: true } : {})}
        {...(required ? { required: true } : {})}
        {...(checked ? { checked: true } : {})}
        {...(indeterminate ? { indeterminate: true } : {})}
        pattern={pattern}
        {...(readonly ? { readonly: true } : {})}
        value={value}
        {...rest} // Spread any additional props
      >
        {children}
      </tds-input>
    );
  }
);

export default Input;
export { Input };
