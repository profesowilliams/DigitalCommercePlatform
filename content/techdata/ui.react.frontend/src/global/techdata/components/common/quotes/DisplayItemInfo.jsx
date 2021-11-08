import React from "react";
import { removeCommaIfContentNull } from "../../../helpers/formatting";
import { If } from "../../../helpers/If";

function DisplayItemInfo({ children = null, label = null, condition = null }) {

    const SpanInfo = (
        <If condition={children}>
            <span>{!label && removeCommaIfContentNull(children)}</span>
        </If>
    );

    return (
        <>
            <If condition={label && children} Else={SpanInfo} >
                <span>
                    {label} : {children}
                </span>
            </If>
        </>
    );
}

export default DisplayItemInfo;


