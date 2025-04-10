import React from 'react';
import BaseFlyout from '../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import FlyoutTable from '../FlyoutTable/FlyoutTable';
import useTableFlyout from '../../hooks/useTableFlyout';

function DNotesFlyout({
  store,
  dNotesFlyout,
  dNoteColumnList,
  subheaderReference,
  isTDSynnex,
  downloadAllFile,
  openFilePdf,
}) {
  const dNoteFlyoutConfig = store((st) => st.dNotesFlyout);
  const effects = store((st) => st.effects);
  const closeFlyout = () =>
    effects.setCustomState({ key: 'dNotesFlyout', value: { show: false } });
  const columnList = dNoteColumnList;
  const config = dNoteFlyoutConfig;
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
      open={dNoteFlyoutConfig?.show}
      onClose={closeFlyout}
      width="425px"
      anchor="right"
      subheaderReference={subheaderReference}
      titleLabel={dNotesFlyout.title || 'D-notes'}
      buttonLabel={dNotesFlyout.button || 'Download selected'}
      secondaryButtonLabel={dNotesFlyout.clearAllButton || 'Clear all'}
      disabledButton={!selected}
      selected={selected}
      secondaryButton={SecondaryButton}
      isTDSynnex={isTDSynnex}
      onClickButton={handleDownload}
    >
      <section className="cmp-flyout__content">
        <div className="cmp-flyout__content-description">
          <div className="cmp-flyout__content__contentGrid">
            <span className="cmp-flyout__content-bold">
              {getDictionaryValueOrKey(dNotesFlyout.orderNo)}
              {'  '}
            </span>
            <span>{dNoteFlyoutConfig?.id}</span>
          </div>
          <div className="cmp-flyout__content__contentGrid">
            <span className="cmp-flyout__content-bold">
              {getDictionaryValueOrKey(dNotesFlyout.poNo)}
              {'  '}
            </span>
            <span className="cmp-flyout__content-description--ellipsis">
              {dNoteFlyoutConfig?.reseller}
            </span>
          </div>
        </div>
        <div className="cmp-flyout__content-description">
          {getDictionaryValueOrKey(dNotesFlyout.description)}
        </div>
        {columnList && (
          <FlyoutTable
            dataTable={rows}
            selected={selected}
            handleClick={handleClick}
            handleSelectAllClick={handleSelectAllClick}
            headCells={headCells}
            checkboxEnabled={true}
          />
        )}
      </section>
    </BaseFlyout>
  );
}

export default DNotesFlyout;
