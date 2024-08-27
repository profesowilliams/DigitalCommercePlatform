import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { Button } from '@mui/material';
import sanitizeHtml from 'sanitize-html';
import PlaceOrderDialog from '../../RenewalsGrid/Orders/PlaceOrderDialog';
import PlaceAdobeOrderDialog from '../../RenewalsGrid/Orders/PlaceAdobeOrderDialog';
import Grid from '../../Grid/Grid';
import Modal from '../../Modal/Modal';
import RenewalProductLinesItemInformation, {
  getItemInformation,
} from './RenewalProductLinesItemInformation';
import RenewalManufacturer, {
  getRenewalManufacturer,
} from './RenewalManufacturer';
import { thousandSeparator } from '../../../helpers/formatting';
import QuantityColumn from '../Columns/QuantityColumn.jsx';
import buildColumnDefinitions from './buildColumnDefinitions';
import UnitPriceColumn from '../Columns/UnitPriceColumn';
import TransactionNumber from '../../RenewalsGrid/Orders/TransactionNumber';
import { suppressNavigation } from './supressAgGridKeyboardEvents';
import {
  mapRenewalForUpdateDetails,
  mapRenewalItemProducts,
} from '../../RenewalsGrid/Orders/orderingRequests';
import { useRenewalsDetailsStore } from '../store/RenewalsDetailsStore';
import Toaster from '../../Widgets/Toaster';
import { TOASTER_LOCAL_STORAGE_KEY } from '../../../../../utils/constants';
import useIsIconEnabled from '../../RenewalsGrid/Orders/hooks/useIsIconEnabled';
import {
  copyToClipboardAction,
  getContextMenuItems,
  setLocalStorageData,
} from '../../RenewalsGrid/utils/renewalUtils';
import useComputeBranding from '../../../hooks/useComputeBranding';
import { getDictionaryValue } from '../../../../../utils/utils';

