import React, { useEffect, useState, useRef, Fragment } from 'react';

function Modal({ isModalVisible, modalProperties, modalContent, modalAction, onModalClosed, componentProp }) {
	const { title, buttonLabel, buttonIcon } = modalProperties ?? JSON.parse(componentProp);
	const [modalVisible, setModalVisible] = useState(isModalVisible ?? false);

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
		if (modalAction) {
			modalAction();
		}
		hideModal();
	};

	useEffect(() => {
		setModalVisible(isModalVisible ?? true);
	}, [isModalVisible]);

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
					</div>
					{modalAction ? (
						<div className='cmp-modal_footer'>
							<button className='cmp-modal_btn' onClick={invokeModalAction}>
								<span className='cmp-modal_btn_text'>
									<i className={`cmp-modal_btn-icon ${buttonIcon}`}></i>
									{buttonLabel}
								</span>
							</button>
						</div>
					) : null}
				</div>
			</div>
		</div>
	) : null;
}

export default Modal;
