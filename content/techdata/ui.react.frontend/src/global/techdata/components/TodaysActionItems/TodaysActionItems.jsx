import React, { useEffect, useState, Fragment } from 'react';
import useGet from '../../hooks/useGet';

function TopItemsBarChart(props) {
	const componentProp = JSON.parse(props.componentProp);
    const [response, isLoading] = useGet(`${componentProp.uiServiceEndPoint}`);
    const TITLE_LABEL = "TODAY'S ACTION ITEMS"
    const ORDERS_LABEL = 'Orders Blocked';
    const DEALS_LABEL = 'Deals Expiring';
    const [newOpportunities, setNewOpportunities] = useState('');
    const [ordersBlocked, setOrdersBlocked] = useState('');
    const [expiringDeals, setExpiringDeals] = useState('');
    useEffect(() => {
        if (response?.content) {
            const data = response.content.summary;
            setNewOpportunities(data.newOpportunities);
            setOrdersBlocked(data.ordersBlocked);
            setExpiringDeals(data.expiringDeals);
        }
      }, [response]);
    
	return (
		<section>
			<div>
				{!isLoading ? (
					<Fragment>
						<div className="cmp-todays-action-items">
                            <div className="cmp-todays-action-items__title">
                                {TITLE_LABEL}
                            </div>
                            <div className="cmp-todays-action-items__tab">
                                <div className="cmp-todays-action-items__tab--title">
                                    {ORDERS_LABEL}
                                </div>
                                <div className="cmp-todays-action-items__tab--items">
                                {ordersBlocked}
                                </div>
                                <div className="cmp-todays-action-items__tab--action-icon">
                                    <i className="fas fa-ban"></i>
                                </div>
                            </div>
                            <div className="cmp-todays-action-items__tab">
                                <div className="cmp-todays-action-items__tab--title">
                                    {DEALS_LABEL}
                                </div>
                                <div className="cmp-todays-action-items__tab--items">
                                    {expiringDeals}
                                </div>
                                <div className="cmp-todays-action-items__tab--action-icon">
                                    <i className="fas fa-stopwatch"></i>
                                </div>
                            </div>
                        </div>
					</Fragment>
				) : (
					<Fragment> Loading... </Fragment>
				)}
			</div>
		</section>
	);
}

export default TopItemsBarChart;
