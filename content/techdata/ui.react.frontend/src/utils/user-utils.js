import { isDisableChecksForDCPAccess } from "featureFlagUtils";
export const ACCESS_TYPES = {
    DCP_ACCESS: "hasDCPAccess",
    CAN_VIEW_ORDERS: 'CanViewOrders',
    RENEWALS_ACCESS: 'hasRenewalsAccess',
}

export const RENEWALS_TYPE = {
    resellerName: 'resellerName'
}

export const getUserDataInitialState = () => JSON.parse(localStorage.getItem("userData"));

export const getSessionId = () => window.localStorage.getItem("sessionId");

export const isInternalUser = getUserDataInitialState()?.isInternal ?? false;

export const isHouseAccount = () => getUserDataInitialState()?.isHouseAccount ?? false;

export const hasDCPAccess = (user) => {
    const HAS_DCP_ACCESS = ACCESS_TYPES.DCP_ACCESS;
    const {roleList} = user ? user : {undefined};
    if (isDisableChecksForDCPAccess) {
        console.log("Returning as disableChecksForDCPAccess is true!!!");
        return false;
    }
    if (roleList && roleList.length) {
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
    const _accessType = accessType ? accessType : ACCESS_TYPES.CAN_VIEW_ORDERS
    const { roleList } = user ? user : { undefined };

    if (roleList && roleList.length) {
        for (let eachItem of roleList)
        {
            if (eachItem?.entitlement.toLowerCase().trim() === _accessType.toLowerCase())
            {
                return true;
            }
        }
    }
    return false;
    // return window.location.hostname === 'localhost' ? true : false;
}