function GridSubTotal({ subtotal, data, gridProps, compProps, adobeVendor }) {
  const migrationQuoteType = data?.quoteType === 'Migration';
  const renewalQuoteType = data?.quoteType === 'Renewal';
  const autoRenewQuoteType = data?.quoteType === 'AutoRenew';
  const isRequestQuoteFlag =
    data?.canRequestQuote && compProps?.enableRequestQuote;
  return (
    <div className="cmp-renewal-preview__subtotal">
      {migrationQuoteType && adobeVendor ? (
        <div className="cmp-renewal-preview__subtotal--note">
          {getDictionaryValue(
            'details.renewal.label.migrationNote',
            'Note: Pricing displayed is subject to vendor price changes and exchange rate fluctuations. Adobe: price displayed in migration quotes is for reference purpose only. VIP and VIP MP Renewals pricing will differ.'
          )}
        </div>
      ) : (renewalQuoteType || autoRenewQuoteType) && adobeVendor ? (
        <div className="cmp-renewal-preview__subtotal--note">
          {getDictionaryValue(
            'details.renewal.label.adobeNote',
            'Please note that pricing is subject to change and is only valid in the same calendar month that this quote has been supplied. The vendor retains rights to implement pricing changes at the start of each month.'
          )}
        </div>
      ) : (
        <div
          className="cmp-renewal-preview__subtotal--note"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(gridProps?.note),
          }}
        ></div>
      )}
      <div className="cmp-renewal-preview__subtotal--price-note">
        <b className="cmp-renewal-preview__subtotal--description">
          {getDictionaryValue(
            'details.renewal.label.subtotal',
            'Quote Subtotal'
          )}
        </b>
        <span className="cmp-renewal-preview__subtotal--value">
          <span className="cmp-renewal-preview__subtotal--currency-symbol">
            {gridProps?.quoteSubtotalCurrencySymbol || ''}
          </span>
          <span>
            {isRequestQuoteFlag
              ? '-'
              : thousandSeparator(subtotal || data?.price)}
          </span>
          {gridProps?.quoteSubtotalCurrency?.length > 0 && (
            <span className="cmp-renewal-preview__subtotal--currency-code">
              {isRequestQuoteFlag
                ? ''
                : gridProps.quoteSubtotalCurrency?.replace(
                    '{currency-code}',
                    data?.currency || ''
                  )}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

function Price({ value }, data, compProps) {
  const isRequestQuoteFlag =
    data?.canRequestQuote && compProps?.enableRequestQuote;
  return (
    <div className="price">
      {isRequestQuoteFlag ? '-' : thousandSeparator(value)}
    </div>
  );
}

function RenewalPreviewGrid(
  { data, gridProps, shopDomainPage, isEditing, compProps, isActiveLicense, activeLicenseEdit, getUpdatedMutableGrid },
  ref
) {
  const [modal, setModal] = useState(null);
  const [multipleFlag, setMultipleFlag] = useState(false);
  const [isPODialogOpen, setIsPODialogOpen] = useState(false);
  const [isPAODialogOpen, setIsPAODialogOpen] = useState(false);
  const [PONumber, setPONumber] = useState('');

  const orderEndpoints = {
    updateRenewalOrderEndpoint: compProps.updateRenewalOrderEndpoint,
    getStatusEndpoint: compProps.getStatusEndpoint,
    orderRenewalEndpoint: compProps.orderRenewalEndpoint,
  };
  const { computeClassName } = useComputeBranding(useRenewalsDetailsStore);
  const [subtotal, setSubtotal] = useState(null);
  const [orderButtonLabel, setOrderButtonLabel] = useState(
    gridProps?.orderButtonLabel
  );
  const gridData = isActiveLicense ? data.itemsActive : data.items;
  const adobeVendor = data?.vendor?.name === 'Adobe';
  const orignalGridData = JSON.parse(JSON.stringify(gridData));
  const dataObj = data;
  const gridConfig = {
    ...gridProps,
    serverSide: false,
    paginationStyle: 'none',
    searchResultsError: compProps.searchResultsError,
  };

  const isRequestQuoteFlag =
    data?.canRequestQuote && compProps?.enableRequestQuote;
  const effects = useRenewalsDetailsStore((state) => state.effects);
  const { closeAndCleanToaster } = effects;
  const isEditingDetails = useRenewalsDetailsStore(
    (state) => state.isEditingDetails
  );
  const gridSavedItems = useRenewalsDetailsStore((state) => state.savedItems);

  // Keep track of isEditing on rerenders, will be used by quantity cell on redraw
  const isEditingRef = useRef(isEditing);

  // Get gridApi, save also as ref to be used on imperative handle
  const [gridApi, setGridApi] = useState(null);
  const gridApiRef = useRef(null);
  const isIconEnabled =
    useIsIconEnabled(
      data?.firstAvailableOrderDate,
      data?.canOrder,
      compProps?.orderingFromDashboard?.showOrderingIcon
    ) && !isRequestQuoteFlag;
    const [orderIconDisable, setOrderIconDisable] = useState(!isIconEnabled);

  function onAfterGridInit({ api }) {
    setGridApi(api);
    gridApiRef.current = api;
  }

  useEffect(() => {
    setOrderButtonLabel(
      isEditingDetails
        ? gridProps?.saveAndOrderButtonLabel
        : gridProps?.orderButtonLabel
    );
  }, [isEditingDetails]);

  // On isEditing prop change, update ref and refresh the cell
  useEffect(() => {
    isEditingRef.current = isEditing;
    if (gridApi) {
      gridApi.refreshCells({
        columns: ['quantity', 'unitPrice'],
        force: true,
      });
    }
  }, [isEditing]);

  useEffect(() => {
    if (gridApiRef.current) {
        getUpdatedMutableGrid(orignalGridData);
        gridApiRef.current.setRowData(orignalGridData);
    }
  }, [data]);

  useEffect(() => {
    if (isEditing) {
      effects.setCustomState({
        key: 'items',
        value: mapRenewalItemProducts(mutableGridData),
      });
    } else {
      effects.clearItems();
    }
  }, [subtotal]);

  useImperativeHandle(
    ref,
    () => ({
      cancelEdit() {
        // Copy original grid data
        /* let copyGridData = JSON.parse(JSON.stringify(gridData));
      if (gridSavedItems) {
        copyGridData.map((item, index) => {
          item.id = gridSavedItems[index].id;
          item.quantity = gridSavedItems[index].quantity;
          item.unitPrice = gridSavedItems[index].unitPrice;
        })*/
        orignalGridData.forEach((item, index) => {
          resultArray.map((resultItem, resultIndex) => {
            if (
              resultItem.id == item.id &&
              resultItem.instance == item.instance
            ) {
              resultItem.id = item.id;
              resultItem.quantity = item.quantity;
              resultItem.unitPrice = item.unitPrice;
            }
          });
        });
        // Replace grid data with original
        setMutableGridData(resultArray);
        effects.clearItems();

        // Api call needed to refresh grid
        if (gridApiRef.current) {
          gridApiRef.current.setRowData(resultArray);
        }
      },
      getMutableGridData() {
        return mutableGridData;
      },
    }),
    [gridSavedItems]
  );
  const contractMap = new Map();
  let sortedGridData = gridData;
  if (gridData?.contract?.id) {
    sortedGridData = gridData.sort((a, b) => {
      const contractIdA = a.contract.id;
      const contractIdB = b.contract.id;
      return contractIdA - contractIdB;
    });
  }
  JSON.parse(JSON.stringify(sortedGridData))?.forEach((item) => {
    const contractId = item?.contract?.id;
    if (!contractMap.has(contractId)) {
      contractMap.set(contractId, []);
    }
    contractMap.get(contractId).push(item);
  });

  const resultArray = [];
  contractMap?.forEach((contractGroup, index) => {
    if (contractGroup.length >= 1 && contractMap?.size > 1) {
      let dueDateFlag = 0;
      let agreementDurationFlag = 0;
      let usagePeriodFlag = 0;
      let serviceLevelFlag = 0;
      contractGroup.forEach((val, i) => {
        serviceLevelFlag =
          contractGroup[0].contract.serviceLevel == val.contract.serviceLevel
            ? serviceLevelFlag + 1
            : serviceLevelFlag;
        dueDateFlag =
          contractGroup[0].contract.dueDate == val.contract.dueDate
            ? dueDateFlag + 1
            : dueDateFlag;
        agreementDurationFlag =
          contractGroup[0]?.contract?.agreementDuration ===
          val.contract.agreementDuration
            ? agreementDurationFlag + 1
            : agreementDurationFlag;
        usagePeriodFlag =
          contractGroup[0].contract.formattedUsagePeriod ===
          val.contract.formattedUsagePeriod
            ? usagePeriodFlag + 1
            : usagePeriodFlag;
      });
      contractGroup.forEach((val, i) => {
        contractGroup[i].serviceLevelFlag =
          serviceLevelFlag === contractGroup.length;
        contractGroup[i].dueDateFlag = dueDateFlag === contractGroup.length;
        contractGroup[i].agreementDurationFlag =
          agreementDurationFlag === contractGroup.length;
        contractGroup[i].usagePeriodFlag =
          usagePeriodFlag === contractGroup.length;
        if (isRequestQuoteFlag) {
          contractGroup[i].totalPrice = '-';
          contractGroup[i].unitCost = '-';
          contractGroup[i].unitListPrice = '-';
          contractGroup[i].unitPrice = '-';
          if (contractGroup[i]?.discounts) {
            contractGroup[i].discounts[0].value = '-';
          }
        }
      });
      const activeGridData = gridData.filter((data) => {
        return data.contract.id === index;
      });
      resultArray.push({
        ...activeGridData[0],
        totalPrice: 0,
        value: 0,
        unitPrice: 0,
        quantity: 0,
        section: 'big-title',
        serviceLevelFlag: serviceLevelFlag === contractGroup.length,
        dueDateFlag: dueDateFlag === contractGroup.length,
        agreementDurationFlag: agreementDurationFlag === contractGroup.length,
        usagePeriodFlag: usagePeriodFlag === contractGroup.length,
        serviceLevelHeaderFlag:
          data.quoteSupportLevel?.indexOf('see line') > -1,
        dueDateHeaderFlag: data.formattedDueDate?.indexOf('see line') > -1,
        agreementDurationHeaderFlag:
          data.agreementDuration?.indexOf('see line') > -1,
        usagePeriodHeaderFlag:
          data.formattedNewUsagePeriodEndDate?.indexOf('see line') > -1,
        id: `Agreement No:  ${index}`,
      });
    } else {
      contractGroup.forEach((val, i) => {
        if (isRequestQuoteFlag) {
          contractGroup[i].totalPrice = '-';
          contractGroup[i].unitCost = '-';
          contractGroup[i].unitListPrice = '-';
          contractGroup[i].unitPrice = '-';
          if (contractGroup[i]?.discounts) {
            contractGroup[i].discounts[0].value = '-';
          }
        }
      });
    }
    resultArray.push(...contractGroup);
  });
  const gridColumnWidths = Object.freeze({
    line: '29px',
    productFamily: '150px',
    productDescription: '368px',
    vendorPartNo: '220px',
    listPrice: '70px',
    percentageOfflist: '65px',
    unitPrice: '100px',
    quantity: '60px',
    total: '100px',
  });

  const columnDefinitionsOverride = [
    {
      field: 'id',
      headerName: gridProps?.line,
      width: gridColumnWidths.line,
      cellRenderer: ({ data }) => {
        if (contractMap.size > 1) {
          setMultipleFlag(true);
        }
        return !data?.id?.includes('Agreement') ? (
          data.id
        ) : (
          <div className="row-header">
            <div>
              <span>{data.id?.split(':')[0]}:</span> {data.id?.split(':')[1]}
            </div>
            {!compProps?.quotePreview?.agreementInfo
              ?.disableMultipleAgreement &&
              data.serviceLevelHeaderFlag &&
              data?.contract?.serviceLevel &&
              data.serviceLevelFlag && (
                <>
                  {' '}
                  |{' '}
                  <div>
                    <span>Support Level:</span> {data?.contract?.serviceLevel}
                  </div>
                </>
              )}
            {!compProps?.quotePreview?.agreementInfo
              ?.disableMultipleAgreement &&
              data.dueDateHeaderFlag &&
              data?.contract?.dueDate &&
              data.dueDateFlag && (
                <>
                  {' '}
                  |{' '}
                  <div>
                    <span>Due Date:</span>{' '}
                    {data?.contract?.dueDate?.split('T')[0]}
                  </div>
                </>
              )}
            {!compProps?.quotePreview?.agreementInfo
              ?.disableMultipleAgreement &&
              data.agreementDurationHeaderFlag &&
              data?.contract?.agreementDuration &&
              data?.contract?.endDate &&
              data.agreementDurationFlag && (
                <>
                  {' '}
                  |{' '}
                  <div>
                    <span>Duration:</span> {data?.contract?.agreementDuration}
                  </div>
                </>
              )}
            {!compProps?.quotePreview?.agreementInfo
              ?.disableMultipleAgreement &&
              data.usagePeriodHeaderFlag &&
              data?.contract?.formattedUsagePeriod &&
              data.usagePeriodFlag && (
                <>
                  {' '}
                  |{' '}
                  <div>
                    <span>Usage Period:</span>{' '}
                    {data?.contract?.formattedUsagePeriod}
                  </div>
                </>
              )}
          </div>
        );
      },
      headerClass: contractMap.size <= 1 ? 'contract-header' : 'normal-header',
    },
    {
      field: 'vendorPartNo',
      headerName: gridProps?.productfamily,
      // cellRenderer: (props) => Object.keys(props?.data).includes("contract") ? <div>{props?.data?.vendorPartNo}</div>: "",
      valueGetter: ({ data }) =>
        !data?.id?.includes('Agreement')
          ? data.product.find((p) => p.family)?.family ?? 'N/A'
          : '',
      width: gridColumnWidths.productFamily,
    },
    {
      field: 'shortDescription',
      headerName: gridProps?.productdescription,
      cellHeight: () => 80,
      cellRenderer: ({ data }) => {
        return !data?.id?.includes('Agreement') ? (
          <RenewalProductLinesItemInformation
            line={data}
            dataObj={dataObj}
            disableMultipleAgreement={
              !compProps?.quotePreview?.agreementInfo?.disableMultipleAgreement
            }
            lineDetailsLabels={compProps.lineItemDetailLabels}
            isLinkDisabled={gridProps.disableProductDetailsLink}
            shopDomainPage={shopDomainPage}
            invokeModal={invokeModal}
            isActiveLicense={isActiveLicense}
          />
        ) : (
          ''
        );
      },
      width: gridColumnWidths.productDescription,
    },
    {
      field: 'mfrNumber',
      headerName: gridProps?.vendorPartNo,
      cellRenderer: (props) =>
        !props?.data?.id?.includes('Agreement')
          ? RenewalManufacturer(props)
          : '',
      width: gridColumnWidths.vendorPartNo,
    },
    {
      field: 'unitListPrice',
      headerName: isActiveLicense
        ? ''
        : gridProps.listPrice?.replace('{currency-code}', data?.currency || ''),
      cellRenderer: (props) => {
        return !props?.data?.id?.includes('Agreement') && !isActiveLicense
          ? Price(props, data, compProps)
          : '';
      },
      width: gridColumnWidths.listPrice,
    },
    {
      field: 'value',
      headerName: isActiveLicense ? '' : gridProps?.percentOffListPrice,
      valueGetter: ({ data }) => data.discounts && data.discounts[0]?.value,
      cellRenderer: (props) =>
        !props?.data?.id?.includes('Agreement') && !isActiveLicense
          ? Price(props, data, compProps)
          : '',
      width: gridColumnWidths.percentageOfflist,
    },
    {
      field: 'unitPrice',
      headerName: isActiveLicense
        ? ''
        : gridProps.unitPrice?.replace('{currency-code}', data?.currency || ''),
      suppressKeyboardEvent: (params) => suppressNavigation(params),
      cellRenderer: (props) => {
        const isEditing = isEditingRef.current && data?.canEditResellerPrice;
        return !props?.data?.id?.includes('Agreement') && !isActiveLicense
          ? UnitPriceColumn({ ...props, isEditing })
          : '';
      },
      width: gridColumnWidths.unitPrice,
    },
    {
      field: 'quantity',
      headerName: gridProps?.quantity,
      cellRenderer: (props) => {
        const isEditing = isEditingRef.current && data?.canEditQty;
        const dataObj = data;
        return !props?.data?.id?.includes('Agreement')
          ? QuantityColumn({ ...props, isEditing, activeLicenseEdit, dataObj })
          : '';
      },
      width: gridColumnWidths.quantity,
    },
    {
      field: 'totalPrice',
      headerName: isActiveLicense
        ? ''
        : gridProps.totalPrice?.replace(
            '{currency-code}',
            data?.currency || ''
          ),
      cellRenderer: (props) =>
        !props?.data?.id?.includes('Agreement') && !isActiveLicense
          ? Price(props, data, compProps)
          : '',
      valueGetter: 'data.quantity * data.unitPrice',
      // Use sum aggFunc to also update subtotal value.
      // Function is triggered on internal grid updates.
      aggFunc: (params, props) => {
        let total = 0;
        params.values.forEach((value) => (total += value));
        setSubtotal(total);
        return total;
      },
      width: gridColumnWidths.total,
    },
  ];

  const columnDefs = useMemo(
    () => buildColumnDefinitions(columnDefinitionsOverride),
    []
  );

  /*
    mutableGridData is copied version of response that can be safely mutated,
    original state is preserved in gridData.
  */

  const [mutableGridData, setMutableGridData] = useState(resultArray);

  function invokeModal(modal) {
    setModal(modal);
  }
  const onOrderButtonClicked = () => {
    effects.setCustomState({ key: 'toaster', value: { isOpen: false } });
    setIsPODialogOpen(true);
    setIsPAODialogOpen(true);
    setOrderIconDisable(true);
  };

  const successToaster = {
    isOpen: true,
    origin: 'fromUpdate',
    isAutoClose: true,
    isSuccess: true,
    message: `${getDictionaryValue(
      'details.renewal.label.yourOrderFor',
      'Your order for'
    )} ${PONumber} ${getDictionaryValue(
      'details.renewal.label.hasBeenSuccessfullySubmittedForProcessing',
      'has been successfully submitted for processing.'
    )}`,
  };
  const onCloseOrderDialog = (options = {}) => {
    const { isSuccess = false, toaster } = options || {
      isSuccess: false,
      toaster: false,
    };
    setIsPODialogOpen(false);
    setIsPAODialogOpen(false);
    if (!isSuccess)
        return;

    if (isSuccess) {
      if (adobeVendor) {
        effects.setCustomState({
          key: 'toaster',
          value: { ...successToaster },
        });
        setTimeout(() => (location.href = window.location.href), 6000);
      } else {
        setLocalStorageData(TOASTER_LOCAL_STORAGE_KEY, toaster);
        location.href = compProps.quotePreview.renewalsUrl;
      }
    } else if (!options?.toaster?.isSuccess) {
        setOrderIconDisable(false);
    }
  };

  const getDefaultCopyValue = (params) => {
    const colId = params?.column?.colId;
    const nodeData = params?.node?.data;

    switch (colId) {
      case 'mfrNumber':
        return getRenewalManufacturer(nodeData);
      case 'shortDescription':
        return getItemInformation(nodeData);
      default:
        return '';
    }
  };

  const contextMenuItems = (params) =>
    getContextMenuItems(params, compProps.productLines);
  const processCustomClipboardAction = (params) =>
    copyToClipboardAction(params);
  return (
    <div
      className={
        multipleFlag
          ? 'cmp-product-lines-grid cmp-renewals-details renewals-has-multiple'
          : 'cmp-product-lines-grid cmp-renewals-details'
      }
    >
      <section>
        <Grid
          onAfterGridInit={onAfterGridInit}
          columnDefinition={columnDefs}
          config={gridConfig}
          data={resultArray}
          getDefaultCopyValue={getDefaultCopyValue}
          contextMenuItems={contextMenuItems}
          processCustomClipboardAction={processCustomClipboardAction}
        />
        {/* <AgGridReact
          rowData={mutableGridData}
          columnDefs={columnDefs}

        /> */}
        {!isActiveLicense && resultArray?.length > 0 ? (
          <>
            <GridSubTotal
              data={data}
              gridProps={gridProps}
              subtotal={subtotal}
              compProps={compProps}
              adobeVendor={adobeVendor}
            />
            <div className="place-cmp-order-dialog-container">
              <p className="cmp-place-order-actions">
                <Button
                  disabled={orderIconDisable}
                  className={computeClassName('cmp-detail-order-button')}
                  onClick={onOrderButtonClicked}
                  variant="contained"
                >
                  {getDictionaryValue('button.common.label.order', 'Order')}
                </Button>
              </p>
            </div>
          </>
        ) : null}
      </section>
      {modal && (
        <Modal
          modalAction={modal.action}
          modalContent={modal.content}
          modalProperties={modal.properties}
          actionErrorMessage={modal.errorMessage}
          onModalClosed={() => setModal(null)}
        ></Modal>
      )}
      {adobeVendor ? (
        <PlaceAdobeOrderDialog
          onClose={onCloseOrderDialog}
          isDialogOpen={isPAODialogOpen}
          orderingFromDashboard={compProps.orderingFromDashboard}
          orderEndpoints={orderEndpoints}
          closeOnBackdropClick={false}
          ToasterDataVerification={({ data }) =>
            data ? TransactionNumber(data) : null
          }
          renewalData={mapRenewalForUpdateDetails(data)}
          store={useRenewalsDetailsStore}
          isDetails={true}
          setPONumber={setPONumber}
        />
      ) : (
        <PlaceOrderDialog
          onClose={onCloseOrderDialog}
          isDialogOpen={isPODialogOpen}
          orderingFromDashboard={compProps.orderingFromDashboard}
          orderEndpoints={orderEndpoints}
          closeOnBackdropClick={false}
          ToasterDataVerification={({ data }) =>
            data ? TransactionNumber(data) : null
          }
          renewalData={mapRenewalForUpdateDetails(data)}
          store={useRenewalsDetailsStore}
          isDetails={true}
        />
      )}
      <Toaster
        onClose={() => closeAndCleanToaster()}
        store={useRenewalsDetailsStore}
        message={{
          successSubmission: 'successSubmission',
          failedSubmission: 'failedSubmission',
        }}
        closeEnabled
      />
    </div>
  );
}

export default forwardRef(RenewalPreviewGrid);
