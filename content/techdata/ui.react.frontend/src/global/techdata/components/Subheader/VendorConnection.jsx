import React, { useState, useEffect } from 'react';

function VendorConnection({ header, vendors, apiUrl, connectedLabel, disconnectedLabel }) {
	const [vendorStatus, setVendorStatus] = useState(null);

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
								<div className='status'>STATUS</div>
								<div className='toggler'>TOGGLER</div>
							</div>
						))}
					</div>
				)}
			</div>
		</section>
	);
}

export default VendorConnection;
