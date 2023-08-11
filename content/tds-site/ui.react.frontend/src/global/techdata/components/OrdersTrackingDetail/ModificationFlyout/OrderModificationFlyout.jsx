import React, { useState } from 'react';
import { usPost } from '../../../../../utils/api';
import BaseFlyout from '../../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { useOrderTrackingStore } from '../../OrdersTrackingGrid/store/OrderTrackingStore';
import NewItemForm from './NewItemForm';
import LineItem from './LineItem';

const areItemsListIdentical = (items, itemsCopy) => {
  // This function compares only quantities rather than all items' parameters
  const difference = items.find((item) => {
    const index = itemsCopy.findIndex((copyItem) => copyItem.id === item.id);
    if (index > -1) {
      return itemsCopy[index].quantity !== item.quantity;
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
}) {
  const [orderChanged, setOrderChanged] = useState(false);
  const [newItemFormVisible, setNewItemFormVisible] = useState(false);
  const [quantityDifference, setQuantityDifference] = useState();
  const [productID, setProductID] = useState('');

  const store = useOrderTrackingStore;
  const orderModificationConfig = store((st) => st.orderModificationFlyout);
  const effects = store((st) => st.effects);
  const closeFlyout = () => {
    setNewItemFormVisible(false);
    effects.setCustomState({
      key: 'orderModificationFlyout',
      value: { show: false },
    });
  };

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
  const handleUpdate = async () => {
    try {
      const result = await usPost(requestURL, payload);
      if (!result.data?.error?.isError) console.log('Updated');
      return result;
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const buttonsSection = (
    <div className="cmp-flyout__footer-buttons order-modification">
      <button
        disabled={!orderChanged}
        className="primary"
        onClick={handleUpdate}
      >
        {getDictionaryValueOrKey(labels.update)}
      </button>
      <button className="secondary" onClick={closeFlyout}>
        {getDictionaryValueOrKey(labels.cancel)}
      </button>
    </div>
  );

  const handleAmountChange = (index, newAmount) => {
    itemsCopy[index] = { ...items[index], quantity: newAmount };
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
      disabledButton={true}
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
              key={item.id}
              index={index}
              item={item}
              onChange={handleAmountChange}
              labels={labels}
              setQuantityDifference={setQuantityDifference}
              setProductID={setProductID}
            />
          ))}
        </ul>
      </section>
    </BaseFlyout>
  );
}

export default OrderModificationFlyout;
