import { Modal } from '@mui/material';
import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

const OrderReleaseModal = ({
  open,
  handleClose,
  handleReleaseOrder,
  orderLineDetails,
  orderNo,
  PONo,
}) => {
  const {
    titleReleaseModal,
    orderNoString,
    PONoString,
    upperText,
    lowerText,
    cancelString,
    releaseOrderString,
  } = orderLineDetails;
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="order-modal__wrapper">
        <div className="order-modal__header">
          {getDictionaryValueOrKey(titleReleaseModal)}
        </div>
        <div className="order-modal__body">
          <div className="order-modal__line">{`${getDictionaryValueOrKey(
            orderNoString
          )}: ${orderNo}`}</div>
          <div className="order-modal__line">{`${getDictionaryValueOrKey(
            PONoString
          )}: ${PONo ?? ''}`}</div>
          <br />
          <div className="order-modal__line">
            {getDictionaryValueOrKey(upperText)}
          </div>
          <br />
          <div className="order-modal__line">
            {getDictionaryValueOrKey(lowerText)}
          </div>
        </div>
        <div className="order-modal__footer">
          <button
            className="order-modal__secondary-button"
            onClick={handleClose}
          >
            {getDictionaryValueOrKey(cancelString)}
          </button>
          <div className="order-modal__gap"></div>
          <button
            className="order-modal__primary-button"
            onClick={handleReleaseOrder}
          >
            {getDictionaryValueOrKey(releaseOrderString)}
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default OrderReleaseModal;
