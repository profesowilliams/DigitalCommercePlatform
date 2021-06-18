import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLocalStorageUser } from '../../../../store/action/authAction';
import Modal from '../Modal/Modal';
import VendorConnection from './VendorConnection';

const DashboardSubheader = ({ componentProp }) => {
	const { accountnumberLabel = 'Account Number', vendorConnectionsModal } = JSON.parse(componentProp);
	const dispatch = useDispatch();
	const { userData, showError } = useSelector((state) => ({
		userData: state.auth.userData,
		showError: state.auth.showError,
	}));
	const [modal, setModal] = useState(null);

	const vendorModal = {
		uiServiceEndPoint:
			vendorConnectionsModal?.uiServiceEndPoint ?? 'http://localhost:3000/ui-commerce/v1/orders/?details=true',
		title: vendorConnectionsModal?.title ?? 'Vendor Connections',
		buttonLabel: vendorConnectionsModal?.buttonLabel ?? 'Connect All',
		buttonIcon: vendorConnectionsModal?.buttonIcon ?? null,
		content: vendorConnectionsModal?.content ?? 'Manage your vendor connections below',
		vendors: vendorConnectionsModal?.vendors ?? [{ key: 'Cisco', value: 'https://url.to.cisco.logo' }],
	};

	useEffect(() => {
		dispatch(getLocalStorageUser());
	}, []);

	if (showError) return <p>You should be logged to see this feat</p>;

	function getAccountNumber() {
		let accountNumber = '';
		if (userData.customersV2 && userData.customersV2[0]) {
			accountNumber = userData.customersV2[0].number;
		} else if (userData.customers && userData.customers[0]) {
			const item = userData.customers[0];
			accountNumber = typeof item === 'string' ? item : item.number;
		}
		return accountNumber;
	}

	function invokeModal(modal) {
		setModal(
			<Modal
				modalAction={modal.action}
				modalContent={modal.content}
				modalProperties={modal.properties}
				onModalClosed={() => setModal(null)}
			></Modal>
		);
	}

	return (
		<Fragment>
			<ul>
				{userData.companyName && (
					<li>
						<a href='#'>{userData.companyName}</a>
					</li>
				)}
				<li>
					<a href='#'>
						{accountnumberLabel}: {getAccountNumber()}
					</a>
				</li>
				<li>
					<a
						href='#'
						onClick={() =>
							invokeModal({
								content: (
									<VendorConnection
										vendors={vendorModal.vendors}
										apiUrl={vendorModal.uiServiceEndPoint}
										connectedLabel={vendorModal.connectedLabel}
										disconnectedLabel={vendorModal.disconnectedLabel}
										header={vendorModal.content}
									></VendorConnection>
								),
								properties: vendorModal,
							})
						}
					>
						<i className='fas fa-link'></i>
					</a>
				</li>
			</ul>
			{modal}
		</Fragment>
	);
};

export default DashboardSubheader;
