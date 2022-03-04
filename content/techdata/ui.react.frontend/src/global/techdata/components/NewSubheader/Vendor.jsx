import React, { useEffect, useState } from 'react';
import SlideToggle from '../Widgets/SlideToggle';
import { get } from '../../../../utils/api';
import { useMounted } from '../../hooks/useMounted';

function Vendor({ endpoints, fetchedVendor, vendorConfig, connectedLabel, disconnectedLabel }) {
	let { vendor, isConnected, connectionDate, isValidRefreshToken, userId } = fetchedVendor;
	const [vendorToggled, setVendorToggled] = useState(isConnected);
	const [toggleInProcess, setToggleInProcess] = useState(false);
	const [error, setError] = useState(false);
	const mounted = useMounted();
	const config = vendorConfig?.vendors?.find((v) => v.key?.toLowerCase() === vendor.toLowerCase());

	// API calls
	async function vendorDisconnect(vendor) {
		const url = vendorConfig.disconnectEndPoint;
		try {
			await get(url + `?vendor=${vendor}`);
			return true;
		} catch (e) {
			console.error(`${vendor} disconnect failed:`);
			console.error(e);
			return false;
		}
		return false;
	}

	function redirectToVendorPortal(href) {
		if (href) {
			window.location.replace(href);
		}else {
			console.error("Connection URL not found")
			return false;
		}
	}

	// Component specific functions
	async function toggleStateChanged(state) {
		let result = false;
		switch (state) {
			case false:
				result = await vendorDisconnect(vendor);
				return result;
			default:
				result = redirectToVendorPortal(config?.logInUrl);
				return result;
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

	return ( config ? (
		<div className='cmp-vendor-connection__vendors__vendor'>
			<div className='cmp-vendor-connection__vendors__vendor__logo'>
				{config && config.iconPath ? (
					<img className={'cmp-vendor-connection__vendors__vendor__logo__img'} src={config.iconPath}></img>
				) : (
					<div className={'cmp-vendor-connection__vendors__vendor__logo__text'}>{vendor}</div>
				)}
			</div>
			<div className='cmp-vendor-connection__vendors__vendor__status'>
				{vendorToggled ? connectedLabel ?? 'Connected' : disconnectedLabel ?? 'Disconnected'}
				{userId && 
					<div>
						CCO ID: {userId}
					</div>
				}
				
			</div>
			<div className='cmp-vendor-connection__vendors__vendor__toggler'>
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
		</div>) : null
	);
}
export default Vendor;
