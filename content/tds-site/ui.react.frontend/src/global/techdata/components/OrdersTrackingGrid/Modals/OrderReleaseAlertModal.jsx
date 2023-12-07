import { Modal } from '@mui/material';
import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { ExitIcon, FailIcon, SuccessIcon } from '../../../../../fluentIcons/FluentIcons';

const OrderReleaseAlertModal = ({
  open,
  handleClose,
  orderLineDetails,
  releaseSuccess,
}) => {
  const {
    releaseSuccessText,
    releaseFailText,
  } = orderLineDetails;
  const successDiv = <div className='order-modal__alert-wrapper__green'>
  <div className='order-modal__alert-wrapper__icon-symbol'>
      <SuccessIcon/>
  </div>
  <div className='order-modal__alert-wrapper__text'>
      {getDictionaryValueOrKey(releaseSuccessText)}
  </div>
  <div onClick={handleClose} className='order-modal__alert-wrapper__icon-close'>
      <ExitIcon/>
  </div>
</div>;
const failDiv = <div className='order-modal__alert-wrapper__red'>
<div className='order-modal__alert-wrapper__icon-symbol'>
    <FailIcon/>
</div>
<div className='order-modal__alert-wrapper__text'>
    {getDictionaryValueOrKey(releaseFailText)}
</div>
<div onClick={handleClose} className='order-modal__alert-wrapper__icon-close'>
    <ExitIcon/>
</div>
</div>;
  return (
    <Modal
      open={open}
      hideBackdrop={true}
    >
        <div className='order-modal__alert-wrapper'>
        {releaseSuccess ? successDiv : failDiv}
        </div>
    </Modal>
  );
};
export default OrderReleaseAlertModal;
