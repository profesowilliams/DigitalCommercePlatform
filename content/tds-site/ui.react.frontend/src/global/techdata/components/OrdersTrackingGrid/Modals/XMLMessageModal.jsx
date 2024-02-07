import { Modal } from '@mui/material';
import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import {
  ExitIcon,
  FailIcon,
} from '../../../../../fluentIcons/FluentIcons';

const XMLMessageModal = ({
  open,
  handleClose,
  message,
}) => {
  return (
    <Modal open={open} hideBackdrop={true}>
      <div className="order-modal__alert-wrapper">
        <div className="order-modal__alert-wrapper__red">
      <div className="order-modal__alert-wrapper__icon-symbol">
        <FailIcon />
      </div>
      <div className="order-modal__alert-wrapper__text">
        {getDictionaryValueOrKey(message)}
      </div>
      <div
        onClick={handleClose}
        className="order-modal__alert-wrapper__icon-close"
      >
        <ExitIcon />
      </div>
    </div>
      </div>
    </Modal>
  );
};
export default XMLMessageModal;
