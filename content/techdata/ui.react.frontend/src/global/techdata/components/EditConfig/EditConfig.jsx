import React, { useEffect, useState } from "react";
import { get } from "../../../../utils/api";
import WidgetTitle from "../Widgets/WidgetTitle";
import InputText from "../Widgets/TextInput";
import Button from "../Widgets/Button";

const EditConfig = ({ componentProp }) => {
    // useEffect(() => {
    //     const params = { criteria, ignoreSalesOrganization, isDefault };
    //     const getData = async () => {
    //         const {
    //             data: {
    //                 content: { items },
    //             },
    //         } = await get(endpoint, params);
    //         if (items) setConfigurations(items);
    //     };
    //     getData();
    // }, []);
    const [configurationId, setConfigurationId] = useState("");
    const [configurations, setConfigurations] = useState(false);
    const {
        label,
        buttonTitle,
        endpoint,
        criteria,
        ignoreSalesOrganization,
        isDefault,
        placeholderText,
    } = JSON.parse(componentProp);
    const onChange = ({ target: { value } }) => {
        setConfigurationId(value);
    };

    return (
        <div className='cmp-widget'>
            <WidgetTitle>{label}</WidgetTitle>
            <>
                <p>
                    <InputText
                        onChange={onChange}
                        inputValue={configurationId}
                        label={placeholderText}
                    />
                </p>
                <Button disabled={!configurationId} onClick={() => true}>
                    {buttonTitle}
                </Button>
            </>
        </div>
    );
};

export default EditConfig;
