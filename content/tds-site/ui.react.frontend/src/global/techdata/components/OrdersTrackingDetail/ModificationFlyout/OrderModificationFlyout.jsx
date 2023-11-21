import React, { useState, useEffect } from 'react';
import { usPost } from '../../../../../utils/api';
import BaseFlyout from '../../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { useOrderTrackingStore } from '../../OrdersTrackingGrid/store/OrderTrackingStore';
import NewItemForm from './NewItemForm';
import LineItem from './LineItem';
import { useStore } from '../../../../../utils/useStore';

const timeout = (ms) => new Promise((res) => setTimeout(res, ms));

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
  labels = {},
  config = {},
  content,
  gridRef,
  rowsToGrayOutTDNameRef,
  userData,
}) {
  const items = content?.items || [];
  const [orderChanged, setOrderChanged] = useState(false);
  const [newItemFormVisible, setNewItemFormVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [itemsCopy, setItemsCopy] = useState([...items]);
  const changeRefreshDetailApiState = useStore(
    (state) => state.changeRefreshDetailApiState
  );
  const store = useOrderTrackingStore;
  const orderModificationConfig = store((st) => st.orderModificationFlyout);
  const doesReasonDropdownHaveEmptyItems = store(
    (st) => st.orderModification.doesReasonDropdownHaveEmptyItems
  );
  const { setCustomState } = store((st) => st.effects);
  const closeFlyout = () => {
    setNewItemFormVisible(false);
    setItemsCopy([...items]);
    setOrderChanged(false);
    setIsDisabled(true);
    setCustomState({
      key: 'orderModificationFlyout',
      value: { show: false },
    });
  };
  const requestURL = config?.orderModifyEndpoint;

  const reduceLine = itemsCopy.reduce((filtered, item) => {
    if (item.status === 'Rejected') {
      const newItem = {
        LineID: item.line,
        Qty: item.orderQuantity,
        RejectionReason: item.RejectionReason,
      };
      filtered.push(newItem);
    }
    return filtered;
  }, []);

  const addLine = itemsCopy.reduce((filtered, item) => {
    if (item.orderQuantity > item.origQuantity) {
      const newItem = {
        ProductID: item.tdNumber,
        Qty: item.orderQuantity - item.origQuantity,
        UAN: '',
      };
      filtered.push(newItem);
    }
    return filtered;
  }, []);

  const getPayload = () => ({
    SalesOrg: userData?.customersV2?.[0]?.salesOrg,
    CustomerID: userData?.customersV2?.[0]?.customerNumber,
    OrderID: content?.orderNumber,
    ReduceLine: reduceLine,
    AddLine: addLine,
  });

  const greyOutRows = async (rows) => {
    rowsToGrayOutTDNameRef.current = [...rows];
    gridRef.current?.api.redrawRows();
  };

  const handleUpdate = async () => {
    try {
      const result = await usPost(requestURL, getPayload());
      if (result.data && !result.data?.error?.isError) {
        changeRefreshDetailApiState();
        closeFlyout();
        const rowsDeleted = itemsCopy
          .filter((item) => item.status === 'Rejected')
          .map((item) => item.tdNumber);
        greyOutRows(rowsDeleted);
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const buttonsSection = (
    <div className="cmp-flyout__footer-buttons order-modification">
      <button disabled={isDisabled} className="primary" onClick={handleUpdate}>
        {getDictionaryValueOrKey(labels?.update)}
      </button>
      <button className="secondary" onClick={closeFlyout}>
        {getDictionaryValueOrKey(labels?.cancel)}
      </button>
    </div>
  );

  const handleChange = (index, newItem) => {
    const updatedItemsCopy = [...itemsCopy];
    const item = { ...updatedItemsCopy[index], ...newItem };
    updatedItemsCopy[index] = item;
    setItemsCopy([...updatedItemsCopy]);
    setOrderChanged(!areItemsListIdentical(items, updatedItemsCopy));
  };

  const handleAddNewItem = () => {
    setNewItemFormVisible(true);
  };

  useEffect(() => {
    setIsDisabled(!orderChanged || doesReasonDropdownHaveEmptyItems);
  }, [orderChanged, doesReasonDropdownHaveEmptyItems]);
  return (
    <BaseFlyout
      open={orderModificationConfig?.show}
      onClose={closeFlyout}
      width="929px"
      anchor="right"
      subheaderReference={subheaderReference}
      titleLabel={labels?.modifyOrder || labels?.modifyOrderTitle}
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
        {newItemFormVisible && (
          <NewItemForm
            labels={labels}
            setNewItemFormVisible={setNewItemFormVisible}
          />
        )}
        <p className="edit-quantities">
          {getDictionaryValueOrKey(labels?.editQuantities)}
        </p>
        <ul className="cmp-flyout-list">
          {items.map((item, index) => (
            <LineItem
              key={item.line}
              index={index}
              item={item}
              onChange={handleChange}
              labels={labels}
            />
          ))}
        </ul>
      </section>
    </BaseFlyout>
  );
}

export default OrderModificationFlyout;
