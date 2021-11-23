import React, { useEffect, useState } from 'react';
import Loader from '../Widgets/Loader';
import Vendor from './Vendor';
import { get } from '../../../../utils/api';

function VendorConnection({ header, vendors, apiUrl, connectedLabel, disconnectedLabel, signInRequest }) {
	const [fetchedVendors, setFetchedVendors] = useState(null);
	const [error, setError] = useState(null);
	const ENDPOINTS = {
		VendorConnect: apiUrl + '/vendor/connect',
		VendorDisconnect: apiUrl + '/vendorDisconnect',
		VendorRefreshToken: apiUrl + '/vendorRefreshToken',
		GetValidAccessToken: apiUrl + '/getValidAccessToken',
		GetVendorConnections: apiUrl + '/getVendorConnections',
	};

	async function vendorLogin(code, vendorName) {
		const url = ENDPOINTS.VendorConnect;
		try {
			await get(url + `?code=${code}&vendor=${vendorName}&redirectUri=${window.location.href}`);
			const response = await get(ENDPOINTS.GetVendorConnections);
			return response;
		} catch (e) {
			setError(`${vendorName} connect failed.`);
			console.error(`${vendorName} connect failed:`);
			console.error(e);
			return false;
		}
	}

	useEffect(() => {
		let isMounted = true;
		async function _() {
			let response = null;
			if (signInRequest) {
				response = await vendorLogin(signInRequest.code, signInRequest.vendor);
			} else {
				response = await get(ENDPOINTS.GetVendorConnections);
			}
			isMounted && setFetchedVendors(response.data?.content?.items);
		}
		_();
		return () => {
			isMounted = false;
		};
	}, []);

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
								vendorConfig={vendors}
								connectedLabel={connectedLabel}
								disconnectedLabel={disconnectedLabel}
							></Vendor>
						))}
					</div>
				) : (
					<Loader visible={error ? false : true}></Loader>
				)}
			</div>
			{error && <div className='cmp-vendor-connection__error'>{error}</div>}
		</section>
	);
}

export default VendorConnection;
