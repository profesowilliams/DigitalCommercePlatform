import React, { useEffect, useState } from 'react';
import SlideToggle from '../Widgets/SlideToggle';
import { get } from '../../../../utils/api';
import { useMounted } from '../../hooks/useMounted';

function Vendor({ endpoints, fetchedVendor, vendorsConfig, connectedLabel, disconnectedLabel }) {
	let { vendor, isConnected, connectionDate, isValidRefreshToken } = fetchedVendor;
	const [vendorToggled, setVendorToggled] = useState(isConnected);
	const [toggleInProcess, setToggleInProcess] = useState(false);
	const [error, setError] = useState(false);
	const mounted = useMounted();

	// API calls
	async function vendorDisconnect(vendor) {
		//V1/VendorDisconnect?Vendor={Vendor}
		const url = endpoints.VendorDisconnect;
		try {
			await get(url + `?vendor=${vendor}`);
			return true;
		} catch (e) {
			console.error(`${vendor} disconnect failed:`);
			console.error(e);
			return false;
		}
	}

	async function vendorPortalLogin() {
		//V1/VendorPortalLogin?code={Code Received from VendorPortal Login}&Vendor={Vendor}
	}

	async function vendorRefreshToken() {
		//V1/VendorRefreshToken?Vendor={Vendor}
	}

	async function getValidAccessToken() {
		//V1/GetValidAccessToken?Vendor={Vendor}&UserID={userid}
	}

	// Component specific functions
	async function toggleStateChanged(state) {
		switch (state) {
			case false:
				const result = await vendorDisconnect(vendor);
				return result;
			default:
				// connect vendor
				// not yet implemented
				await new Promise((resolve) => setTimeout(resolve, 500));
		}
	}

	// Effects
	useEffect(() => {
		async function handleStateChange(state) {
			setToggleInProcess(true);
			const toggleStatus = await toggleStateChanged(state);
			toggleStatus ? setError(false) : setError(true);
			setToggleInProcess(false);
		}
		if (mounted & !error) {
			handleStateChange(vendorToggled);
		}
	}, [vendorToggled]);

	useEffect(() => {
		if (mounted && error) {
			setVendorToggled(!vendorToggled);
		}
	}, [error]);

	return (
		<div className='cmp-vendor-connection__vendors__vendor'>
			<div className='logo'>
				{/* <img src={vendor.value}></img> */}
				{vendor}
			</div>
			<div className='status'>
				{vendorToggled ? connectedLabel ?? 'Connected' : disconnectedLabel ?? 'Disconnected'}
			</div>
			<div className='toggler'>
				<SlideToggle
					key={vendorToggled}
					readOnly={toggleInProcess}
					toggled={vendorToggled}
					onToggleChanged={(state) => {
						setError(false);
						setVendorToggled(state);
					}}
				></SlideToggle>
			</div>
		</div>
	);
}
export default Vendor;
