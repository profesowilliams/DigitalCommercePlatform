const data = {
    createFromId: 'string',
    createFromType: 1,
    salesOrg: 'string',
    targetSystem: 'string',
    endUserPo: 'string',
    customerPo: 'string',
    type: {
        id: 'string',
        value: 'string'
    },
    level: {
        id: 'string',
        value: 'string'
    },
    creator: 'string',
    reseller: {
        id: 'string',
        name: 'string',
        contact: [
            {
                name: 'string',
                email: 'string',
                phone: 'string'
            }
        ],
        address: {
            id: 'string',
            line1: 'string',
            line2: 'string',
            line3: 'string',
            city: 'string',
            state: 'string',
            postalCode: 'string',
            country: 'string'
        }
    },
    shipTo: {
        id: 'string',
        name: 'string',
        contact: [
            {
                name: 'string',
                email: 'string',
                phone: 'string'
            }
        ],
        address: {
            id: 'string',
            line1: 'string',
            line2: 'string',
            line3: 'string',
            city: 'string',
            state: 'string',
            postalCode: 'string',
            country: 'string'
        }
    },
    endUser: {
        id: 'string',
        name: 'string',
        contact: [
            {
                name: 'string',
                email: 'string',
                phone: 'string'
            }
        ],
        address: {
            id: 'string',
            line1: 'string',
            line2: 'string',
            line3: 'string',
            city: 'string',
            state: 'string',
            postalCode: 'string',
            country: 'string'
        }
    },
    vendorReference: {
        type: 'string',
        value: 'string'
    },
    items: [
        {
            id: 'string',
            parent: 'string',
            product: [
                {
                    type: 'string',
                    id: 'string',
                    name: 'string',
                    manufacturer: 'string',
                    localManufacturer: 'string',
                    classification: 'string'
                }
            ],
            quantity: 0,
            contractNumber: 'string',
            contractType: 'string',
            license: 'string',
            references: [
                {
                    type: 'string',
                    value: 'string'
                }
            ],
            unitPrice: 0,
            unitCost: 0,
            totalPrice: 0,
            unitListPrice: 0,
            extendedListPrice: 0,
            endUser: {
                id: 'string',
                name: 'string',
                contact: [
                    {
                        name: 'string',
                        email: 'string',
                        phone: 'string'
                    }
                ],
                address: {
                    id: 'string',
                    line1: 'string',
                    line2: 'string',
                    line3: 'string',
                    city: 'string',
                    state: 'string',
                    postalCode: 'string',
                    country: 'string'
                }
            },
            group: 'string',
            solution: 'string',
            confirmedQuantity: 0,
            status: 'string',
            statusNotes: 'string',
            updated: '2021-07-30T09:35:10.079Z',
            margins: [
                {
                    typeMargin: 0,
                    amount: 0,
                    percent: 0
                }
            ],
            requested: '2021-07-30T09:35:10.079Z',
            shippingCondition: 'string',
            shipFrom: 'string',
            director: {
                id: 'string',
                name: 'string'
            },
            divisionManager: {
                id: 'string',
                name: 'string'
            },
            businessManager: {
                id: 'string',
                name: 'string'
            }
        }
    ],
    agreements: [
        {
            id: 'string',
            version: 'string',
            vendorId: 'string',
            selectionFlag: 'string'
        }
    ],
    pricingCondition: 'string'
};

export default data;