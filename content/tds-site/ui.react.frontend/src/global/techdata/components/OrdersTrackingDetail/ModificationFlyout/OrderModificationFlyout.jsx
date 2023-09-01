import React, { useState, useEffect } from 'react';
import { usPost } from '../../../../../utils/api';
import BaseFlyout from '../../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { useOrderTrackingStore } from '../../OrdersTrackingGrid/store/OrderTrackingStore';
import NewItemForm from './NewItemForm';
import LineItem from './LineItem';
import { useStore } from '../../../../../utils/useStore';

const areItemsListIdentical = (items, itemsCopy) => {
  // This function compares only quantities rather than all items' parameters
  const difference = items.find((item) => {
    const index = itemsCopy.findIndex(
      (copyItem) => copyItem.line === item.line
    );
    if (index > -1) {
      return itemsCopy[index].orderQuantity !== item.orderQuantity;
    } else return false;
  });
  return Boolean(!difference);
};

function OrderModificationFlyout({
  subheaderReference = '',
  isTDSynnex = true,
  items = [],
  labels = {},
  config = {},
  apiResponse,
  gridRef,
  rowToGrayOutTDNameRef,
}) {
  const [orderChanged, setOrderChanged] = useState(false);
  const [newItemFormVisible, setNewItemFormVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [quantityDifference, setQuantityDifference] = useState();
  const [productID, setProductID] = useState('');
  const [itemsRequestData, setItemsRequestData] = useState([]);
  const changeRefreshDetailApiState = useStore(
    (state) => state.changeRefreshDetailApiState
  );
  const store = useOrderTrackingStore;
  const orderModificationConfig = store((st) => st.orderModificationFlyout);
  const doesReasonDropdownHaveEmptyItems = store(
    (st) => st.doesReasonDropdownHaveEmptyItems
  );
  const { setCustomState } = store((st) => st.effects);
  const closeFlyout = () => {
    setNewItemFormVisible(false);
    setCustomState({
      key: 'orderModificationFlyout',
      value: { show: false },
    });
  };

  useEffect(() => {
    setIsDisabled(!orderChanged || doesReasonDropdownHaveEmptyItems);
  }, [orderChanged, doesReasonDropdownHaveEmptyItems]);

  const itemsCopy = [...items];

  const requestURL = config?.orderModifyEndpoint;
  const payload = {
    OrderID: apiResponse?.orderNumber,
    ReduceLine: [],
    AddLine: [
      {
        ProductID: productID,
        Qty: `${quantityDifference}`,
        UAN: '',
      },
    ],
  };
  const requestChangeURL = config?.orderModifyChangeEndpoint;

  const handleUpdate = async () => {
    try {
      const result = await usPost(requestURL, payload);
      if (result.data && !result.data?.error?.isError) {
        changeRefreshDetailApiState();
        closeFlyout();

        for (const item of itemsRequestData) {
          const payloadChange = {
            id: item.id,
            quantity: item.quantity,
            origQuantity: item.origQuantity,
            subtotalPrice: item.subtotalPrice,
            subtotalPriceFormatted: item.subtotalPriceFormatted,
            ShipDate: item.ShipDate,
            ShipDateFormatted: item.ShipDateFormatted,
            isShipment: item.isShipment,
            status: item.status,
          };

          const timeout = (ms) => new Promise((res) => setTimeout(res, ms));
          const greyOutRow = async () => {
            await timeout(5000);
            rowToGrayOutTDNameRef.current = item.tdNumber;
            gridRef.current?.api.redrawRows();
          };

          const fetchChangeData = async () => {
            usPost(requestChangeURL, payloadChange);
          };

          const clear = async () => {
            await timeout(6000);
            rowToGrayOutTDNameRef.current = undefined;
            gridRef.current?.api.redrawRows();
          };

          greyOutRow()
            .then(() => fetchChangeData())
            .then(() => clear());
        }
        return result;
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
    setItemsRequestData([]);
    setIsDisabled(true);
  };

  const buttonsSection = (
    <div className="cmp-flyout__footer-buttons order-modification">
      <button disabled={isDisabled} className="primary" onClick={handleUpdate}>
        {getDictionaryValueOrKey(labels.update)}
      </button>
      <button className="secondary" onClick={closeFlyout}>
        {getDictionaryValueOrKey(labels.cancel)}
      </button>
    </div>
  );

  const handleAmountChange = (index, newAmount) => {
    itemsCopy[index] = { ...items[index], orderQuantity: newAmount };
    setOrderChanged(!areItemsListIdentical(items, itemsCopy));
  };

  const handleAddNewItem = () => {
    setNewItemFormVisible(true);
  };

  return (
    <BaseFlyout
      open={orderModificationConfig?.show}
      onClose={closeFlyout}
      width="929px"
      anchor="right"
      subheaderReference={subheaderReference}
      titleLabel={getDictionaryValueOrKey(labels.modifyOrder)}
      disabledButton={isDisabled}
      secondaryButton={null}
      isTDSynnex={isTDSynnex}
      onClickButton={null}
      bottomContent={null}
      buttonsSection={buttonsSection}
    >
      <section className="cmp-flyout__content order-modification">
        <a className="add-new" onClick={handleAddNewItem}>
          + {getDictionaryValueOrKey(labels.addNewItem)}
        </a>
        {newItemFormVisible && <NewItemForm labels={labels} />}
        <p className="edit-quantities">
          {getDictionaryValueOrKey(labels.editQuantities)}
        </p>
        <ul className="cmp-flyout-list">
          {items.map((item, index) => (
            <LineItem
              key={item.line}
              index={index}
              item={item}
              onChange={handleAmountChange}
              labels={labels}
              setQuantityDifference={setQuantityDifference}
              setProductID={setProductID}
              itemsRequestData={itemsRequestData}
              setItemsRequestData={setItemsRequestData}
            />
          ))}
        </ul>
      </section>
    </BaseFlyout>
  );
}

export default OrderModificationFlyout;
