import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';

function SimpleDatePicker({
	pickerKey,
	label,
	placeholder,
	forceZeroUTC,
	onSelectedDateChanged,
	isDateFrom = false,
	defaultValue = true,
	minDate,
	maxDate
}) {
	const [pickedDate, setPickedDate] = useState(null);
	const pickerRef = useRef(null);

	// Set the default dates data
	useEffect(() => {
		if (pickedDate === null && defaultValue) {
            
			if (isDateFrom) {
				const dateOneMounthAgo = new Date();
				dateOneMounthAgo.setDate(dateOneMounthAgo.getDate() - 31)
				setPickedDate(dateOneMounthAgo);
				const newFrom = getNormalizedDate(dateOneMounthAgo);
				onSelectedDateChanged({ key: 'from', value: newFrom, isDefault: true });
			} else {
				const now = new Date();
				setPickedDate(now);
				const newTo = getNormalizedDate(now);
				onSelectedDateChanged({ key: 'to', value: newTo, isDefault: true });
			}
		}
		if (!defaultValue) {
			setPickedDate(null)
		}
	}, [isDateFrom, pickedDate, defaultValue]);

	function getNormalizedDate(dateValue) {
		return forceZeroUTC
			? new Date(dateValue.setTime(dateValue.getTime() - dateValue.getTimezoneOffset() * 60 * 1000))
			: dateValue;
  }

	function openPicker() {
		pickerRef.current.setOpen(true);
	}

	function pickerValueChanged(date) {
		const _date = getNormalizedDate(date);
		
		setPickedDate(date);

		onSelectedDateChanged({ key: pickerKey, value: _date });
	}

	return (
		<>
			<span className='cmp-simple-date-picker'>
				{label && <div className='cmp-simple-date-picker__label'>{label}</div>}
				<div className='cmp-simple-date-picker__picker'>
					<DatePicker
						maxDate={maxDate}
						minDate={minDate}
						selected={pickedDate}
						onChange={(date) => pickerValueChanged(date)}
						placeholderText={placeholder}
						ref={(c) => (pickerRef.current = c)}
					></DatePicker>
				</div>
				<div className='cmp-simple-date-picker__icon' onClick={openPicker}>
					<i className='fas fa-calendar-alt'></i>
				</div>
			</span>
		</>
	);
}
export default SimpleDatePicker;
