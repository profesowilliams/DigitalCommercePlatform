import React, { useState, useEffect } from 'react';
import SlideToggle from '../Widgets/SlideToggle';

function VendorConnection({ header, vendors, apiUrl, connectedLabel, disconnectedLabel }) {
	const [vendorStatus, setVendorStatus] = useState(null);
	const [vendorToggled, setVendorToggled] = useState(false);

	function toggleStateChanged(state) {
		setVendorToggled(state);
	}

	return (
		<section>
			<div className='cmp-vendor-connection'>
				<div className='cmp-vendor-connection__header'>{header}</div>
				{vendors && (
					<div className='cmp-vendor-connection__vendors'>
						{vendors.map((vendor, index) => (
							<div className='cmp-vendor-connection__vendors__vendor' key={index}>
								<div className='logo'>
									{/* <img src={vendor.value}></img> */}
									{vendor.key}
								</div>
								<div className='status'>
									{vendorToggled ? connectedLabel ?? 'Connected' : disconnectedLabel ?? 'Disconnected'}
								</div>
								<div className='toggler'>
									<SlideToggle toggled={vendorToggled} onToggleChanged={toggleStateChanged}></SlideToggle>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</section>
	);
}

export default VendorConnection;
