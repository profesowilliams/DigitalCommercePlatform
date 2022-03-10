import React, { useEffect, useState, createRef } from "react";
import Chart from "chart.js";
import "chartjs-gauge";
import { get } from "../../../../utils/api";
import { ANALYTICS_TYPES, pushData } from "../../../../utils/dataLayerUtils";

// import "./style.css";



const MyOrdersWidget = ({ componentProp }) => {
    const chartRef = createRef();
    const [myOrders, setMyOrders] = useState(false);
    const [toggle, setToggle] = useState(false);
    const { label, endpoint, days30Label, days90Label } = JSON.parse(componentProp);

    async function  toDateToggle() {
        let updatedEndPoint = endpoint;

        pushData({
            event: ANALYTICS_TYPES.events.orderDaysSelected,
            order: {
                selectedDays: toggle ? 30 : 90
            }
        });

        if (!toggle)
            updatedEndPoint = endpoint.replace("true", "false")

            const {
                data: {
                    content: { items },
                },
            } = await get(updatedEndPoint);
            setMyOrders(items);
            setToggle(!toggle);

    }

    const createChart = (node, data, value) => {

        return new Chart(node, {
            type: "gauge",
            data: {
                datasets: [
                    {
                        data,
                        value,
                        backgroundColor: ["#33C0E1", "#E6E6E6"],
                        borderWidth: 1,
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
                        bottom: 35,
                    },
                },
                needle: {
                    radiusPercentage: 1.5,
                    widthPercentage: 3,
                    lengthPercentage: 80,
                    color: "rgba(0, 12, 33, 1)",
                },
                valueLabel: {
                    display: false,
                },
            },
        });
    };
    useEffect(() => {
        if (myOrders) {

            const processedOrdersAmount = myOrders.processed.amount;
            const totalOrdersAmount = myOrders.total.amount;
            createChart(chartRef.current.getContext("2d"), [
                processedOrdersAmount,
                totalOrdersAmount,
            ], myOrders.shipped.amount);
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


    return (
        myOrders && (
            <>
                <div className='cmp-gauge-chart-wrap'>
                    <div className='cmp-gauge-chart'>
                        <div className='cmp-gauge-chart__title'>{label}</div>
                    </div>
                    <div id='canvas-holder'>
                        <canvas id='chart' ref={chartRef} />
                    </div>
                    <div className='cmp-gauge-chart'>
                        <div className='cmp-gauge-chart__orders-processed'>
                            <div className='cmp-gauge-chart__orders-processed--number'>
                                {`${myOrders.currencySymbol}${myOrders.processed.formattedAmount}`}
                            </div>
                            <div className='cmp-gauge-chart__orders-processed--title'>
                                Orders Processed
                            </div>
                        </div>
                    </div>
                    <div className='cmp-gauge-chart-period'>
                        <div>
                            <div>{days30Label}</div>
                            <div className='cmp-gauge-chart-period--toggle'>
                                <label className='switch'>
                                    <input type='checkbox' checked={toggle} onChange={toDateToggle}/>
                                    <span className='dot round' />
                                </label>
                            </div>
                            <div>{days90Label}</div>
                        </div>
                    </div>
                </div>
            </>
        )
    );
};

export default MyOrdersWidget;
