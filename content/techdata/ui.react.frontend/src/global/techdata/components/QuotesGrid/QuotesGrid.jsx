import React, { useState } from "react";
import Grid from "../Grid/Grid";
import Modal from "../Modal/Modal";

function QuotesGrid(props) {
    const componentProp = JSON.parse(props.componentProp);
    const { spaDealsIdLabel } = componentProp;

    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [modalAction, setModalAction] = useState(null);

    const CheckoutModal = (id) => {
        return <p style={{ display: "flex" }}>Quote Id : {id}</p>;
    };

    const CheckoutModalProperties = {
        title: "Quote Checkout",
        buttonLabel: "OK",
    };

    const getDateTransformed = (dateUTC) => {
        const formatedDate = new Date(dateUTC).toLocaleDateString();
        return formatedDate;
    };

    const getDealsIdLabel = (deals) =>
        deals.length > 1
            ? spaDealsIdLabel
            : deals.length === 1
            ? deals[0].id
            : null;

    const options = {
        defaultSortingColumnKey: "id",
        defaultSortingDirection: "asc",
    };

    const columnDefs = [
        {
            headerName: "TD Quote ID",
            field: "id",
            sortable: true,
            cellRenderer: (props) => {
                return (
                    <div>
                        <a
                            className='cmp-grid-url-underlined'
                            href={`${
                                window.location.origin +
                                componentProp.quoteDetailUrl
                            }?id=${props.value}`}
                        >
                            {props.value}
                        </a>
                    </div>
                );
            },
        },
        {
            headerName: "Quote Reference",
            field: "quoteReference",
            sortable: false,
            cellRenderer: (props) => {
                return (
                    <div>
                        <a className='cmp-grid-url-not-underlined'>
                            {props.value}
                        </a>
                    </div>
                );
            },
        },
        {
            headerName: "Vendor",
            field: "vendor",
            sortable: false,
        },
        {
            headerName: "End User Name",
            field: "endUserName",
            sortable: false,
        },
        {
            headerName: "SPA/Deal IDs",
            field: "dealId",
            sortable: false,
            valueFormatter: (props) => {
                return getDealsIdLabel(props.value);
            },
        },
        {
            headerName: "Created",
            field: "created",
            sortable: true,
            valueFormatter: (props) => {
                return getDateTransformed(props.value);
            },
        },
        {
            headerName: "Expires",
            field: "expires",
            sortable: false,
            valueFormatter: (props) => {
                return getDateTransformed(props.value);
            },
        },
        {
            headerName: "Quote Value",
            field: "quoteValue",
            sortable: true,
            valueFormatter: (props) => {
                return props.data.currencySymbol + props.value;
            },
        },
        {
            headerName: "Checkout",
            field: "canCheckOut",
            sortable: false,
            onCellClicked: (props) => {
                setModalContent(() => CheckoutModal(props.data.id));
                setModalVisible(true);
            },
            cellRenderer: (props) => {
                return (
                    <div className='cmp-quotes-grid-checkout-icon'>
                        {props.value ? (
                            <i className='fas fa-shopping-cart'></i>
                        ) : (
                            <div></div>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <section>
            <div className='cmp-quotes-grid'>
                <Grid
                    columnDefinition={columnDefs}
                    options={options}
                    config={componentProp}
                ></Grid>
                <Modal
                    modalAction={modalAction}
                    modalContent={modalContent}
                    isModalVisible={modalVisible}
                    onModalClosed={() => setModalVisible(false)}
                    modalProperties={CheckoutModalProperties}
                ></Modal>
            </div>
        </section>
    );
}

export default QuotesGrid;
