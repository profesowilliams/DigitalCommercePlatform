import React, { useState, useEffect } from 'react';
import BaseFlyout from '../../../BaseFlyout/BaseFlyout';
import FlyoutTable from '../../../FlyoutTable/FlyoutTable';
import useTableFlyout from '../../../../hooks/useTableFlyout';
import { usGet } from '../../../../../../utils/api';
import ToolTip from '../../../BaseGrid/ToolTip';
import { useOrderTrackingStore } from '../../Store/OrderTrackingStore';

function InvoicesFlyout({
  gridConfig,
  invoicesColumnList: columnList,
  subheaderReference,
  isTDSynnex,
  downloadAllFile,
  openFilePdf,
}) {
  const invoicesFlyoutConfig = useOrderTrackingStore((st) => st.invoicesFlyout);
  const [showTooltip, setShowTooltip] = useState(false);
  const effects = useOrderTrackingStore((st) => st.effects);
  const [selected, setSelected] = useState([]);
  const [invoicesResponse, setInvoicesResponse] = useState(null);
  const uiTranslations = useOrderTrackingStore(
    (state) => state.uiTranslations
  );
  const translations = uiTranslations?.['OrderTracking.MainGrid.InvoicesFlyout'];

  const closeFlyout = () => {
    effects.setCustomState({
      key: 'invoicesFlyout',
      value: { data: null, show: false },
    });
    setSelected([]);
  };

  const config = {
    ...invoicesFlyoutConfig,
    data: invoicesFlyoutConfig?.data || invoicesResponse,
  };

  const {
    rows,
    headCells,
    handleClick,
    handleSelectAllClick,
    SecondaryButton,
  } = useTableFlyout({ selected, setSelected, columnList, config });
  const getInvoices = async () => {
    try {
      const result = await usGet(
        `${gridConfig.uiCommerceServiceDomain}/v3/order/${invoicesFlyoutConfig?.id}/invoices`
      );
      return result;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDownload = () => {
    closeFlyout();
    if (selected.length === 1) {
      return openFilePdf('Invoice', config?.id, selected);
    } else if (selected.length > 1) {
      return downloadAllFile('Invoice', config?.id, selected);
    }
  };

  const handleSingleDownload = (clickedId) => {
    openFilePdf('Invoice', config?.id, clickedId);
  };

  const handleCheckboxEnabled = (row) => {
    return row.canDownloadDocument;
  };

  const checkboxEnabled = () => {
    return rows.filter((n) => n.canDownloadDocument).length > 0;
  };

  useEffect(() => {
    setInvoicesResponse(null);
    !invoicesFlyoutConfig?.data &&
      invoicesFlyoutConfig?.id &&
      getInvoices()
        .then((result) => {
          setInvoicesResponse(result?.data?.content);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  }, [invoicesFlyoutConfig?.id]);

  return (
    <BaseFlyout
      open={invoicesFlyoutConfig?.show}
      onClose={closeFlyout}
      width="360px"
      anchor="right"
      subheaderReference={subheaderReference}
      titleLabel={translations?.Title}
      buttonLabel={translations?.Button_Download}
      secondaryButtonLabel={translations?.Button_ClearAll}
      disabledButton={selected.length === 0}
      selected={selected}
      secondaryButton={SecondaryButton}
      isTDSynnex={true}
      onClickButton={handleDownload}
    >
      <section className="cmp-flyout__content">
        <div className="cmp-flyout__content-description">
          <div className="cmp-flyout__content__contentGrid">
            <span className="cmp-flyout__content-bold">
              {translations?.Description_OrderNo}
              {'  '}
            </span>
            <span>{invoicesFlyoutConfig?.id}</span>
          </div>
          <div
            className="cmp-flyout__content__contentGrid"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <span className="cmp-flyout__content-bold">
              {translations?.Description_PONo}
              {'  '}
            </span>
            <span className="cmp-flyout__content-description--ellipsis">
              {invoicesFlyoutConfig?.reseller}
            </span>
          </div>
          <ToolTip
            toolTipData={{
              show: showTooltip,
              y: null,
              x: null,
              value: invoicesFlyoutConfig?.reseller,
            }}
          />
        </div>
        <div className="cmp-flyout__content-description">
          {translations?.Description}
        </div>
        {columnList && (
          <FlyoutTable
            dataTable={rows}
            selected={selected}
            handleSingleDownload={handleSingleDownload}
            handleClick={handleClick}
            handleCheckboxEnabled={handleCheckboxEnabled}
            handleSelectAllClick={handleSelectAllClick}
            headCells={headCells}
            checkboxEnabled={checkboxEnabled}
            translations={translations}
          />
        )}
      </section>
    </BaseFlyout>
  );
}

export default InvoicesFlyout;