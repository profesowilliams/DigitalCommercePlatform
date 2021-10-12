import React from "react";

const ErrorMessage = ({error, messageObject}) => {

    const message = {...messageObject, genericErrorMessage : "Please contact the site Administrator"};
    return (
    <div className="cmp-error">
        <div className="cmp-error__header">
            Error {error.code && error.code} {error.status && error.status}.
        </div>
        <div className="cmp-error__message">
            {error.code === 401 || error.status === 401
                ? messageObject.message401
                : messageObject.genericErrorMessage}
        </div>
    </div>
    )
}

export default ErrorMessage;