import React, { useEffect, useState, useRef, Fragment } from 'react';
import { useItemListExportState } from '../OrderDetails/OrderDetailItemExport/hooks/useOrderDetailExport';

function Modal({ isModalVisible, modalProperties, modalContent, modalAction, actionErrorMessage, onModalClosed, componentProp, ...restProps }) {
	const {modalExportChild = {Child:false}} = restProps;
	const { title, buttonLabel, buttonIcon } = modalProperties ?? JSON.parse(componentProp);
	const [modalVisible, setModalVisible] = useState(isModalVisible ?? false);
	const {Child, ...restChildProps} = modalExportChild;
	const {lineItems} = useItemListExportState();
	if (buttonLabel && !modalAction) {
		modalAction = () => {};
	}

	const hideModal = () => {
		setModalVisible(false);
		if (onModalClosed) {
			onModalClosed();
		}
	};
	
	const invokeModalAction = () => {
		if (lineItems){
			return modalAction(lineItems);
		}
		if (modalAction) {
			modalAction();
		}
	};
	
	useEffect(() => {
		setModalVisible(isModalVisible ?? true);
	}, [isModalVisible]);
	
	console.log("🚀 ~ file: Modal.jsx ~ line 4 ~ Modal ~ modalAction", modalAction)
	return modalVisible ? (
		<div className={`cmp-modal ${modalVisible ? 'visible' : 'hidden'} `}>
			<div className='cmp-modal_container'>
				<div className='cmp-modal_backdrop' />
				<div className='cmp-modal_content'>
					<div className='cmp-modal_header'>
						<h3 className='cmp-modal_title'>{title}</h3>
						<button className='cmp-modal_close' onClick={hideModal} aria-label='Close'>
							<span className='cmp-modal_close' aria-hidden='true'>
								&times;
							</span>
						</button>
					</div>
					<div className='cmp-modal_body'>
						{React.isValidElement(modalContent) ? (
							modalContent
						) : (
							<p dangerouslySetInnerHTML={{ __html: modalContent || '' }}></p>
						)}
						{Child && !modalContent && 
							<Child {...restChildProps}/>
						}
					</div>
					{modalAction && (
						<div className='cmp-modal_footer'>
							<div className="cmp-modal_error-message">
								{actionErrorMessage}
							</div>
							<button className='cmp-modal_btn' onClick={invokeModalAction}>
								<span className='cmp-modal_btn_text'>
									<i className={`cmp-modal_btn-icon ${buttonIcon}`}></i>
									{buttonLabel}
								</span>
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	) : null;
}

export default Modal;
