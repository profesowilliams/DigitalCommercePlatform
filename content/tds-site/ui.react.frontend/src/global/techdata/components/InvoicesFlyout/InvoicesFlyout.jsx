import React from 'react';
import BaseFlyout from '../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import FlyoutTable from '../FlyoutTable/FlyoutTable';
import useTableFlyout from '../../hooks/useTableFlyout';

function InvoicesFlyout({
  store,
  invoicesFlyout,
  invoicesColumnList,
  subheaderReference,
  isTDSynnex,
  downloadAllFile,
  openFilePdf,
  hasAIORights,
}) {
  const invoicesFlyoutConfig = store((st) => st.invoicesFlyout);
  const effects = store((st) => st.effects);
  const closeFlyout = () =>
    effects.setCustomState({ key: 'invoicesFlyout', value: { show: false } });
  const columnList = invoicesColumnList;
  const config = invoicesFlyoutConfig;
  const [selected, setSelected] = React.useState([]);
  const {
    rows,
    headCells,
    handleClick,
    handleSelectAllClick,
    SecondaryButton,
  } = useTableFlyout({ selected, setSelected, columnList, config });

  const handleDownload = () => {
    if (selected.length === 1) {
      return openFilePdf('Invoice', selected);
    } else if (selected.length > 1) {
      return downloadAllFile('Invoice', selected);
    }
  };
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
            dataTable={rows}
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
