import { isDisableChecksForDCPAccess, disableEntitlementsList } from "../featureFlagUtils";
import { getSessionInfo } from "./get";

export const ACCESS_TYPES = {
    DCP_ACCESS: "hasDCPAccess",
    CAN_VIEW_ORDERS: 'CanViewOrders',
    CAN_ACCESS_RENEWALS: 'CanAccessRenewals',
    RENEWALS_ACCESS: 'hasRenewalsAccess',
}

export const RENEWALS_TYPE = {
    resellerName: 'resellerName'
}

export const isHouseAccount = (userData) => {
    if (userData) {
        return userData?.isHouseAccount ?? false
    }
    else {
        return getSessionInfo().then((data) => {
            let userData = data[1];
            return userData?.isHouseAccount ?? false
        });
    }
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
