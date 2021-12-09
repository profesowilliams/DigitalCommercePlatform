"use strict";
use(function () {
    var actionString;
    const ACTION_TYPE_MAIL = "foundation/components/form/actions/mail";
    const ACTION_TYPE_POST = "core/wcm/components/form/actions/rpc";
    var postEndPoint = properties["externalServiceEndPointUrl"] ? properties["externalServiceEndPointUrl"] : "";
    var defaultAction = this.actionType ? this.actionType : "";

    switch (properties["actionType"]) {
        case ACTION_TYPE_POST : actionString = postEndPoint; break;
        default:  actionString = defaultAction;
    }
    //
    // if (properties["actionType"] != null && properties["actionType"].startsWith(ACTION_TYPE_MAIL))
    // {
    //     actionType = "mail";
    // }
    //
    // if (properties["actionType"] != null && properties["actionType"].startsWith(ACTION_TYPE_MAIL))
    // {
    //     actionType = "mail";
    // }



    return {
        action: actionString
    }
});
