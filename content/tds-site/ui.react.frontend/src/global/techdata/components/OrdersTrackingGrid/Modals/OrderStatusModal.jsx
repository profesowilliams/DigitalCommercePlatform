import { Modal } from '@mui/material';
import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { ExitIcon } from '../../../../../fluentIcons/FluentIcons';

const OrderStatusModal = ({ open, handleClose, labels }) => {
  const { statusesTitle, statusesClose, statusesList } = labels || {};

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="order-modal__wrapper order-status-modal">
        <div onClick={handleClose} className="order-modal__wrapper__icon-close">
          <ExitIcon />
        </div>
        <div className="order-modal__header">
          {getDictionaryValueOrKey(statusesTitle)}
        </div>
        <ul>
          {statusesList?.map((status, idx) => (
            <li key={idx}>
              <span className="bold">
                {getDictionaryValueOrKey(status.title)}:{' '}
              </span>
              {getDictionaryValueOrKey(status.explanation)}
            </li>
          ))}
        </ul>
        <button className="order-modal__secondary-button" onClick={handleClose}>
          {getDictionaryValueOrKey(statusesClose)}
        </button>
      </div>
    </Modal>
  );
};
export default OrderStatusModal;
