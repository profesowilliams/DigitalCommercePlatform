import React, { useState, useEffect } from 'react';
import BaseFlyout from '../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import FlyoutTable from '../FlyoutTable/FlyoutTable';
import useTableFlyout from '../../hooks/useTableFlyout';
import { usGet } from '../../../../utils/api';
import ToolTip from '../BaseGrid/ToolTip';
import { useOrderTrackingStore } from '../OrdersTrackingGrid/store/OrderTrackingStore';

function DNotesFlyout({
  gridConfig,
  dNotesFlyout = {},
  dNoteColumnList: columnList,
  subheaderReference,
  isTDSynnex,
  downloadAllFile,
  openFilePdf,
}) {
  const dNoteFlyoutConfig = useOrderTrackingStore((st) => st.dNotesFlyout);
  const effects = useOrderTrackingStore((st) => st.effects);
  const [showTooltip, setShowTooltip] = useState(false);
  const [selected, setSelected] = useState([]);
  const [deliveryNotesResponse, setDeliveryNotesResponse] = useState(null);
  const closeFlyout = () => {
    effects.setCustomState({
      key: 'dNotesFlyout',
      value: { data: null, show: false },
    });
    setSelected([]);
  };

  const config = {
    ...dNoteFlyoutConfig,
    data: dNoteFlyoutConfig?.data || deliveryNotesResponse,
  };

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
        `${gridConfig.uiCommerceServiceDomain}/v3/order/${dNoteFlyoutConfig?.id}/deliverynotes`
      );
      return result;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDownload = () => {
    closeFlyout();
    if (selected.length === 1) {
      return openFilePdf('DNote', config?.id, selected);
    } else if (selected.length > 1) {
      return downloadAllFile('DNote', config?.id, selected);
    }
  };

  const handleSingleDownload = (clickedId) => {
    openFilePdf('DNote', config?.id, clickedId);
  };

  const handleCheckboxEnabled = (row) => {
    return row.canDownloadDocument;
  };

  const checkboxEnabled = () => {
    return rows.filter((n) => n.canDownloadDocument).length > 0;
  };

  useEffect(() => {
    setDeliveryNotesResponse(null);
    !dNoteFlyoutConfig?.data &&
      dNoteFlyoutConfig?.id &&
      getDeliveryNotes()
        .then((result) => {
          setDeliveryNotesResponse(result?.data?.content);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  }, [dNoteFlyoutConfig?.id]);

  return (
    <BaseFlyout
      open={dNoteFlyoutConfig?.show}
      onClose={closeFlyout}
      width="425px"
      anchor="right"
      subheaderReference={subheaderReference}
      titleLabel={getDictionaryValueOrKey(dNotesFlyout.title || 'D-notes')}
      buttonLabel={getDictionaryValueOrKey(
        dNotesFlyout.button || 'Download selected'
      )}
      secondaryButtonLabel={getDictionaryValueOrKey(
        dNotesFlyout.clearAllButton || 'Clear all'
      )}
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
          <div
            className="cmp-flyout__content__contentGrid"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <span className="cmp-flyout__content-bold">
              {getDictionaryValueOrKey(dNotesFlyout.poNo)}
              {'  '}
            </span>
            <span className="cmp-flyout__content-description--ellipsis">
              {dNoteFlyoutConfig?.reseller}
            </span>
          </div>
        </div>
        <ToolTip
          toolTipData={{
            show: showTooltip,
            y: null,
            x: null,
            value: dNoteFlyoutConfig?.reseller,
          }}
        />
        <div className="cmp-flyout__content-description">
          {getDictionaryValueOrKey(dNotesFlyout.description)}
        </div>
        {columnList && (
          <FlyoutTable
            dataTable={rows}
            selected={selected}
            handleClick={handleClick}
            handleCheckboxEnabled={handleCheckboxEnabled}
            handleSingleDownload={handleSingleDownload}
            handleSelectAllClick={handleSelectAllClick}
            headCells={headCells}
            checkboxEnabled={checkboxEnabled}
          />
        )}
      </section>
    </BaseFlyout>
  );
}

export default DNotesFlyout;
