export const getUserDataInitialState = () => JSON.parse(localStorage.getItem("userData"));

export const hasDCPAccess = (user) => {
    const HAS_DCP_ACCESS = "hasDCPAccess";
    const {roleList} = user ? user : {undefined};

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