import React, { useEffect, useState } from 'react';
import Button from '../Widgets/Button';
import WidgetTitle from '../Widgets/WidgetTitle';
import Dropdown from '../Widgets/Dropdown';
import RadioButtons from '../Widgets/RadioButtons';
import ManuallyTyped from './ManuallyTyped';
// import SavedCartSelectItem from './SavedCartSelectItem';

const EstimatedId = ({ method, setMethod, methods, createQuote, buttonTitle, endpoints }) => {
	// const { cartslistEndpoint, cartdetailsEndpoint } = endpoints;
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

	const manuallyCreateQuote = () => {
		//this alert should be a endpoint to validate the cart name provided by the user
		alert('Validating Estimate Name...');
		if (cartName) {
			createQuote();
		} else {
			alert('Write a Estimate name to continue.');
		}
	};

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
					<ManuallyTyped inputValue={estimatedId} setValue={setEstimatedId} label='Estimate ID' />
					<Button disabled={!estimatedId} onClick={manuallyCreateQuote}>
						{buttonTitle}
					</Button>
				</>
			)}
			{/* {step > 0 && cartType && cartType.id === 'browse' && (
				<SavedCartSelectItem
					onClick={createQuote}
					buttonTitle={buttonTitle}
					cartslistEndpoint={cartslistEndpoint}
					cartdetailsEndpoint={cartdetailsEndpoint}
				/>
			)} */}
			{step === 0 && (
				<Button disabled={!estimatedType} onClick={nextStep}>
					Next
				</Button>
			)}
		</>
	);
};

export default EstimatedId;
