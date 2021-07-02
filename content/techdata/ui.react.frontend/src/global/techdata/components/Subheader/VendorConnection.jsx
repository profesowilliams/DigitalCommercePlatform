import React from 'react';
import Loader from '../Widgets/Loader';
import Vendor from './Vendor';
import { useGet } from '../../hooks/useGet';

function VendorConnection({ header, vendors, apiUrl, connectedLabel, disconnectedLabel }) {
	const ENDPOINTS = {
		GetPunchOutURL: apiUrl + '/getPunchOutURL',
		VendorDisconnect: apiUrl + '/VendorDisconnect',
		VendorRefreshToken: apiUrl + '/VendorRefreshToken',
		GetValidAccessToken: apiUrl + '/GetValidAccessToken',
		GetVendorConnections: apiUrl + '/GetVendorConnections',
	};

	const fetchedVendors = useGet(ENDPOINTS.GetVendorConnections)?.content?.items;

	return (
		<section>
			<div className='cmp-vendor-connection'>
				<div className='cmp-vendor-connection__header'>{header}</div>
				{fetchedVendors ? (
					<div className='cmp-vendor-connection__vendors'>
						{fetchedVendors.map((vendor, index) => (
							<Vendor
								key={index}
								endpoints={ENDPOINTS}
								fetchedVendor={vendor}
								vendorsConfig={vendors}
								connectedLabel={connectedLabel}
								disconnectedLabel={disconnectedLabel}
							></Vendor>
						))}
					</div>
				) : (
					<Loader visible={true}></Loader>
				)}
			</div>
		</section>
	);
}

export default VendorConnection;
