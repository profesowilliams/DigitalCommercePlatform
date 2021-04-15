import React, { useEffect, useState, Fragment } from 'react';
import { get } from '../../../../utils/api';

function MyRenewals(props) {
	const componentProp = JSON.parse(props.componentProp);
	const [payload, setPayload] = useState(null);

	async function getRenewalsData() {
		const response = await get(componentProp.uiServiceEndPoint);
		if (!payload) setPayload(response.data);
	}

	useEffect(() => {
		getRenewalsData();
	}, []);

	return (
		<section id='cmp-renewals'>
			{payload ? (
				<Fragment>
					<div className='cmp-renewals'>
						<div className='cmp-renewals__title'>{componentProp.label}</div>
					</div>
					<div className='cmp-renewals'>
						<div className='cmp-renewals__all-days'>
							<div className='cmp-renewals__sub-title cmp-renewals-color-1'>
								{componentProp.paramOneLabel}
								<div className='cmp-renewals__sub-title--digits'> {payload.content.items?.[1]?.value}</div>
							</div>
							<div className='cmp-renewals__sub-title cmp-renewals-color-2'>
								{componentProp.paramTwoLabel}
								<div className='cmp-renewals__sub-title--digits'>{payload.content.items?.[2]?.value}</div>
							</div>
							<div className='cmp-renewals__sub-title cmp-renewals-color-3'>
								{componentProp.paramThreeLabel}
								<div className='cmp-renewals__sub-title--digits'>{payload.content.items?.[3]?.value}</div>
							</div>
						</div>
						<div className='cmp-renewals__today'>
							<div className='cmp-renewals__today--number'>
								{payload.content.items?.[0]?.value}
								<div className='cmp-renewals__sub-title'>{componentProp.todayLabel}</div>
							</div>
						</div>
					</div>
				</Fragment>
			) : (
				<Fragment> Loading... </Fragment>
			)}
		</section>
	);
}

export default MyRenewals;
