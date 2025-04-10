import React, {useState, useRef} from "react";
import { generateFileFromPost as generateExcelFileFromPost } from "../../../../../utils/utils";
import Modal from "../../Modal/Modal";
import LineItemsExportXls from "../OrderDetailItemExport/LineItemsExportXls";
import  { orderStatusValues } from "../orderStatus";
import { ANALYTICS_TYPES, pushEvent } from '../../../../../utils/dataLayerUtils';

const OrderSubHeader = ({
      headerConfig,
      orderDetails,
      id,
      exportUrl,
      exportColumnList
}) => {
const [modal, setModal] = useState(null);
const downloadXls = () => (fieldsList) => {
    try {
        const postData = {
            orderId:id,
            ExportedFields:fieldsList
        }
        const name = `order-${id}.xls`;
        generateExcelFileFromPost({url:exportUrl,name,postData});
        return result.data;
      } catch( error ) {
        return error;
      }

}
const handleClickCSV = () => {

    pushEvent(ANALYTICS_TYPES.events.click, 
    {
       type: ANALYTICS_TYPES.types.link, 
       name: headerConfig.exportCSVLabel,
       category: ANALYTICS_TYPES.category.orderDetailTableInteraction
    });

    const modal = {
        properties:{
            title: 'Export XLS',
            buttonLabel: 'Export'
        },       
        modalAction: downloadXls()
    }
    setModal(modal)
}
const {status} = orderDetails;

const orderButton = (status) => {
    switch (status?.toLowerCase()) {
        case orderStatusValues.OPEN:
            return (
                <button className="cmp-td-order-details__header__status__open">Open</button>
            );
            break;
        case orderStatusValues.OPEN_IN_PROCESS:
            return (
                <button className="cmp-td-order-details__header__status__open">Open and in Process</button>
            );
        case orderStatusValues.CANCELLED:
            return (
                <button className="cmp-td-order-details__header__status__cancelled">Cancelled</button>
            );
            break;
        case orderStatusValues.CREDIT_REVIEW:
            return (
                <button className="cmp-td-order-details__header__status__in-review">In Review</button>
            );
            break;
        case orderStatusValues.SALES_REVIEW:
            return (
                <button className="cmp-td-order-details__header__status__in-review">In Review</button>
            );
            break;
        case orderStatusValues.SHIPPED:
            return (
                <button className="cmp-td-order-details__header__status__shipped">Shipped</button>
            );
            break;
        default :
            return (
                <button className="cmp-td-order-details__header__status__error">Status Not Found</button>
            );
            break;
    }
}

  return (
      <div>
            <div className="cmp-td-order-details__header cmp-quote-details--header-container">
                <div className="cmp-td-order-details__header__details">
                    <button onClick={()=> {window.history.go(location.href.indexOf('#') > 0 ? -2 : -1); return false}} className="cmp-td-order-details__header__details--icon">
                        <i className="fas fa-chevron-left" />
                    </button>
                    <div className="cmp-td-order-details__header__details__order-number">{headerConfig.orderLabel} {id}</div>
                </div>
                <div>
                    <div>{headerConfig.orderDateLabel} {orderDetails?.created ? orderDetails?.created : "Order Date Not Found" }</div>
                    <div>{headerConfig.purchaseOrderLabel} {orderDetails?.poNumber ? orderDetails?.poNumber : "Purchase Order Not Found"}</div>
                </div>
                <div className="cmp-td-order-details__header__status">
                    <a href="#" onClick={handleClickCSV}>{headerConfig.exportCSVLabel}</a>
                    <div>{headerConfig.phoneNumberLabel}</div>
                    {orderButton(status)}
                </div>            
            </div>
      
            {modal &&
                    <Modal
                        modalExportChild={{Child:LineItemsExportXls, exportColumnList}}
                        modalProperties={modal.properties}
                        onModalClosed={() => setModal(null)}
                        modalAction={modal.modalAction}
                    />
            }
      </div>
  );
};

export default OrderSubHeader;
