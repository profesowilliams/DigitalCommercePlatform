import React, { useEffect, useState, createRef } from "react";
import Chart from "chart.js";
import "chartjs-gauge";
import { get } from "../../../../utils/api";

const MyOrdersWidget = ({ componentProp }) => {
    const chartRef = createRef();
    const [myOrders, setMyOrders] = useState(false);
    const { endpoint } = JSON.parse(componentProp);

    const createChart = (node, data) => {
        const randomValue = (data) =>
            Math.max.apply(null, data) * Math.random();
        var value = randomValue(data);
        return new Chart(node, {
            type: "gauge",
            data: {
                datasets: [
                    {
                        data,
                        value,
                        backgroundColor: ["#33C0E1", "#E6E6E6"],
                        borderWidth: 0,
                    },
                ],
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                },
                layout: {
                    padding: {
                        bottom: 50,
                    },
                },
                needle: {
                    radiusPercentage: 2,
                    widthPercentage: 3.2,
                    lengthPercentage: 80,
                    color: "rgba(0, 0, 0, 1)",
                },
                valueLabel: {
                    display: false,
                },
            },
        });
    };
    useEffect(() => {
        if (myOrders) {
            const { processedOrdersAmount, totalOrderAmount } = myOrders;
            createChart(chartRef.current.getContext("2d"), [
                processedOrdersAmount,
                totalOrderAmount,
            ]);
        }
    }, [myOrders]);

    useEffect(async () => {
        const {
            data: {
                content: { items },
            },
        } = await get(endpoint);
        setMyOrders(items);
    }, []);

    const { processedFormattedAmount, currencySymbol } = myOrders;

    return myOrders ? (
        <>
            <div>
                <div className='cmp-gauge-chart'>
                    <div className='cmp-gauge-chart__title'>My Orders</div>
                </div>
                <div
                    id='canvas-holder'
                    className='cmp-gauge-chart'
                    style={{ width: "25%" }}
                >
                    <canvas id='chart' ref={chartRef} />
                </div>
                <div className='cmp-gauge-chart'>
                    <div className='cmp-gauge-chart__orders-processed'>
                        <div className='cmp-gauge-chart__orders-processed--number'>
                            {`${currencySymbol}${processedFormattedAmount}`}
                        </div>
                        <div className='cmp-gauge-chart__orders-processed--title'>
                            Orders Processed
                        </div>
                    </div>
                </div>
            </div>
        </>
    ) : null;
};

export default MyOrdersWidget;
