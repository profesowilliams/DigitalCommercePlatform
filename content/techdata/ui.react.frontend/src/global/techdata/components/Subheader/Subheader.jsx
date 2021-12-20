import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLocalStorageUser } from '../../../../store/action/authAction';
import Modal from '../Modal/Modal';
import VendorConnection from './VendorConnection';

const DashboardSubheader = ({ componentProp }) => {
	const { accountnumberLabel = 'Account Number', vendorConnectionsModal } = JSON.parse(componentProp);
	const disableVendorConnectionLink = vendorConnectionsModal.disableVendorConnectionLink;
	const dispatch = useDispatch();
	const { userData, showError } = useSelector((state) => ({
		userData: state.auth.userData,
		showError: state.auth.showError,
	}));
	const [modal, setModal] = useState(null);
	const vendorModal = {
		uiServiceEndPoint:
			vendorConnectionsModal?.uiServiceEndPoint ?? 'https://eastus-sit-ui.dc.tdebusiness.cloud/ui-account/v1/',
		title: vendorConnectionsModal?.title ?? 'Vendor Connections',
		buttonLabel: vendorConnectionsModal?.buttonLabel ?? 'Connect All',
		buttonIcon: vendorConnectionsModal?.buttonIcon ?? null,
		content: vendorConnectionsModal?.content ?? 'Manage your vendor connections below',
		vendors: vendorConnectionsModal?.vendors ?? [
			{
				key: 'Cisco',
				value: null,
				logInUrl:
					'https://cloudsso.cisco.com/as/authorization.oauth2?response_type=code&client_id=mjxxm7tfx422u6gf4rausym9&state=&redirect_uri=https%3a%2f%2fdit.dc.tdebusiness.cloud%2fcontent%2ftechdata%2fus%2fvendorlogin.html',
			},
		],
	};

	function checkIfVendorSignedIn() {
		const url = new URL(window.location.href);
		if (String(url.pathname).includes('vendorlogin.html') && url.searchParams.has('code')) {
			invokeModal({
				content: (
					<VendorConnection
						vendors={vendorModal.vendors}
						apiUrl={vendorModal.uiServiceEndPoint}
						connectedLabel={vendorModal.connectedLabel}
						disconnectedLabel={vendorModal.disconnectedLabel}
						header={vendorModal.content}
						signInRequest={{ code: url.searchParams.get('code'), vendor: 'Cisco' }}
					></VendorConnection>
				),
				properties: vendorModal,
			});
		}
	}

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

	useEffect(() => {
		dispatch(getLocalStorageUser());
		checkIfVendorSignedIn();
	}, []);

	if (showError) return <p></p>;
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
				{(disableVendorConnectionLink && disableVendorConnectionLink == false) && (
                    <li
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
                        <a href='#'>
                            <i className='fas fa-link'></i>
                        </a>
                    </li>
				)}
			</ul>
			{modal}
		</Fragment>
	);
};

export default DashboardSubheader;
