import React, { useState, useEffect } from 'react';
import BaseFlyout from '../../../BaseFlyout/BaseFlyout';
import FlyoutTable from '../../../FlyoutTable/FlyoutTable';
import useTableFlyout from '../../../../hooks/useTableFlyout';
import { usGet } from '../../../../../../utils/api';
import ToolTip from '../../../BaseGrid/ToolTip';
import { useOrderTrackingStore } from '../../Store/OrderTrackingStore';

/**
 * DNotesFlyout component that handles displaying and downloading delivery notes.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.gridConfig - Configuration for the grid.
 * @param {string} props.subheaderReference - Reference for the subheader.
 * @param {Function} props.downloadAllFile - Function to download all files.
 * @param {Function} props.openFilePdf - Function to open a PDF file.
 */
function DNotesFlyout({
  gridConfig,
  subheaderReference,
  downloadAllFile,
  openFilePdf,
}) {
  // Retrieve delivery notes flyout configuration from the store
  const dNoteFlyoutConfig = useOrderTrackingStore((st) => st.dNotesFlyout);
  const effects = useOrderTrackingStore((st) => st.effects);
  const [showTooltip, setShowTooltip] = useState(false);
  const [selected, setSelected] = useState([]);
  const [deliveryNotesResponse, setDeliveryNotesResponse] = useState(null);
  const uiTranslations = useOrderTrackingStore((state) => state.uiTranslations);
  const translations = uiTranslations?.['OrderTracking.Common.DnoteFlyout'];

  // Define the columns for the delivery notes table
  const columnList = [
    {
      columnLabel: "Column_DNote_Label",
      columnKey: "id",
    },
    {
      columnLabel: "Column_ShipDate_Label",
      columnKey: "actualShipDateFormatted",
    },
  ];

  /**
   * Closes the delivery notes flyout.
   */
  const closeFlyout = () => {
    effects.setCustomState({
      key: 'dNotesFlyout',
      value: { data: null, show: false },
    });
    setSelected([]);
  };

  // Configuration for the table flyout
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

  /**
   * Fetches delivery notes from the API.
   *
   * @returns {Promise<Object>} The result from the API call.
   */
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

  /**
   * Handles downloading the selected delivery notes.
   */
  const handleDownload = () => {
    closeFlyout();
    if (selected.length === 1) {
      return openFilePdf('DNote', config?.id, selected);
    } else if (selected.length > 1) {
      return downloadAllFile('DNote', config?.id, selected);
    }
  };

  /**
   * Handles downloading a single delivery note.
   *
   * @param {string} clickedId - The ID of the delivery note to download.
   */
  const handleSingleDownload = (clickedId) => {
    openFilePdf('DNote', config?.id, clickedId);
  };

  /**
   * Determines if the checkbox should be enabled for a row.
   *
   * @param {Object} row - The row data.
   * @returns {boolean} True if the checkbox should be enabled, otherwise false.
   */
  const handleCheckboxEnabled = (row) => {
    return row.canDownloadDocument;
  };

  /**
   * Determines if any checkboxes should be enabled.
   *
   * @returns {boolean} True if any checkboxes should be enabled, otherwise false.
   */
  const checkboxEnabled = () => {
    return rows.filter((n) => n.canDownloadDocument).length > 0;
  };

  /**
   * Effect to fetch delivery notes when the dNoteFlyoutConfig id changes.
   */
  useEffect(() => {
    setDeliveryNotesResponse(null);
    if (!dNoteFlyoutConfig?.data && dNoteFlyoutConfig?.id) {
      getDeliveryNotes()
        .then((result) => {
          setDeliveryNotesResponse(result?.data?.content);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [dNoteFlyoutConfig?.id]);


  return (
    <BaseFlyout
      open={dNoteFlyoutConfig?.show}
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
            <span>{dNoteFlyoutConfig?.id}</span>
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
          {translations?.Description}
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
            translations={translations}
          />
        )}
      </section>
    </BaseFlyout>
  );
}

export default DNotesFlyout;