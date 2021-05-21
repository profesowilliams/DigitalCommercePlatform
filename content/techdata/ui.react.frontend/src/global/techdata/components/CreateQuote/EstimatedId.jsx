import React, { useEffect, useState } from 'react';
import Button from '../Widgets/Button';
import WidgetTitle from '../Widgets/WidgetTitle';
import Dropdown from '../Widgets/Dropdown';
import RadioButtons from '../Widgets/RadioButtons';
import ManuallyTyped from './ManuallyTyped';
import EstimatedIdSelectItem from './EstimatedIdSelectItem';

const EstimatedId = ({ method, setMethod, methods, endpoints, next }) => {
	const { estimatedIdListEndpoint, estimatedIdDetailsEndpoint } = endpoints;
	const estimatedTypes = [
		{ id: 'manually', name: 'Enter Estimate ID' },
		{ id: 'browse', name: 'Browse Estimates' },
	];
	const [estimatedType, setEstimatedType] = useState(false);
	const [estimatedId, setEstimatedId] = useState("");
	const [step, setStep] = useState(0);
	const nextStep = () => {
		setStep(1);
	};
	const prevStep = () => {
		setStep(0);
	};
	const goToNext = (id) => next(id)
	const onError = {
    errorMsg: 'We couldn´t find the Estimate ID:',
    msgBeforelink: 'Enter a new ID or',
    msgAfterlink: 'instead',
    linklabel: 'browse estimates',
    linkFunction: () => setEstimatedType(estimatedTypes[1])
  }

	return (
		<>
			<WidgetTitle>
				{step > 0 ? (
					<a onClick={prevStep}>
						<i className='fas fa-chevron-left'></i> {method.title}
					</a>
				) : (
					method.title
				)}
			</WidgetTitle>
			{step === 0 && (
				<>
					<Dropdown selected={method} setValue={setMethod} options={methods} />
					<RadioButtons selected={estimatedType} options={estimatedTypes} onSelect={(val) => setEstimatedType(val)} />
				</>
			)}
			{step > 0 && estimatedType && estimatedType.id === 'manually' && (
				<>
					<ManuallyTyped
					validateCartEndpoint={estimatedIdDetailsEndpoint}
					inputValue={estimatedId}
					setValue={setEstimatedId}
					label={method.textPlaceholder}
					onClick={goToNext}
					onError={onError} />
				</>
			)}
			{step > 0 && estimatedType && estimatedType.id === 'browse' && (
				<EstimatedIdSelectItem
					onClick={goToNext}
					buttonTitle='Next'
					estimatedIdlistEndpoint={estimatedIdListEndpoint}
					estimatedIddetailsEndpoint={estimatedIdDetailsEndpoint}
					label={method.dropdownPlaceholder}
				/>
			)}
			{step === 0 && (
				<Button disabled={!estimatedType} onClick={nextStep}>
					Next
				</Button>
			)}
		</>
	);
};

export default EstimatedId;
