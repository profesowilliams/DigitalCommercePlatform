import React, { Fragment, useEffect, useState } from 'react';
import Modal from '../Modal/Modal';
import VendorConnection from './VendorConnection';
import {dashboardMenu} from "./dashboardMenu";

const NewSubheader = ({ componentProp }) => {
	const { accountnumberLabel = 'Account Number', vendorConnectionsModal, menuItems, dashboardMenuItems } = JSON.parse(componentProp);
	const [userData, setUserData] = useState(null);

	useEffect(() => {
		let user = JSON.parse(localStorage.getItem("userData"));
		if (user) {
			setUserData(user);
		}
		hasDCPAccess();
	}, []);

	function showHideDashboard() {
		setShowDashboard(!showDashboard);
		return undefined;
	}

	const hasDCPAccess = (user) => {
		const HAS_DCP_ACCESS = "hasDCPAccess";
		const {roleList} = user ? user : {undefined};

		if (roleList && roleList.length) {
			for (let eachItem of roleList)
			{
				if (eachItem?.entitlement.trim() === HAS_DCP_ACCESS)
				{
					return true;
				}
			}

		}
		return false;
	}

	const getMenuItems = (menuItems, dashboardMenuItems) => {

		if (!menuItems.length) return null;

		if (menuItems && menuItems.length > 0)
		{
			return  menuItems.map((item, index) =>
				<li key={`tabs-${index}`} role="tab" id={`tabs-${index}`} className={item.active ? "cmp-tabs__tab cmp-tabs__tab--active" : "cmp-tabs__tab"}
					aria-controls="tabs-d734aa9c61-item-236e9c3f08-tabpanel" tabIndex="0" data-cmp-hook-tabs="tab"
					aria-selected="true" onClick={index == 0 ? () => showHideDashboard() : null}>
					<a href={item.link ? item.link : "#"}>
						{item.title}
					</a>
					{showDashboard && index == 0 ? dashboardMenu(dashboardMenuItems, hasDCPAccess(userData)) : null}
				</li>
			);
		}
	}

	const [modal, setModal] = useState(null);
	const [showDashboard, setShowDashboard] = useState(false);

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

	function invokeDashboardModal(modal) {
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
		<>
		<ol role="tablist" className="cmp-sub-header__wrapper__child" aria-multiselectable="false">
			{getMenuItems(menuItems, dashboardMenuItems)}
		</ol>
			{userData ?
				<>
				<ul className="cmp-sub-header__wrapper__child">
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
				</ul>
					{modal}
				</>: null }
		</>)
};

export default NewSubheader;
