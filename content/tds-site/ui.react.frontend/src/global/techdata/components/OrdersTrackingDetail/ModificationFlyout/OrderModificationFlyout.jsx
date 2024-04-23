import React, { useState, useEffect } from 'react';
import NewItemForm from './NewItemForm';
import NewlyAddedLineItem from './NewlyAddedLineItem';
import LineItem from './LineItem';
import ErrorMessage from './ErrorMessage';
import { usGet, usPost } from '../../../../../utils/api';
import BaseFlyout from '../../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { useStore } from '../../../../../utils/useStore';
import { getUrlParams } from '../../../../../utils';
import { useOrderTrackingStore } from '../../OrdersTrackingGrid/store/OrderTrackingStore';
import { InfoIcon } from './../../../../../fluentIcons/FluentIcons';
import {
  getAddLineAnalyticsGoogle,
  getReduceQuantityAnalyticsGoogle,
  pushDataLayerGoogle,
} from '../../OrdersTrackingGrid/utils/analyticsUtils';
import { endpoints } from '../../OrdersTrackingGrid/utils/orderTrackingUtils';

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
  subheaderReference = '',
  isTDSynnex = true,
  labels = {},
  gridConfig = {},
  content,
  gridRef = null,
  rowsToGrayOutTDNameRef = null,
  setOrderModifyHeaderInfo = () => {},
}) {
  const { id = '' } = getUrlParams();
  const [items, setItems] = useState([]);
  const orderModificationConfig = useOrderTrackingStore(
    (st) => st.orderModificationFlyout
  );
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
  const doesReasonDropdownHaveEmptyItems = useOrderTrackingStore(
    (st) => st.orderModification.doesReasonDropdownHaveEmptyItems
  );
  const { setCustomState, setOrderDetailSubtotalValue } = useOrderTrackingStore(
    (state) => state.effects
  );
  const userData = useOrderTrackingStore((state) => state.userData);
  const [orderModificationResponse, setOrderModificationResponse] =
    useState(null);
  const orderNumber = id || orderModificationConfig?.id;
  const notShippedTabGridRef = orderModificationConfig?.gridRef;
  const notShippedTabGridRowsRef =
    orderModificationConfig?.rowsToGrayOutTDNameRef;
  const flyoutVisible = orderModificationConfig?.show;
  const enableAddLine = orderModificationContent?.addLine === true;
  const requestURLData = `${gridConfig.uiCommerceServiceDomain}/v3/ordermodification/${orderNumber}`;
  const requestURLLineModify = `${gridConfig.uiCommerceServiceDomain}${endpoints.orderModify}`;
  const enableErrorMessage = orderModificationResponse?.length === 0;
  const getOrderModificationData = async () => {
    try {
      const result = await usGet(requestURLData);
      const resultContent = result.data.content;
      const orderEditable = resultContent?.orderEditable;
      const toaster = {
        isOpen: true,
        origin: 'fromUpdate',
        isAutoClose: true,
        isSuccess: false,
        message: getDictionaryValueOrKey(labels?.modifyErrorMessage),
      };
      !orderEditable &&
        setCustomState({ key: 'toaster', value: { ...toaster } });
      return result;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const closeFlyout = () => {
    setNewlyAddedItems([]);
    setNewItemFormVisible(false);
    setItemsCopy([...items]);
    setOrderChanged(false);
    setIsDisabled(true);
    setCustomState({
      key: 'orderModificationFlyout',
      value: { show: false },
    });
  };
  const reduceLineForGTM = [];
  const reduceLine = itemsCopy.reduce((filtered, item) => {
    if (item && item?.status === 'Rejected') {
      const newItem = {
        LineID: item.line,
        Qty: item.orderQuantity,
        RejectionReason: item.RejectionReason,
      };
      reduceLineForGTM.push(item.mfrNumber);
      filtered.push(newItem);
    }
    return filtered;
  }, []);
  const addLineForGTM = [];
  const addLine = itemsCopy.reduce((filtered, item) => {
    if (item?.orderQuantity > item?.origQuantity) {
      const newItem = {
        ProductID: item.tdNumber,
        Qty: item.orderQuantity - item.origQuantity,
        UAN: '',
      };
      filtered.push(newItem);
      addLineForGTM.push(item.mfrNumber);
    }
    return filtered;
  }, []);

  const newlyAddedLines = newlyAddedItems.map((item) => ({
    ProductID: item.id,
    Qty: item.quantity,
  }));

  const getPayload = () => ({
    SalesOrg: userData?.customersV2?.[0]?.salesOrg,
    CustomerID: userData?.customersV2?.[0]?.customerNumber,
    OrderID: orderNumber,
    ReduceLine: reduceLine,
    AddLine: addLine.concat(newlyAddedLines),
    ProductID: content?.productDtos?.source?.Id,
  });

  const greyOutRows = async (rows) => {
    rowsToGrayOutTDNameRef
      ? (rowsToGrayOutTDNameRef.current = [...rows])
      : (notShippedTabGridRowsRef.current = [...rows]);
    gridRef
      ? gridRef.current?.api.redrawRows()
      : notShippedTabGridRef.current?.api.redrawRows();
  };

  const handleUpdate = async () => {
    let subtotalValue = 0;
    const rowsDeleted = itemsCopy?.reduce((array, item) => {
      if (item?.status === 'Rejected') {
        return [...array, item.tdNumber];
      } else {
        subtotalValue += item.unitPrice * item.originalOrderQuantity;
        return array;
      }
    }, []);
    setOrderDetailSubtotalValue(subtotalValue);
    greyOutRows(rowsDeleted);
    addLineForGTM.map((line) => {
      pushDataLayerGoogle(getAddLineAnalyticsGoogle(line));
    });
    reduceLineForGTM.map((line) => {
      pushDataLayerGoogle(getReduceQuantityAnalyticsGoogle(line));
    });
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
      closeFlyout();
      if (result.data && !result.data?.error?.isError) {
        changeRefreshDetailApiState('lineDetails');
        setCustomState({ key: 'toaster', value: { ...toasterSucess } });
      }
      if (addLineError || reduceLineError) {
        setCustomState({
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
        message: getDictionaryValueOrKey(
          labels?.updateErrorMessage || labels?.modifyUpdateErrorMessage
        ),
      };
      console.error('Error updating order:', error);
      closeFlyout();
      setCustomState({ key: 'toaster', value: { ...toasterError } });
    } finally {
      greyOutRows([]);
      setOrderDetailSubtotalValue(null);
      setOrderModifyHeaderInfo(true);
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

  const handleChangeNewItem = async (index, quantity, price) => {
    const newItemsList = [...newlyAddedItems];
    newItemsList[index].quantity = quantity;
    newItemsList[index].price = price;
    setNewlyAddedItems(newItemsList);
  };

  useEffect(() => {
    setIsDisabled(
      (!orderChanged || doesReasonDropdownHaveEmptyItems) &&
        newlyAddedItems.length === 0
    );
  }, [orderChanged, doesReasonDropdownHaveEmptyItems, newlyAddedItems]);

  useEffect(() => {
    orderNumber &&
      flyoutVisible &&
      getOrderModificationData()
        .then((result) => {
          setOrderModificationResponse(result?.data?.content?.items);
          setItems(result?.data?.content?.items);
          setItemsCopy(result?.data?.content?.items);
          setOrderModificationContent(result.data.content);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  }, [orderNumber, flyoutVisible]);

  useEffect(() => {
    if (!orderModificationConfig?.show && id.length === 0) {
      setOrderModificationResponse(null);
    }
  }, [orderModificationConfig?.show]);
  return (
    <BaseFlyout
      open={orderModificationConfig?.show}
      onClose={closeFlyout}
      width="768px"
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
          <ul className="new-list">
            {newlyAddedItems.map((item, index) => (
              <NewlyAddedLineItem
                key={index}
                index={index}
                labels={labels}
                item={item}
                onChange={handleChangeNewItem}
                removeElement={() => handleRemoveNewItem(index)}
                domain={gridConfig.uiCommerceServiceDomain}
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
        {!enableErrorMessage && (
          <p className="edit-quantities">
            {getDictionaryValueOrKey(labels?.editQuantities)}
          </p>
        )}
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
        {enableErrorMessage && (
          <ErrorMessage labels={labels} enableAddLine={enableAddLine} />
        )}
      </section>
    </BaseFlyout>
  );
}

export default OrderModificationFlyout;
