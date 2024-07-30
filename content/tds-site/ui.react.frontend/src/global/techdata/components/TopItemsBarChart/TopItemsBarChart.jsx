import React, { useEffect, createRef, useState, Fragment } from 'react';
import Chart from 'chart.js';
import { get } from '../../../../utils/api';

function TopItemsBarChart(props) {
	const domRef = createRef();
	const componentProp = JSON.parse(props.componentProp);

	const chartOptions = {
		sort: componentProp.sort,
	};
	const [payload, setPayload] = useState(null);
	const formatAmount = (amount) => amount.split('.')[0];

	async function getChartData() {
		const response = await get(componentProp.uiServiceEndPoint);
		if (chartOptions?.sort) {
			chartOptions.sort === 'asc'
				? sortDataAsc('amount', response.data.content.summary.items)
				: chartOptions.sort === 'desc'
				? sortDataDesc('amount', response.data.content.summary.items)
				: null;
		}
		if (!payload) setPayload(response.data);
	}

	function sortDataAsc(stringKey, array) {
		return array.sort((a, b) => a[stringKey] - b[stringKey]);
	}

	function sortDataDesc(stringKey, array) {
		return array.sort((a, b) => b[stringKey] - a[stringKey]);
	}

	function createChart(node, chartData) {
		const colorArray = chartData.map((d, i) => {
			const elem = document.querySelector(`.cmp-barChart__sub-title-color-${i + 1}`);
			return getComputedStyle(elem).borderRightColor;
		});
		return new Chart(node, {
			type: 'bar',
			options: {
				responsive: true,
				maintainAspectRatio: true,
				legend: {
					display: false,
				},
				tooltips: {
					callbacks: {
						label: function (tooltipItem) {
							return tooltipItem.yLabel;
						},
					},
				},
				scales: {
					yAxes: [
						{
							ticks: {
								min: 0,
								display: false,
							},
							gridLines: {
								display: false,
							},
						},
					],
					xAxes: [
						{
							ticks: {
								display: false,
							},
							gridLines: {
								display: false,
							},
						},
					],
				},
			},
			data: {
				labels: chartData.map((d) => d.endUserName),
				datasets: [
					{
						label: chartData.map((d) => d.endUserName),
						data: chartData.map((d) => d.amount),
						backgroundColor: colorArray,
					},
				],
			},
		});
	}

	useEffect(() => {
		getChartData();
	}, []);

	useEffect(() => {
		if (payload && !payload.error?.isError) {
			const ctx = domRef.current.getContext('2d');
			createChart(ctx, payload.content.summary.items, chartOptions);
		}
	}, [payload]);

	/**
	 * Visual component that valid the lenght of the endUserName
	 * and other operations if is necesary.
	 * @param {Object} props
	 * @param {string} props.endUserName
	 * @param {string} props.formattedAmount
	 * @param {string} props.amount
	 * @param {number} props.index
	 * @param {any} props.currencySymbol
	 * @returns 
	 */
	 const InfoComponent = ({endUserName, formattedAmount, amount, index, currencySymbol}) => {
		const MAX_END_USER_NAME_VALID = 20;
		const example = endUserName;
		const validEndUserName = example.substring(0, MAX_END_USER_NAME_VALID);
		return (
			<div key={index}>
				<span className={`cmp-barChart__sub-title-color-${index + 1}`}></span>
				<span className='cmp-barChart__sub-title'>{validEndUserName ?? null}</span>
				<span className='cmp-barChart__sub-title-digits'>
				{currencySymbol ?? '$'}{formatAmount(formattedAmount ?? amount.replace(/\B(?=(\d{3})+(?!\d))/g, ','))}
				</span>
			</div>
		);
	}


	return (
		<section>
			<div className='cmp-barChart'>
				{payload ? (
					<Fragment>
						<div className='cmp-barChart__container'>
							<p className='cmp-barChart__title'>{componentProp.label}</p>
							<div className='cmp-barChart__body'>
								<div className='cmp-barChart__legend'>
									{payload.content.summary.items.map((item, i) => {
										return (
											<InfoComponent 
												amount={item.amount}
												currencySymbol={item.currencySymbol}
												endUserName={item.endUserName}
												index={i}
												formattedAmount={item.formattedAmount}
											/>	
										);
									})}
								</div>
								<div className='cmp-barChart__chart'>
									<canvas ref={domRef} />
									{payload.error?.isError ? <div> Error while loading data.</div> : null}
								</div>
							</div>
						</div>
					</Fragment>
				) : (
					<Fragment> <div class="cmp-spinner"><div class="cmp-loading">Loading…</div></div> </Fragment>
				)}
			</div>
		</section>
	);
}

export default TopItemsBarChart;
