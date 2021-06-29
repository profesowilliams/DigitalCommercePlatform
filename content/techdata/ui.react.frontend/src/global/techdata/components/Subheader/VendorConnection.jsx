import React from 'react';
import Loader from '../Widgets/Loader';
import Vendor from './Vendor';
import { useGet } from '../../hooks/useGet';

function VendorConnection({ header, vendors, apiUrl, connectedLabel, disconnectedLabel }) {
	const fetchedVendors = useGet(apiUrl)?.content?.items;

	return (
		<section>
			<div className='cmp-vendor-connection'>
				<div className='cmp-vendor-connection__header'>{header}</div>
				{fetchedVendors ? (
					<div className='cmp-vendor-connection__vendors'>
						{fetchedVendors.map((vendor, index) => (
							<Vendor
								key={index}
								apiUrl={apiUrl}
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
