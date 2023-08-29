import { getSessionInfo } from "./user/get";
import { isAuthormodeAEM, isQualtricsCodeEnabled } from "./featureFlagUtils";

(async function () {
    if (!isAuthormodeAEM && isQualtricsCodeEnabled && typeof QSI === "undefined") {
        // QSI object populated only for logged in user
        const [userIsLoggedIn, userData] = await getSessionInfo();

        if (userIsLoggedIn && userData) {
            var QSI = {};
            QSI.config = {
                externalReference: userData.id
            };
        }
    }
})();