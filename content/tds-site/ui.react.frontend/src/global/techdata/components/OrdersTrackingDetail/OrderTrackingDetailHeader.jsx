import React, { useState, useEffect } from 'react';
import { useOrderTrackingStore } from '../OrdersTrackingCommon/Store/OrderTrackingStore';
import SoldToCard from './Header/SoldToCard';
import AcknowledgementCard from './Header/AcknowledgementCard';
import ContactCard from './Header/ContactCard';
import HeaderContainer from './Header/HeaderContainer';
import OrderReleaseModal from '../OrdersTrackingGrid/Modals/OrderReleaseModal';
import { usPost } from '../../../../utils/api';
import OrderReleaseAlertModal from '../OrdersTrackingGrid/Modals/OrderReleaseAlertModal';
import XMLMessageModal from '../OrdersTrackingGrid/Modals/XMLMessageModal';
import MigrationInfoBox from '../MigrationInfoBox/MigrationInfoBox';
import { fetchFiltersRefinements } from './utils/fetchUtils';

const OrderTrackingDetailHeader = ({
  config,
  orderData,
  openFilePdf,
  componentProps,
  setOrderModifyHeaderInfo,
  onProductChange,
  isLoading
}) => {
  const labels = config?.actionLabels;

  const effects = useOrderTrackingStore((state) => state.effects);
  const { setFeatureFlags } = effects;

  const [releaseOrderShow, setReleaseOrderShow] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [openXMLAlert, setOpenXMLAlert] = useState(false);
  const [releaseSuccess, setReleaseSuccess] = useState(false);
  const [infoBoxEnable, setInfoBoxEnable] = useState(false);
  const [poNumber, setPoNumber] = useState('');
  const [id, setId] = useState('');

  const handleReleaseOrder = async () => {
    setReleaseOrderShow(false);
    const params = {
      OrderId: id,
    };
    const url = `${componentProps.uiCommerceServiceDomain}/v2/ChangeDeliveryFlag`;
    await usPost(url, params)
      .then((response) => {
        const {
          data: {
            content: { changeDelFlag, isError },
          },
        } = response;
        if (changeDelFlag?.isError === false && isError === false) {
          setReleaseSuccess(true);
        } else {
          setReleaseSuccess(false);
        }
      })
      .finally(() => {
        setOrderModifyHeaderInfo(true);
        setOpenAlert(true);
        setTimeout(() => {
          setOpenAlert(false);
        }, 5000);
      });
  };

  useEffect(async () => {
    console.log('OrderTrackingDetailHeader::useEffect');
    const refinements = await fetchFiltersRefinements(config);
    setFeatureFlags(refinements?.featureFlags);
  }, []);

  useEffect(async () => {
    console.log('OrderTrackingDetailHeader::useEffect::orderData');

    if (!orderData) return;

    setInfoBoxEnable(orderData.sapOrderMigration?.referenceType?.length > 0);
    setPoNumber(orderData.customerPO);
    setId(orderData.orderNumber);

  }, [orderData]);

  return (
    <div className="cmp-orders-qp__config-grid">
      <HeaderContainer
        config={config}
        content={orderData}
        openFilePdf={openFilePdf}
        componentProps={componentProps}
        onProductChange={onProductChange}
        isLoading={isLoading}
      />
      {infoBoxEnable && (
        <MigrationInfoBox
          config={config?.labels}
          id={orderData?.sapOrderMigration?.id}
          referenceType={orderData?.sapOrderMigration?.referenceType}
          isLoading={isLoading}
        />
      )}
      <div className="info-container">
        <SoldToCard
          orderData={orderData}
          isLoading={isLoading}
        />
        <AcknowledgementCard
          orderData={orderData}
          isLoading={isLoading}
        />
        <ContactCard
          orderData={orderData}
          isLoading={isLoading}
        />
      </div>
      <OrderReleaseModal
        open={releaseOrderShow}
        handleClose={() => setReleaseOrderShow(false)}
        handleReleaseOrder={handleReleaseOrder}
        orderLineDetails={config.actionLabels}
        orderNo={id}
        PONo={poNumber}
      />
      <OrderReleaseAlertModal
        open={openAlert}
        handleClose={() => {
          setOpenAlert(false);
        }}
        orderLineDetails={config.actionLabels}
        releaseSuccess={releaseSuccess}
      />
      <XMLMessageModal
        open={openXMLAlert}
        handleClose={() => setOpenXMLAlert(false)}
        message={labels?.xmlMessageAlertLabel}
      />
    </div>
  );
};

export default OrderTrackingDetailHeader;