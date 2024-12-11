import React, { useState, useEffect } from "react";
import { createProducedSetter } from "../Common/utils";
import isEmail from 'validator/es/lib/isEmail';

export default function useResellerHandlers(detailsObj, setStateFunction) {
    const { contact, customerPO } = detailsObj;
    const [isEmailValid, setIsEmailValid] = useState(
        contact[0]?.email?.isValid || true
    );

    useEffect(() => {
      const email = contact[0]?.email?.text || '';
        validateEmail(email);
    }, [contact]);

    const phoneRegex = /^(\d|\ |\)|\(|\+|\-)*$/;

    const producedSet = createProducedSetter(setStateFunction);
    const validateEmail = (email) => {
        if (isEmail(email) && email.length > 0) {
            setIsEmailValid(true);
        } else {
            setIsEmailValid(false);
        }
    }

    const handlersObj = {
        contactName: (e) => {
            producedSet("contact[0].name.text", e.target.value);
        },
        email: (e) => {
            let email = e.target.value;
            producedSet("contact[0].email.text", email);
            validateEmail(email);
        },
        customerPO: (e) => {
        console.log(e, 'testing');
            producedSet("customerPO.text", e.target.value);
        },
        phone: (e) => {
            if (phoneRegex.test(e.target.value))
                producedSet("contact[0].phone.text", e.target.value);
        },
    };

    return [handlersObj, isEmailValid];
};
