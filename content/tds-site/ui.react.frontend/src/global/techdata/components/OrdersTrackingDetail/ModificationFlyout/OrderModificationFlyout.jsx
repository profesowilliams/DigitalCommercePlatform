import React, { useState, useEffect } from 'react';
import NewItemForm from './NewItemForm';
import NewlyAddedLineItem from './NewlyAddedLineItem';
import LineItem from './LineItem';
import { usGet, usPost } from '../../../../../utils/api';
import BaseFlyout from '../../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { useStore } from '../../../../../utils/useStore';
import { getUrlParams } from '../../../../../utils';
import { useOrderTrackingStore } from '../../OrdersTrackingGrid/store/OrderTrackingStore';
import { InfoIcon } from './../../../../../fluentIcons/FluentIcons';

const areItemsListIdentical = (items, itemsCopy) => {
  //// This function compares only quantities rather than all items' parameters
  const difference = items.find((item) => {
    const index = itemsCopy.findIndex(
      (copyItem) => copyItem?.line === item?.line
    );
    if (index > -1) {
      return itemsCopy[index].orderQuantity !== item.orderQuantity;
    } else return false;
  });
  return Boolean(!difference);
};

function OrderModificationFlyout({
  store,
  subheaderReference = '',
  isTDSynnex = true,
  labels = {},
  gridConfig = {},
  content,
  gridRef,
  rowsToGrayOutTDNameRef,
  userData,
}) {
  const { id = '' } = getUrlParams();
  const [items, setItems] = useState([]);
  const orderModificationConfig = store((st) => st.orderModificationFlyout);
  const [orderChanged, setOrderChanged] = useState(false);
  const [newItemFormVisible, setNewItemFormVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [itemsCopy, setItemsCopy] = useState([]);
  const [orderModificationContent, setOrderModificationContent] =
    useState(null);
  const [newlyAddedItems, setNewlyAddedItems] = useState([]);
  const changeRefreshDetailApiState = useStore(
    (state) => state.changeRefreshDetailApiState
  );
  const doesReasonDropdownHaveEmptyItems = store(
    (st) => st.orderModification.doesReasonDropdownHaveEmptyItems
  );
  const { setCustomState } = store((st) => st.effects);
  const effects = useOrderTrackingStore((state) => state.effects);
  const [orderModificationResponse, setOrderModificationResponse] =
    useState(null);
  const orderNumber = id || orderModificationConfig?.id;
  const enableAddLine = orderModificationContent?.addLine === true;
  const requestURLData = `${gridConfig.uiCommerceServiceDomain}/v3/ordermodification/${orderNumber}`;
  const requestURLLineModify = `${gridConfig.uiCommerceServiceDomain}/v2/OrderModify`;
  const getOrderModificationData = async () => {
    try {
      const result = await usGet(requestURLData);
      return result;
    } catch (error) {
      console.error('Error:', error);
    }
  };

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

  const reduceLine = itemsCopy.reduce((filtered, item) => {
    if (item && item?.status === 'Rejected') {
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
    if (item?.orderQuantity > item?.origQuantity) {
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
    OrderID: orderNumber,
    ReduceLine: reduceLine,
    AddLine: addLine,
    ProductID: content?.productDtos?.source?.Id,
  });

  const greyOutRows = async (rows) => {
    rowsToGrayOutTDNameRef.current = [...rows];
    gridRef.current?.api.redrawRows();
  };

  const handleUpdate = async () => {
    try {
      const result = await usPost(requestURLLineModify, getPayload());

      const resultContent = result.data.content;

      const addLineError = resultContent.addLine?.some((e) => e.isError);
      const reduceLineError = resultContent.reduceLine?.some((e) => e.isError);

      const toasterSucess = {
        isOpen: true,
        origin: 'fromUpdate',
        isAutoClose: true,
        isSuccess: true,
        message: getDictionaryValueOrKey(labels?.updateSucessMessage),
      };

      const toasterListedError = {
        isOpen: true,
        origin: 'fromUpdate',
        isAutoClose: true,
        isSuccess: false,
        message: getDictionaryValueOrKey(labels?.updateErrorListMessage),
        Child: (
          <ul>
            {reduceLineError &&
              resultContent.reduceLine.map(
                (line) =>
                  line.isError && (
                    <li key={line.lineId}>
                      {getDictionaryValueOrKey(labels?.line)} {line.lineId} -{' '}
                      {getDictionaryValueOrKey(labels?.reduceQuantity)}
                    </li>
                  )
              )}
            {addLineError &&
              result.data.content.addLine.map(
                (line) =>
                  line.isError && (
                    <li key={line.productId}>
                      {getDictionaryValueOrKey(labels?.addNewLine)}{' '}
                      {line.productId}
                    </li>
                  )
              )}
            {getDictionaryValueOrKey(labels?.pleaseTryAgain)}
          </ul>
        ),
      };
      if (result.data && !result.data?.error?.isError) {
        changeRefreshDetailApiState();
        closeFlyout();
        const rowsDeleted = itemsCopy
          ?.filter((item) => item?.status === 'Rejected')
          .map((item) => item.tdNumber);
        greyOutRows(rowsDeleted);
        effects.setCustomState({ key: 'toaster', value: { ...toasterSucess } });
      }
      if (addLineError || reduceLineError) {
        effects.setCustomState({
          key: 'toaster',
          value: { ...toasterListedError },
        });
      }
    } catch (error) {
      const toasterError = {
        isOpen: true,
        origin: 'fromUpdate',
        isAutoClose: true,
        isSuccess: false,
        message: getDictionaryValueOrKey(labels?.updateErrorMessage),
      };
      console.error('Error updating order:', error);
      effects.setCustomState({ key: 'toaster', value: { ...toasterError } });
    }
  };

  const buttonsSection = (
    <div className="cmp-flyout__footer-buttons order-modification">
      <button disabled={isDisabled} className="primary" onClick={handleUpdate}>
        {getDictionaryValueOrKey(labels?.update)}
      </button>
      <button className="secondary" onClick={closeFlyout}>
        {getDictionaryValueOrKey(labels?.flyoutCancel || labels?.cancel)}
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

  const showNewItemForm = () => {
    enableAddLine && setNewItemFormVisible(true);
  };

  const handleAddNewItem = (item, quantity) => {
    setNewlyAddedItems([
      ...newlyAddedItems,
      { ...item, quantity: Number(quantity) },
    ]);
  };

  const handleRemoveNewItem = (index) => {
    const newItemsList = [...newlyAddedItems];
    newItemsList.splice(index, 1);
    setNewlyAddedItems(newItemsList);
  };

  const handleChangeNewItem = (index, quantity) => {
    const newItemsList = [...newlyAddedItems];
    newItemsList[index].quantity = quantity;
    setNewlyAddedItems(newItemsList);
  };

  useEffect(() => {
    setIsDisabled(!orderChanged || doesReasonDropdownHaveEmptyItems);
  }, [orderChanged, doesReasonDropdownHaveEmptyItems]);

  useEffect(() => {
    orderNumber &&
      getOrderModificationData()
        .then((result) => {
          setOrderModificationResponse(result?.data?.content?.items);
          setItems(result?.data?.content?.items);
          setOrderModificationContent(result.data.content);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  }, [orderNumber]);

  return (
    <BaseFlyout
      open={orderModificationConfig?.show}
      onClose={closeFlyout}
      width="929px"
      anchor="right"
      subheaderReference={subheaderReference}
      titleLabel={getDictionaryValueOrKey(
        labels?.modifyOrder || labels?.modifyOrderTitle
      )}
      disabledButton={isDisabled}
      secondaryButton={null}
      isTDSynnex={isTDSynnex}
      onClickButton={null}
      bottomContent={null}
      buttonsSection={buttonsSection}
    >
      <section className="cmp-flyout__content order-modification">
        <a
          className={`add-new ${!enableAddLine ? 'add-new-disabled' : ''}`}
          onClick={showNewItemForm}
        >
          + {getDictionaryValueOrKey(labels.addNewItem)}
        </a>
        {newItemFormVisible && (
          <NewItemForm
            labels={labels}
            setNewItemFormVisible={setNewItemFormVisible}
            domain={gridConfig.uiCommerceServiceDomain}
            addNewItem={handleAddNewItem}
          />
        )}
        <>
          <ul>
            {newlyAddedItems.map((item, index) => (
              <NewlyAddedLineItem
                key={index}
                index={index}
                labels={labels}
                item={item}
                onChange={handleChangeNewItem}
                removeElement={() => handleRemoveNewItem(index)}
              />
            ))}
          </ul>
          {newlyAddedItems.length > 0 && (
            <p className="new-items-list-info">
              <InfoIcon />
              <span>{getDictionaryValueOrKey(labels?.newItemInfo)}</span>
            </p>
          )}
        </>
        <p className="edit-quantities">
          {getDictionaryValueOrKey(labels?.editQuantities)}
        </p>
        <ul className="cmp-flyout-list">
          {orderModificationResponse?.map((item, index) => (
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
