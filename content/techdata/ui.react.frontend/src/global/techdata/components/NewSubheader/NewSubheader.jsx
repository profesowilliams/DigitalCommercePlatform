import React, { Fragment, useEffect, useState, useRef } from 'react';
import Modal from '../Modal/Modal';
import VendorConnection from './VendorConnection';
import {dashboardMenu} from "./dashboardMenu";
import {getAbsolutePosition} from "../../helpers/absolutePosition";
import {getQueryStringValue} from "../../../../utils/utils";
import { ANALYTICS_TYPES, pushEvent } from "../../../../utils/dataLayerUtils";
import { useStore } from "../../../../utils/useStore";
import { isExtraReloadDisabled } from "../../../../utils/featureFlagUtils";
import { hasDCPAccess } from "../../../../utils/user-utils";

const NewSubheader = ({ componentProp }) => {
	const dashboardMenuIndex = 0;
	const { accountnumberLabel = 'Account Number', vendorConnectionsModal, menuItems, dashboardMenuItems, toolsIndex } = JSON.parse(componentProp);
	let tempToolsIndex = parseInt(toolsIndex);
	// Tools Menu Index cannot be the first Menu Item. First Menu Item is Dashboard
	const toolsIndexInt = tempToolsIndex > 1 && tempToolsIndex <= menuItems.length ? tempToolsIndex - 1 : menuItems.length - 1;
	const [userData, setUserData] = useState(null);
	const menuItemRefs = useRef([]);
	const loginPageCommonName = vendorConnectionsModal.loginPageCommonName;
	const disableVendorConnectionLink = vendorConnectionsModal.disableVendorConnectionLink;
  
	const isLoggedIn = useStore(state => state.isLoggedIn);

	useEffect(() => {
        var userDataJsonStr = JSON.parse(localStorage.getItem("userData"));
        if(window.SHOP && window.SHOP.authentication && window.SHOP.authentication.isAuthenticated()) {
            if(!localStorage.getItem("userData")) {
                var userData = prepareUserData();
                userDataJsonStr = JSON.stringify(userData);
                localStorage.setItem("userData", userDataJsonStr);
                window.location.reload();
            }
        } else if (window.SHOP && userDataJsonStr) {
			localStorage.removeItem("userData");
			userDataJsonStr = "";
		}
        if (userDataJsonStr) {
            setUserData(userDataJsonStr);
        }
		checkIfVendorSignedIn();
  }, [isExtraReloadDisabled(), isLoggedIn]);

    const prepareUserData = () => {
        // fetch user entitlement data from datalayer and populate localStorage
        var custNo = SHOP.dataLayer.User.custNo;
        var entitlements = SHOP.dataLayer.User.entitlements;
        var roleList = [];
        if(SHOP.dataLayer.User.entitlements) {
            var dcpAccess = false;
            for (var i = 0; i < entitlements.length; i++) {
                var dataVal = entitlements[i];
                if(dataVal.indexOf('HasDCPAccess')) {
                    dcpAccess = true;
                }
                roleList.push({
                    entitlement: dataVal,
                    accountId: custNo
                });
            }
        }
        var userData = {'customersV2': prepareCustomersV2(dcpAccess), 'roleList': roleList};
        return userData;
    }

	const hideOtherMenus = (sourceIndex) => {

		if (sourceIndex==dashboardMenuIndex)
		{
			showHideToolsMenu(menuItemRefs.current[toolsIndexInt], true);
		}else if (sourceIndex==toolsIndexInt) {
			setShowDashboard(false);
		}
	}

	const prepareCustomersV2 = (dcpAccess) => {
	    var customersV2 = [];
	    if(SHOP.dataLayer.User.customers) {
            customersV2.push({
                customerName: SHOP.dataLayer.User.customers[0].CustomerName,
                customerNumber: SHOP.dataLayer.User.customers[0].CustomerNumber,
                dcpAccess: dcpAccess,
                name: SHOP.dataLayer.User.customers[0].CustomerName,
                number: SHOP.dataLayer.User.customers[0].CustomerNumber,
                salesOrg: SHOP.dataLayer.User.customers[0].SalesOrg,
                system: ""
            });
        }
	    return customersV2;
	}

	function showHideDashboard() {
		hideOtherMenus(dashboardMenuIndex);
		setShowDashboard(!showDashboard);
		return undefined;
	}

	const returnClickHandler = (index) => {
		if (index==0)
		{
			return showHideDashboard();
		}else if (index==toolsIndexInt) {
			return showHideToolsMenu(menuItemRefs.current[index], false);
		}
	}

	const showHideToolsMenu = (eventObject, overRide) => {
		let toolsMenu = document.getElementsByClassName("cmp-new-subheader");
		if (toolsMenu.length > 0)
		{
			let menuCategoryElementArray = toolsMenu[0].getElementsByClassName("menucategorieslist");
			if (menuCategoryElementArray && menuCategoryElementArray.length > 0)
			{
				let menuCategoryElement = menuCategoryElementArray[0];
				let menuToolsElementArray = menuCategoryElement.getElementsByClassName("cmp-tools");
				if (overRide)
				{
					menuCategoryElement.style.display = "none";
				}else if (menuCategoryElement && menuToolsElementArray && !overRide && menuToolsElementArray.length> 0 && (menuCategoryElement.style.display == "none" || menuCategoryElement.style.display == "")) {
					hideOtherMenus(toolsIndexInt);
					let cmpToolsElement = menuToolsElementArray[0];
					menuCategoryElement.style.display = "block";
					let elementRect = getAbsolutePosition(eventObject);
					let cmpNewSubheaderElementRect = getAbsolutePosition(toolsMenu[0]);
					cmpToolsElement.style.top = `${elementRect.top + elementRect.height}px`;
					cmpToolsElement.style.left = `${cmpNewSubheaderElementRect.left}px`;
				}else {
					menuCategoryElement.style.display = "none";
				}
			}
		}else{
			console.error("sub-header not found in DOM");
		}
	};

	const getMenuLink = (item) => {
		const link = item?.link || '#';
		const legacyLink = item?.legacyLink || '#';
		return hasDCPAccess(userData) ? link : legacyLink;
	}

	const analyticsData = (label, type) => {
        pushEvent(ANALYTICS_TYPES.events.click, {
            type: type,
            category: ANALYTICS_TYPES.category.dcpSubheader,
            name: label,
            clickHier: label?.trim() || label
        });
	}

	const getMenuItems = (menuItems, dashboardMenuItems) => {
		if (!menuItems.length) return null;

		if (menuItems && menuItems.length > 0)
		{
			return  menuItems.map((item, index) =>
				<li key={`tabs-${index}`}
					ref={el => menuItemRefs.current[index] = el}
					role="tab" id={`tabs-${index}`}
					className={item.active ? "cmp-tabs__tab cmp-tabs__tab--active" : "cmp-tabs__tab"}
					aria-controls="tabs-d734aa9c61-item-236e9c3f08-tabpanel" tabIndex="0" data-cmp-hook-tabs="tab"
					aria-selected="true" onClick={(e) => returnClickHandler(index)}>
					<a href={getMenuLink(item)}
					    onClick={() => analyticsData(item.title, 'link')}>
						{item.title}
					</a>
					{showDashboard && index == 0 ? dashboardMenu(dashboardMenuItems, hasDCPAccess(userData)) : null}
				</li>
			);
		}
	}

	const [modal, setModal] = useState(null);
	const [showDashboard, setShowDashboard] = useState(false);
	const vendorModalAction = ()=> {
		setModal(null);
	};
	const vendorModal = {
		getConnectionsEndPoint:
			vendorConnectionsModal?.getConnectionsEndPoint ?? 'https://eastus-sit-ui.dc.tdebusiness.cloud/ui-account/v1/',
		setConnectionsEndPoint:
			vendorConnectionsModal?.setConnectionsEndPoint ?? 'https://eastus-sit-ui.dc.tdebusiness.cloud/ui-account/v1/',
		disconnectEndPoint:
			vendorConnectionsModal?.disconnectEndPoint ?? 'https://eastus-sit-ui.dc.tdebusiness.cloud/ui-account/v1/',
		refreshEndPoint:
			vendorConnectionsModal?.vendorConnectionDataRefreshEndpoint ?? 'https://eastus-sit-ui.dc.tdebusiness.cloud/ui-account/v1/refreshData?VendorName=CISCO&Type=ALL',
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
		action: vendorModalAction
	};

	function isPageVendorLogin(url) {
		const regexVendor = vendorModal.vendors.map(v => v.key).join("|").toLowerCase();
		const regexCheckForVendorLoginPage = new RegExp(`${vendorConnectionsModal.loginPageCommonName}-(${regexVendor}).html`);
		return !(url.pathname.match(regexCheckForVendorLoginPage) == null) && url.searchParams.has(vendorConnectionsModal.vendorSignInCodeParameter);
	}

	function getVendorFromURL(url)
	{

		let str = url.pathname.split("/").pop();
		const regex = /.*-(.*).html/gm;
		let m;

		m = regex.exec(str);

		if (m == null || m.length <= 1)
		{
			return false;
		}



		return m[1];
	}

	function checkIfVendorSignedIn() {
		const url = new URL(window.location.href);
		if (isPageVendorLogin(url)) {
			invokeModal({
				content: (
					<VendorConnection
						vendorConfig={vendorConnectionsModal}
						signInRequest={{ code: url.searchParams.get('code'), vendor: getVendorFromURL(url) }}
					></VendorConnection>
				),
				properties: vendorModal
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
	    analyticsData('Vendor Connections', 'button');
		setModal(
			<Modal
				modalAction={modal.properties.action}
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
		<ol role="tablist" className="cmp-sub-header__wrapper__child--left" aria-multiselectable="false">
			{getMenuItems(menuItems, dashboardMenuItems)}
		</ol>
			{userData ?
				<>
				<ul className="cmp-sub-header__wrapper__child--right">
					{userData.companyName && (
						<li>
							<a href='#'>{userData.companyName}</a>
						</li>
					)}
					<li>
						{accountnumberLabel}: {getAccountNumber()}
					</li>
					{(disableVendorConnectionLink && (disableVendorConnectionLink == false || disableVendorConnectionLink == "false"))&& (
                        <li
                            onClick={() => {

                                invokeModal({
                                    content: (
                                        <VendorConnection
                                            vendorConfig={vendorConnectionsModal}
                                        ></VendorConnection>
                                    ),
                                    properties: vendorModal,
                                })
                            }
                            }
                        >
                            <a href='#'>
                                <i className='fas fa-link'></i>
                            </a>
                        </li>
					)}
				</ul>
					{modal}
				</>: null }
		</>)
};

export default NewSubheader;
