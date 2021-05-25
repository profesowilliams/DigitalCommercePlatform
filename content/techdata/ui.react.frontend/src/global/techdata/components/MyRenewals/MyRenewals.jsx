import React, { useEffect, useState, createRef, Fragment } from 'react';
import { get } from '../../../../utils/api';

function MyRenewals(props) {
	const componentProp = JSON.parse(props.componentProp);
	const [payload, setPayload] = useState(null);
	const domRef = createRef();

	async function getRenewalsData() {
		const response = await get(componentProp.uiServiceEndPoint);
		if (!payload) setPayload(response.data);
	}

	useEffect(() => {
		getRenewalsData();
	}, []);

	useEffect(() => {
		if (payload && !payload.error?.isError) {
			const ctx = domRef.current.getContext('2d');
			const [today, in30d, in60d, in90d] = payload.content.items;
			const total = payload.content.items.map((k) => k.value).reduce((a, b) => a + b);
			const ratio30d = (today.value + in30d.value) / total;
			const ratio60d = in60d.value / total;
			const ratio90d = in90d.value / total;
			const chartData = [ratio30d, ratio60d, ratio90d];
			createChart(ctx, chartData);
		}
	}, [payload]);

	function createChart(node, chartData) {
		const colorArray = chartData.map((d, i) => {
			const elem = document.querySelector(`.cmp-renewals-color-${i + 1}`);
			return getComputedStyle(elem).borderLeftColor;
		});
		return new Chart(node, {
			type: 'doughnut',
			options: {
				responsive: true,
				cutoutPercentage: 70,
				aspectRatio: 1,
				maintainAspectRatio: true,
				legend: {
					display: false,
				},
				tooltips: {
					callbacks: {
						label: (tooltipItems, data) => {
							return (
								parseFloat(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index] * 100).toFixed(2) + '%'
							);
						},
					},
				},
			},
			data: {
				datasets: [
					{
						data: chartData,
						backgroundColor: colorArray,
					},
				],
			},
		});
	}

	return (
		<section id='cmp-renewals'>
			{payload ? (
				<Fragment>
					{payload.error?.isError ? (
						<div className='cmp-renewals'>
							<div className='cmp-renewals-info'>
								<div className='cmp-renewals__title'>{componentProp.label}</div>
								<div className='cmp-renewals__error'> Error while loading data.</div>
							</div>
						</div>
					) : (
						<div className='cmp-renewals'>
							<div className='cmp-renewals-info'>
								<div className='cmp-renewals__title'>{componentProp.label}</div>
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
							<div className='cmp-renewals__chart'>
								<div className='chart-container'>
									<canvas ref={domRef} />
								</div>
							</div>
						</div>
					)}
				</Fragment>
			) : (
				<Fragment> Loading... </Fragment>
			)}
		</section>
	);
}

export default MyRenewals;
