import { isDisableChecksForDCPAccess, disableEntitlementsList } from "./featureFlagUtils";
export const ACCESS_TYPES = {
    DCP_ACCESS: "hasDCPAccess",
    CAN_VIEW_ORDERS: 'CanViewOrders',
    CAN_ACCESS_RENEWALS: 'CanAccessRenewals',
    RENEWALS_ACCESS: 'hasRenewalsAccess',
}

export const RENEWALS_TYPE = {
    resellerName: 'resellerName'
}

let userIsLoggedIn = window.localStorage.getItem("sessionId");
let userData = JSON.parse(localStorage.getItem("userData"));

window.getSessionInfo && window.getSessionInfo().then((data) => {
  userIsLoggedIn = data[0];
  userData = data[1];
});

export const getUserDataInitialState = () => userData;

export const isHouseAccount = (userData) => {
    const currentUserData = userData ?? getUserDataInitialState();
    return currentUserData?.isHouseAccount ?? false;
}

export const hasDCPAccess = (user) => {
    const HAS_DCP_ACCESS = ACCESS_TYPES.DCP_ACCESS;
    const {roleList} = user ? user : {undefined};
    if (isDisableChecksForDCPAccess()) {
        console.log("Returning as disableChecksForDCPAccess is true!!!");
        return true;
    } else if (roleList && roleList.length) {
        for (let eachItem of roleList)
        {
            if (eachItem?.entitlement.toLowerCase().trim() === HAS_DCP_ACCESS.toLowerCase())
            {
                return true;
            }
        }

    }
    return false;
}

export const hasAccess = ({user, accessType})=> {
    if(isDisableEntitlementsInList()) return false;
    const _accessType = accessType ? accessType : ACCESS_TYPES.CAN_VIEW_ORDERS
    const { roleList } = user ? user : { undefined };
    var hasRoleListFlag = hasRoleList(roleList, _accessType);
    if(hasRoleListFlag) {
        return true;
    }
    return false;
}

function isDisableEntitlementsInList() {
	var entitlementsList = disableEntitlementsList();
    if(entitlementsList && entitlementsList.indexOf(ACCESS_TYPES.CAN_VIEW_ORDERS) >= 0) {
        console.log("Returning as disableEntitlementsList has CanViewOrders!!!");
        return true;
    }
    return false;
}

function hasRoleList(roleList, _accessType) {
    if (roleList && roleList.length) {
        for (let eachItem of roleList) {
            if (eachItem?.entitlement.toLowerCase().trim() === _accessType.toLowerCase()) {
                return true;
            }
        }
    }
    return false;
}
