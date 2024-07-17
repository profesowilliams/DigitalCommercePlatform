import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import moment from 'moment';

/**
 * MaskedDateInput component for handling date input with a mask.
 * 
 * @param {Object} props - Properties passed to the component.
 * @param {Object} props.translations - Translations object, including date format.
 * @param {Date|string} props.value - Initial date value.
 * @param {Function} props.onChange - Function called when the date value changes.
 */
const MaskedDateInput = ({ translations, value, onChange }) => {
  console.log('MaskedDateInput::init[' + value + ']');

  // State to store the internal value of the input field
  const [internalValue, setInternalValue] = useState(value);

  /**
   * Function to handle changes to the input field value.
   * 
   * @param {Object} e - Event object.
   */
  const handleInputChange = (e) => {
    console.log('MaskedDateInput::handleInputChange');
    const { value } = e.target;
    setInternalValue(value);
  };

  /**
   * Function to handle the blur event on the input field.
   * 
   * @param {Object} e - Event object.
   */
  const handleBlur = (e) => {
    console.log('MaskedDateInput::handleBlur');
    const { value } = e.target;
    const date = moment(value, translations?.DateFormat).toDate();

    console.log('MaskedDateInput::trigger onChange[' + value + ']');

    if (isNaN(date.getTime())) {
      // If the date is invalid, clear the input field
      setInternalValue('');
    } else {
      if (date > new Date()) {
        // If the date is in the future, set the date to today
        setInternalValue(moment().format(translations?.DateFormat));
        onChange(new Date());
      } else if (date < new Date('2010')) {
        // If the date is in the past, set the date to 2010-01-01
        setInternalValue(moment('2010-01-01').format(translations?.DateFormat));
        onChange(new Date('2010'));
      } else {
        // Otherwise, set the date to the parsed date
        onChange(date);
      }
    }
  };

  /**
  * Replaces all letters in a string with the digit 9.
  * 
  * @param {string} dateString - The input string in the format dd/mm/yyyy.
  * @returns {string} - The transformed string with letters replaced by 9.
  */
  const replaceLettersWith9 = (dateString) => {
    // Regular expression to match all letters (both uppercase and lowercase)
    const letterRegex = /[a-zA-Z]/g;

    // Replace all letters with the digit 9
    return dateString.replace(letterRegex, '9');
  }

  // Synchronize inputs when selectionRange changes
  useEffect(() => {
    console.log('MaskedDateInput::useEffect::value');
    setInternalValue(value
      ? moment(value).format(translations?.DateFormat)
      : '');
  }, [value]);

  return (
    <InputMask
      mask={replaceLettersWith9(translations?.DateFormat)}
      placeholder={translations?.DateFormat}
      value={internalValue}
      onChange={handleInputChange}
      onBlur={handleBlur}
      className="date-range-input"
    />
  );
};

export default MaskedDateInput;