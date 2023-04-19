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
      enableButton={selected.length > 0}
      disabledButton={!selected}
      selected={selected}
      secondaryButton={SecondaryButton}
      isTDSynnex={isTDSynnex}
    >
      <section className="cmp-flyout__content">
        <div className="cmp-flyout__content-description">
          <span className="cmp-flyout__content-bold">
            {getDictionaryValueOrKey(invoicesFlyout.orderNo)}
            {'  '}
          </span>
          {invoicesFlyoutConfig?.id}
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
          />
        )}
      </section>
    </BaseFlyout>
  );
}

export default InvoicesFlyout;
