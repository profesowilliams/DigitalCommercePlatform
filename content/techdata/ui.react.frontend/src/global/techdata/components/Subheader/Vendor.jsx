import React, { useState } from 'react';
import SlideToggle from '../Widgets/SlideToggle';

function Vendor({ fetchedVendor, vendorsConfig, connectedLabel, disconnectedLabel }) {
	let { vendor, isConnected, connectionDate, isValidRefreshToken } = fetchedVendor;
	const [vendorToggled, setVendorToggled] = useState(isConnected);

	function toggleStateChanged(state) {
		setVendorToggled(state);
	}

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
				<SlideToggle toggled={vendorToggled} onToggleChanged={toggleStateChanged}></SlideToggle>
			</div>
		</div>
	);
}
export default Vendor;
