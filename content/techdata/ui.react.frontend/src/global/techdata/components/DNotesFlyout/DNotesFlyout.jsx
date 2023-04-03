import React from 'react';
import BaseFlyout from '../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import FlyoutTable from '../FlyoutTable/FlyoutTable';

function DNotesFlyout({ 
  store, 
  dNotesFlyout, 
  subheaderReference,
}) {
  const dNoteFlyoutConfig = store((st) => st.dNotesFlyout);
  const effects = store((st) => st.effects);
  const closeFlyout = () => effects.setCustomState({ key: 'dNotesFlyout', value: { show: false } });

  const [selected, setSelected] = React.useState([]);
  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };
  const createData = (dataObj) => {
    return {
      ...dataObj
    };
  };
  const getRows = (config, ...headTags) => {
    if (!config?.data || !Array.isArray(config.data)) {
      return [];
    }
    return config.data
      .filter((e) => e && typeof e === 'object' && headTags.every((tag) => e.hasOwnProperty(tag)))
      .map((e) => createData(headTags.reduce((acc, tag) => ({...acc, [tag]: e[tag]}), {})));
  };
  const headTags = dNotesFlyout.dNoteColumnList.map((e) => e.columnKey);
  const rows = getRows(dNoteFlyoutConfig, ...headTags);
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n[headTags[0]]);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const SecondaryButton = (selectedParam, secondaryParam) => {
    if(selectedParam.length > 0) { 
    
    return (
    <button
      className='cmp-flyout__footer-button--secondary'
      onClick={handleSelectAllClick}
    >
      {getDictionaryValueOrKey(secondaryParam)}
    </button>
    )
    }
    return null
  }

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
        <FlyoutTable 
          dataTable={rows}
          data={dNoteFlyoutConfig}
          dNotesFlyout={dNotesFlyout}
          selected={selected}
          handleClick={handleClick}
          handleSelectAllClick={handleSelectAllClick}
        />
      </section>
    </BaseFlyout>
  );
}

export default DNotesFlyout;
