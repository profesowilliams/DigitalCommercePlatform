import React, { useEffect, useState, Fragment } from 'react';
import useGet from '../../hooks/useGet';

function TodaysActionItems(props) {
	const componentProp = JSON.parse(props.componentProp);
    console.log(componentProp);
    const [response, isLoading] = useGet(`${componentProp.uiServiceEndPoint}`);
    const TITLE_LABEL = componentProp.mainTitle ? componentProp.mainTitle : "TODAY'S ACTION ITEMS";
    const ORDERS_LABEL = componentProp.ordersBlocked ? componentProp.ordersBlocked : "Orders Blocked";
    const DEALS_LABEL = componentProp.dealsExpiring ? componentProp.dealsExpiring : "Deals Expiring";
    const ORDERS_LABEL_ICON = componentProp.iconOrdersBlocked ? componentProp.iconOrdersBlocked : "fas fa-ban";
    const DEALS_LABEL_ICON = componentProp.iconDealsExpiring ? componentProp.iconDealsExpiring : "fas fa-stopwatch";

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
                                <div className="cmp-todays-action-items__tab__title">
                                    {ORDERS_LABEL}
                                </div>
                                <div className="cmp-todays-action-items__tab__items">
                                {ordersBlocked}
                                </div>
                                <div className="cmp-todays-action-items__tab__action-icon">
                                    <i className={ORDERS_LABEL_ICON}></i>
                                </div>
                            </div>
                            <div className="cmp-todays-action-items__tab">
                                <div className="cmp-todays-action-items__tab__title">
                                    {DEALS_LABEL}
                                </div>
                                <div className="cmp-todays-action-items__tab__items">
                                    {expiringDeals}
                                </div>
                                <div className="cmp-todays-action-items__tab__action-icon">
                                    <i className={DEALS_LABEL_ICON}></i>
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

export default TodaysActionItems;
