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
      enableButton={selected.length > 0}
      disabledButton={!selected}
      selected={selected}
      secondaryButton={SecondaryButton}
      isTDSynnex={isTDSynnex}
    >
      <section className="cmp-flyout__content">
        <div className="cmp-flyout__content-description">
          <span className="cmp-flyout__content-bold">
            {getDictionaryValueOrKey(dNotesFlyout.orderNo)}
            {'  '}
          </span>
          {dNoteFlyoutConfig?.id}
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
          />
        )}
      </section>
    </BaseFlyout>
  );
}

export default DNotesFlyout;
