import React from 'react';
import {Image} from '@react-pdf/renderer';
import {getImageBuffer} from "../../../../utils/utils";


const ReactPDFImageWrapper = (props) => {

    const buffer = getImageBuffer(props.path);
    return (
        <Image src={buffer}/>
    )
}

export default ReactPDFImageWrapper;