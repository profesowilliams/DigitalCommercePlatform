import React from 'react';
import SoldToCard from './SoldToCard';
import OrdersTrackingDetailGrid from './OrdersTrackingDetailGrid/OrdersTrackingDetailGrid';
import useGet from '../../hooks/useGet';
import OrderAcknowledgementCard from './OrderAcknowledgementCard';
import ContactCard from './ContactCard';
import { getUrlParams } from '../../../../utils';
import OrderTrackingDetailHeader from './OrderTrackingDetailHeader';
import OrderTrackingContainer from './OrderTrackingContainer';

function OrdersTrackingDetail(props) {
    const { id = '' } = getUrlParams();
    const componentProps = JSON.parse(props.componentProp);
    const config = {
        ...componentProps,
        productLines: { agGridLicenseKey: componentProps?.agGridLicenseKey },
        serverSide: false,
        paginationStyle: 'none',
    };
    const [apiResponse] = useGet(`${config.uiServiceEndPoint}?id=${id}`);
    return (
        <div className="cmp-quote-preview cmp-order-preview">
            <section>
                <div className="cmp-orders-qp__config-grid">
                    <OrderTrackingDetailHeader
                        config={config}
                        apiResponse={apiResponse}
                    />
                    <div className="info-container">
                        <SoldToCard
                            soldTo={apiResponse?.content?.shipTo || {}}
                            config={config}
                        />
                        <OrderAcknowledgementCard
                            content={apiResponse?.content || {}}
                            config={config}
                        />
                        <ContactCard content={apiResponse?.content || {}} config={config} />
                    </div>
                </div>
                <div className="cmp-orders-qp__grid cmp-order-preview">
                    <OrderTrackingContainer config={config} />
                    {apiResponse && (
                        <OrdersTrackingDetailGrid
                            data={apiResponse.content}
                            gridProps={config}
                        />
                    )}
                </div>
            </section>
        </div>
    );
}
export default OrdersTrackingDetail;
