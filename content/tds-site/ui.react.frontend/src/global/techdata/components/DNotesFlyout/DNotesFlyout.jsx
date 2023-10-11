import React, { useState, useEffect } from 'react';
import BaseFlyout from '../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import FlyoutTable from '../FlyoutTable/FlyoutTable';
import useTableFlyout from '../../hooks/useTableFlyout';
import { usGet } from '../../../../utils/api';

function DNotesFlyout({
  store,
  gridConfig,
  dNotesFlyout = {},
  dNoteColumnList,
  subheaderReference,
  isTDSynnex,
  downloadAllFile,
  openFilePdf,
}) {
  const dNoteFlyoutConfig = store((st) => st.dNotesFlyout);
  const effects = store((st) => st.effects);
  const [selected, setSelected] = useState([]);
  const [deliveryNotesResponse, setDeliveryNotesResponse] = useState(null);
  const closeFlyout = () => {
    setDeliveryNotesResponse(null);
    effects.setCustomState({
      key: 'dNotesFlyout',
      value: { data: null, show: false },
    });
    setSelected([]);
  };
  const columnList = dNoteColumnList;
  const copiedDNoteFlyoutConfig = {
    ...dNoteFlyoutConfig,
    data: deliveryNotesResponse,
  };
  const config = deliveryNotesResponse
    ? copiedDNoteFlyoutConfig
    : dNoteFlyoutConfig;
  const {
    rows,
    headCells,
    handleClick,
    handleSelectAllClick,
    SecondaryButton,
  } = useTableFlyout({ selected, setSelected, columnList, config });
  const getDeliveryNotes = async () => {
    try {
      const result = await usGet(
        `${gridConfig?.getDeliveryNotesEndPoint}?id=${dNoteFlyoutConfig?.id}`
      );
      return result;
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleDownload = () => {
    if (selected.length === 1) {
      return openFilePdf('DNote', config?.id, selected);
    } else if (selected.length > 1) {
      return downloadAllFile('DNote', config?.id, selected);
    }
  };

  const allParametersHaveValue =
    Array.isArray(rows) &&
    rows.length > 0 &&
    rows.every((item) => item.id && item.dateFormatted);

  useEffect(() => {
    dNoteFlyoutConfig?.id &&
      !allParametersHaveValue &&
      getDeliveryNotes()
        .then((result) => {
          setDeliveryNotesResponse(result?.data?.content);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  }, [dNoteFlyoutConfig?.id, allParametersHaveValue]);

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
      disabledButton={selected.length === 0}
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
            dataTable={allParametersHaveValue ? rows : deliveryNotesResponse}
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
