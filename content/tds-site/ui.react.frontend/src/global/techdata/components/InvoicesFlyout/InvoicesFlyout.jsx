import React, { useState, useEffect } from 'react';
import BaseFlyout from '../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import FlyoutTable from '../FlyoutTable/FlyoutTable';
import useTableFlyout from '../../hooks/useTableFlyout';
import { usGet } from '../../../../utils/api';

function InvoicesFlyout({
  store,
  gridConfig,
  invoicesFlyout = {},
  invoicesColumnList,
  subheaderReference,
  isTDSynnex,
  downloadAllFile,
  openFilePdf,
  hasAIORights,
}) {
  const invoicesFlyoutConfig = store((st) => st.invoicesFlyout);
  const effects = store((st) => st.effects);
  const [selected, setSelected] = useState([]);
  const [invoicesResponse, setInvoicesResponse] = useState(null);
  const closeFlyout = () => {
    setInvoicesResponse(null);
    effects.setCustomState({
      key: 'invoicesFlyout',
      value: { data: null, show: false },
    });
    setSelected([]);
  };
  const columnList = invoicesColumnList;
  const copiedInvoicesFlyoutConfig = {
    ...invoicesFlyoutConfig,
    data: invoicesResponse,
  };
  const config = invoicesResponse
    ? copiedInvoicesFlyoutConfig
    : invoicesFlyoutConfig;
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
        `${gridConfig?.getInvoicesEndPoint}?id=${invoicesFlyoutConfig?.id}`
      );
      return result;
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleDownload = () => {
    if (selected.length === 1) {
      return openFilePdf('Invoice', config?.id, selected);
    } else if (selected.length > 1) {
      return downloadAllFile('Invoice', config?.id, selected);
    }
  };

  const allParametersHaveValue =
    Array.isArray(rows) &&
    rows.length > 0 &&
    rows.every((item) => item.id && item.dateFormatted);

  useEffect(() => {
    invoicesFlyoutConfig?.id &&
      !allParametersHaveValue &&
      getInvoices()
        .then((result) => {
          setInvoicesResponse(result?.data?.content);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  }, [invoicesFlyoutConfig?.id, allParametersHaveValue]);

  return (
    <BaseFlyout
      open={invoicesFlyoutConfig?.show}
      onClose={closeFlyout}
      width="425px"
      anchor="right"
      subheaderReference={subheaderReference}
      titleLabel={invoicesFlyout.title || 'Invoices'}
      buttonLabel={invoicesFlyout.button || 'Download selected'}
      secondaryButtonLabel={invoicesFlyout.clearAllButton || 'Clear all'}
      disabledButton={selected.length === 0}
      selected={selected}
      secondaryButton={SecondaryButton}
      isTDSynnex={isTDSynnex}
      onClickButton={hasAIORights ? handleDownload : undefined}
    >
      <section className="cmp-flyout__content">
        <div className="cmp-flyout__content-description">
          <div className="cmp-flyout__content__contentGrid">
            <span className="cmp-flyout__content-bold">
              {getDictionaryValueOrKey(invoicesFlyout.orderNo)}
              {'  '}
            </span>
            <span>{invoicesFlyoutConfig?.id}</span>
          </div>
          <div className="cmp-flyout__content__contentGrid">
            <span className="cmp-flyout__content-bold">
              {getDictionaryValueOrKey(invoicesFlyout.poNo)}
              {'  '}
            </span>
            <span className="cmp-flyout__content-description--ellipsis">
              {invoicesFlyoutConfig?.reseller}
            </span>
          </div>
        </div>
        <div className="cmp-flyout__content-description">
          {getDictionaryValueOrKey(invoicesFlyout.description)}
        </div>
        {columnList && (
          <FlyoutTable
            dataTable={allParametersHaveValue ? rows : invoicesResponse}
            selected={selected}
            handleClick={handleClick}
            handleSelectAllClick={handleSelectAllClick}
            headCells={headCells}
            checkboxEnabled={hasAIORights}
          />
        )}
      </section>
    </BaseFlyout>
  );
}

export default InvoicesFlyout;
