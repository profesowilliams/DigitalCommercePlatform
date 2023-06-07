import React, { useEffect, useState } from 'react';
import Loader from '../Widgets/Loader';
import Vendor from './Vendor';
import { get } from '../../../../utils/api';

function VendorConnection({ vendorConfig, signInRequest }) {
	const [fetchedVendors, setFetchedVendors] = useState(null);
	const [error, setError] = useState(null);
	const ENDPOINTS = {
		getConnectionsEndPoint: vendorConfig.getConnectionsEndPoint,
		setConnectionsEndPoint: vendorConfig.setConnectionsEndPoint,
		vendorConnectionDataRefreshEndpoint: vendorConfig.vendorConnectionDataRefreshEndpoint
	};

	async function vendorLogin(code, vendorName, redirectURL) {
		const url = ENDPOINTS.setConnectionsEndPoint;
		try {
			const response = await get(url + `?code=${code}&vendor=${vendorName}&redirectURL=${redirectURL}`);
			return response;
		} catch (e) {
			setError(`${vendorName} connect failed.`);
			console.error(`${vendorName} connect failed:`);
			console.error(e);
			return false;
		}
	}

	function getSignInURL(vendorFromRequest)
	{
		let vendorKey = vendorConfig?.vendors?.find( vendor => vendor.key == vendorFromRequest);
		return vendorKey?.connectLandingPage;
	}

	useEffect(() => {
		let isMounted = true;
		async function _() {
			let response = null;
			if (signInRequest) {
				let vendorLoginResponse = await vendorLogin(signInRequest.code, signInRequest.vendor, getSignInURL(signInRequest.vendor));
				if (!vendorLoginResponse) {
					console.error("vendor connection for vendor " + signInRequest.vendor + ", failed");
				}else{
					response = await get(ENDPOINTS.getConnectionsEndPoint);
				}

			} else {
				response = await get(ENDPOINTS.getConnectionsEndPoint);
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
				<div className='cmp-vendor-connection__header'>{vendorConfig.title}</div>
				{fetchedVendors ? (
					<div className='cmp-vendor-connection__vendors'>
						{fetchedVendors.map((vendor, index) => (
							<Vendor
								vendorConfig={vendorConfig}
								key={index}
								endpoints={ENDPOINTS}
								fetchedVendor={vendor}
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
