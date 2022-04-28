import React, { useEffect, useState, createRef, Fragment } from 'react';
import { get } from '../../../../utils/api';
import useGet from "../../hooks/useGet";
import { useStore } from "../../../../utils/useStore"
import { isExtraReloadDisabled } from "../../../../utils/featureFlagUtils"
import ErrorMessage from "../ErrorMessage/ErrorMessage";

function MyRenewals(props) {
	const componentProp = JSON.parse(props.componentProp);
	const domRef = createRef();
	const isLoggedIn = useStore(state => state.isLoggedIn)
	const url = componentProp.uiServiceEndPoint
	const [apiResponse, isLoading, error] = useGet(url);

	useEffect(() => {
		if((isExtraReloadDisabled() && isLoggedIn) || !isExtraReloadDisabled()){
			if (apiResponse && !apiResponse.error?.isError) {
				const ctx = domRef.current.getContext('2d');
				const [today, in30d, in60d, in90d] = apiResponse.content.items;
				const total = apiResponse.content.items.map((k) => k.value).reduce((a, b) => a + b);
				const ratio30d = (today.value + in30d.value) / total;
				const ratio60d = in60d.value / total;
				const ratio90d = in90d.value / total;
				const chartData = [ratio30d, ratio60d, ratio90d];
				createChart(ctx, chartData);
			}
		}
	}, [apiResponse, isExtraReloadDisabled(), isLoggedIn]);

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
			{apiResponse ? (
				<Fragment>
					{error ? (
					<ErrorMessage
						error={error}
						messageObject={{"message401" : "You need to be logged in to view this"}}
					/> 
					) : (
						<div className='cmp-renewals'>
							<div className='cmp-renewals-info'>
								<div className='cmp-renewals__title'>{componentProp.label}</div>
								<div className='cmp-renewals__all-days'>
									<div className='cmp-renewals__sub-title cmp-renewals-color-1'>
										{componentProp.paramOneLabel}
										<div className='cmp-renewals__sub-title--digits'> {apiResponse.content.items?.[1]?.value}</div>
									</div>
									<div className='cmp-renewals__sub-title cmp-renewals-color-2'>
										{componentProp.paramTwoLabel}
										<div className='cmp-renewals__sub-title--digits'>{apiResponse.content.items?.[2]?.value}</div>
									</div>
									<div className='cmp-renewals__sub-title cmp-renewals-color-3'>
										{componentProp.paramThreeLabel}
										<div className='cmp-renewals__sub-title--digits'>{apiResponse.content.items?.[3]?.value}</div>
									</div>
								</div>
								<div className='cmp-renewals__today'>
									<div className='cmp-renewals__today--number'>
										{apiResponse.content.items?.[0]?.value}
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
			) : isLoading && (
				<Fragment> <div className="cmp-spinner"><div class="cmp-loading">Loading…</div></div> </Fragment>
			)}
		</section>
	);
}

export default MyRenewals;
