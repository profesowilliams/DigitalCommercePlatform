import React, { useEffect, useRef } from 'react';
import { useRenewalGridState } from '../store/RenewalsStore';
import useOutsideClick from '../../../hooks/useOutsideClick';
import { redirectToRenewalDetail } from '../utils/renewalUtils';
import {
  getRowAnalytics,
  ANALYTIC_CONSTANTS,
  pushDataLayer,
} from '../../Analytics/analytics';
import {
  fileExtensions,
  generateFileFromPost,
  getDictionaryValue,
  getDictionaryValueOrKey,
  archiveOrRestoreRenewals,
} from '../../../../../utils/utils';
import { callServiceWrapper } from '../../../../../utils/api';
import { getStatusLoopUntilStatusIsActive } from '../Orders/orderingRequests';
import {
  Menu,
  MenuItem,
  MenuButton,
  MenuIcon,
  MenuText,
} from '../../web-components/Menu';

function ActionsMenu({
  config,
  data,
  open,
  onClose,
  sx,
  menuOptions,
  endpoints,
  canCopy,
  canShare,
  canRequestRevision,
  detailUrl,
  canRequestQuote,
  triggerRequestFlyout,
}) {
  const dialogRef = useRef();
  const { productGrid } = useRenewalGridState((st) => st.aemConfig);
  const { setCustomState } = useRenewalGridState((st) => st.effects);
  const analyticsCategory = useRenewalGridState((st) => st.analyticsCategory);
  const getDetailUrl = (id) =>
    `${window.location.origin}${detailUrl}.html?id=${data?.source?.id ?? ''}`;
  const effects = useRenewalGridState((state) => state.effects);

  let analyticsData = {
    source: data.source,
    vendor: data.vendor,
    reseller: data.reseller,
    link: getDetailUrl(data.source.id),
    analyticsCategory: analyticsCategory,
    analyticsAction: ANALYTIC_CONSTANTS.Grid.RowActions.ViewDetail,
  };

  useOutsideClick(dialogRef, onClose, 'mousedown', [onClose]);
  const {
    exportXLSRenewalsEndpoint,
    exportPDFRenewalsEndpoint,
    enableShareOption,
    enableReviseOption,
    enableRequestQuote,
    archiveOrRestoreRenewalsEndpoint,
  } = endpoints;

  const enableArchive = !data?.archived;
  const enableDownloadPDF = data?.canDownLoadPDF;
  const enableDownloadExcel = data?.canDownloadExcel;
  const showArchive = data?.canArchive;
  useEffect(() => {
    let timer;
    if (open) {
      timer = setTimeout(() => (document.body.style.paddingRight = '0px'), 800);
    } else {
      document.body.style.removeProperty('padding-right');
    }
    return () => {
      document.body.style.removeProperty('padding-right');
      clearTimeout(timer);
    };
  }, [open]);

  const downloadPDF = () => {
    try {
      data['link'] = exportPDFRenewalsEndpoint;
      pushDataLayer(
        getRowAnalytics(
          analyticsCategory,
          ANALYTIC_CONSTANTS.Grid.RowActions.DownloadPdf,
          data
        )
      );
      let pdfFileName = `Renewals Quote ${data?.source?.id}.pdf`;
      const quoteText = productGrid.quoteTextForFileName || 'quote';
      const vendorName = data.vendor.name ? `${data.vendor.name} - ` : '';
      const endUser = data.endUser.name ? `${data.endUser.name} - ` : '';
      const renewedDuration = data.renewedDuration
        ? `${data.renewedDuration} - `
        : '';
      const sourceId = data.source.id ? `${data.source.id} - ` : '';
      if (data?.hasMultipleSupportLevel) {
        pdfFileName = `${vendorName}${endUser}${sourceId}${renewedDuration}${quoteText}`;
      } else {
        const supportLevel = data.support ? `${data.support} - ` : '';
        pdfFileName = `${vendorName}${endUser}${sourceId}${renewedDuration}${supportLevel}${quoteText}`;
      }
      generateFileFromPost({
        url: exportPDFRenewalsEndpoint,
        name: `${pdfFileName}.pdf`,
        postData: {
          Id: data?.source?.id,
        },
        fileTypeExtension: fileExtensions.pdf,
      });
    } catch (error) {
      console.error('error', error);
    }
  };

  const downloadXLS = () => {
    try {
      data['link'] = exportXLSRenewalsEndpoint;
      pushDataLayer(
        getRowAnalytics(
          analyticsCategory,
          ANALYTIC_CONSTANTS.Grid.RowActions.DownloadXls,
          data
        )
      );
      let fileName = `Renewals Quote ${data?.source?.id}`;
      const quoteText = productGrid.quoteTextForFileName || 'quote';
      const vendorName = data.vendor.name ? `${data.vendor.name} - ` : '';
      const endUser = data.endUser.name ? `${data.endUser.name} - ` : '';
      const renewedDuration = data.renewedDuration
        ? `${data.renewedDuration} - `
        : '';
      const sourceId = data.source.id ? `${data.source.id} - ` : '';
      if (data?.hasMultipleSupportLevel) {
        fileName = `${vendorName}${endUser}${sourceId}${renewedDuration}${quoteText}`;
      } else {
        const supportLevel = data.support ? `${data.support} - ` : '';
        fileName = `${vendorName}${endUser}${sourceId}${renewedDuration}${supportLevel}${quoteText}`;
      }
      generateFileFromPost({
        url: exportXLSRenewalsEndpoint,
        name: `${fileName}.xlsx`,
        postData: {
          Id: data?.source?.id,
        },
      });
    } catch (error) {
      console.error('error', error);
    }
  };

  const triggerCopyFlyout = () => {
    data['link'] = '';
    onClose();
    setCustomState({ key: 'copyFlyout', value: { data, show: true } });
  };

  const triggerShareFlyout = () => {
    data['link'] = '';
    onClose();
    setCustomState({ key: 'shareFlyout', value: { data, show: true } });
  };

  const triggerRevisionFlyout = () => {
    data['link'] = '';
    onClose();
    setCustomState({ key: 'revisionFlyout', value: { data, show: true } });
  };

  const triggerArchive = async () => {
    effects.setCustomState({
      key: 'toaster',
      value: { isOpen: false },
    });
    onClose();
    const archived = true;

    const postData = {
      quoteId: data?.source?.id,
      archived: archived,
    };

    try {
      effects.setRenewalsGridActionPerformed(data?.source?.id);

      const response = await callServiceWrapper(
        archiveOrRestoreRenewals,
        archiveOrRestoreRenewalsEndpoint,
        postData
      );

      effects.resetRenewalsGridActionPerformed();

      if (response.errors.length > 0) {
        effects.setCustomState({
          key: 'toaster',
          value: { ...archiveToasterFail },
        });
      } else {
        effects.setRenewalsGridActionPerformed(data?.source?.id);

        const isActiveQuote = await getStatusLoopUntilStatusIsActive({
          getStatusEndpoint: config?.getStatusEndpoint,
          id: data?.source?.id,
          delay: 2000,
          iterations: 7,
        });

        effects.resetRenewalsGridActionPerformed();

        if (!isActiveQuote) {
          effects.setCustomState({
            key: 'toaster',
            value: {
              isOpen: true,
              origin: 'restoreRenewals',
              isAutoClose: false,
              isSuccess: false,
              message: getDictionaryValueOrKey(config.weAreSorry),
              Child: null,
            },
          });
        } else {
          effects.setCustomState({
            key: 'toaster',
            value: { ...archiveToasterSuccess },
          });

          effects.refreshRenealsGrid();
        }
      }
    } catch (error) {
      effects.resetRenewalsGridActionPerformed();
      effects.setCustomState({
        key: 'toaster',
        value: { ...archiveToasterFail },
      });
    }
  };

  const triggerRestore = async () => {
    effects.setCustomState({
      key: 'toaster',
      value: { isOpen: false },
    });
    onClose();
    const archived = false;

    const postData = {
      quoteId: data?.source?.id,
      archived: archived,
    };

    try {
      effects.setRenewalsGridActionPerformed(data?.source?.id);

      const response = await callServiceWrapper(
        archiveOrRestoreRenewals,
        archiveOrRestoreRenewalsEndpoint,
        postData
      );

      effects.resetRenewalsGridActionPerformed();

      if (response.errors.length > 0) {
        effects.setCustomState({
          key: 'toaster',
          value: { ...restoreToasterFail },
        });
      } else {
        effects.setRenewalsGridActionPerformed(data?.source?.id);

        const isActiveQuote = await getStatusLoopUntilStatusIsActive({
          getStatusEndpoint: config?.getStatusEndpoint,
          id: data?.source?.id,
          delay: 2000,
          iterations: 7,
        });

        effects.resetRenewalsGridActionPerformed();

        if (!isActiveQuote) {
          effects.setCustomState({
            key: 'toaster',
            value: {
              isOpen: true,
              origin: 'restoreRenewals',
              isAutoClose: false,
              isSuccess: false,
              message: getDictionaryValueOrKey(config.weAreSorry),
              Child: null,
            },
          });
        } else {
          effects.setCustomState({
            key: 'toaster',
            value: { ...restoreToasterSuccess },
          });

          effects.refreshRenealsGrid();
        }
      }
    } catch (error) {
      effects.resetRenewalsGridActionPerformed();
      effects.setCustomState({
        key: 'toaster',
        value: { ...restoreToasterFail },
      });
    }

    !enableArchive &&
      !menuOptions?.showDownloadXLSButton &&
      !menuOptions?.showDownloadPDFButton &&
      (!enableReviseOption || !canRequestRevision) &&
      (!enableShareOption || !canShare) &&
      !canCopy &&
      !canCopy &&
      redirectToRenewalDetail(detailUrl, data?.source?.id, analyticsData);
  };

  const archiveToasterSuccess = {
    isOpen: true,
    origin: 'archiveRenewals',
    isAutoClose: false,
    isSuccess: true,
    message: getDictionaryValueOrKey(
      config?.archiveLabels?.archiveToasterSuccess
    )?.replace('{0}', data?.endUser?.name),
    Child: (
      <button onClick={triggerRestore}>
        {getDictionaryValueOrKey(config?.archiveLabels?.undo)}
      </button>
    ),
  };

  const archiveToasterFail = {
    isOpen: true,
    origin: 'archiveRenewals',
    isAutoClose: false,
    isSuccess: false,
    message: getDictionaryValueOrKey(config?.archiveLabels?.archiveToasterFail),
    Child: null,
  };

  const restoreToasterSuccess = {
    isOpen: true,
    origin: 'restoreRenewals',
    isAutoClose: false,
    isSuccess: true,
    message: getDictionaryValueOrKey(
      config?.archiveLabels?.restoreToasterSuccess
    )?.replace('{0}', data?.endUser?.name),
    Child: (
      <button onClick={triggerArchive}>
        {getDictionaryValueOrKey(config?.archiveLabels?.undo)}
      </button>
    ),
  };

  const restoreToasterFail = {
    isOpen: true,
    origin: 'restoreRenewals',
    isAutoClose: false,
    isSuccess: false,
    message: getDictionaryValueOrKey(config?.archiveLabels?.restoreToasterFail),
    Child: null,
  };

  return (
    <Menu
      onClose={onClose}
      ref={dialogRef}
      open={open}
      flip={true}
      placement="bottom-start"
      alignment="start"
      auto-placement
      allowed-placements='["top-start", "bottom-start"]'
    >
      {/* HACK ryan.williams 2024-12-12: This div is intentionally left blank. */}
      {/* NOTE ryan.williams 2024-12-12: 
          This blank div is needed in order for the first MenuItem to work. 
          If this div is removed, the first MenuItem will not work. There is a re-render issue with the parent 
          component, ActionsMenu. The menu is positioned by an offset in the Menu web component.
      */}
      {/* TODO ryan.williams 2024-12-12: Add the offset to the React component. */}
      <div></div>
      <MenuItem
        onClick={() => {
          redirectToRenewalDetail(detailUrl, data?.source?.id, analyticsData);
          onClose();
        }}
      >
        <MenuButton type="button" variant="link" color="teal">
          <MenuIcon name="eye" state="default" />
          <MenuText>
            {getDictionaryValue(
              'button.common.label.seeDetails',
              'View details'
            )}
          </MenuText>
        </MenuButton>
      </MenuItem>
      {canCopy && enableArchive ? (
        <MenuItem
          onClick={() => {
            triggerCopyFlyout();
            onClose();
          }}
        >
          <MenuButton type="button" variant="link" color="teal">
            <MenuIcon name="copy" state="default" />
            <MenuText>Copy</MenuText>
          </MenuButton>
        </MenuItem>
      ) : null}
      {enableShareOption && canShare && enableArchive ? (
        <MenuItem
          onClick={() => {
            triggerShareFlyout();
            onClose();
          }}
        >
          <MenuButton type="button" variant="link" color="teal">
            <MenuIcon name="share" state="default" />
            <MenuText>Share</MenuText>
          </MenuButton>
        </MenuItem>
      ) : null}
      {enableReviseOption && canRequestRevision && enableArchive ? (
        <MenuItem onClick={triggerRevisionFlyout}>
          <MenuButton type="button" variant="link" color="teal">
            <MenuIcon name="revision" state="default" viewbox="0 0 16 16" />
            <MenuText>Request revision</MenuText>
          </MenuButton>
        </MenuItem>
      ) : null}
      {menuOptions?.showDownloadPDFButton &&
      enableArchive &&
      enableDownloadPDF ? (
        <MenuItem
          onClick={() => {
            downloadPDF();
            onClose();
          }}
        >
          <MenuButton type="button" variant="link" color="teal">
            <MenuIcon name="download" state="default" />
            <MenuText>
              {getDictionaryValue(
                'button.common.label.downloadPDF',
                'Download PDF'
              )}
            </MenuText>
          </MenuButton>
        </MenuItem>
      ) : null}
      {menuOptions?.showDownloadXLSButton &&
      enableArchive &&
      enableDownloadExcel ? (
        <MenuItem
          onClick={() => {
            downloadXLS();
            onClose();
          }}
        >
          <MenuButton type="button" variant="link" color="teal">
            <MenuIcon name="download" state="default" />
            <MenuText>
              {getDictionaryValue(
                'button.common.label.downloadXLS',
                'Download XLS'
              )}
            </MenuText>
          </MenuButton>
        </MenuItem>
      ) : null}
      {canRequestQuote && enableRequestQuote && enableArchive && (
        <MenuItem
          onClick={() => {
            triggerRequestFlyout(data);
            onClose();
          }}
        >
          <MenuButton type="button" variant="link" color="teal">
            <MenuIcon
              name="enterarrow"
              state="default"
              size="28"
              viewbox="0 0 24 24"
            />
            <MenuText>Request quote</MenuText>
          </MenuButton>
        </MenuItem>
      )}

      {config?.enableArchiveQuote && enableArchive && showArchive ? (
        <MenuItem
          onClick={() => {
            triggerArchive();
            onClose();
          }}
        >
          <MenuButton type="button" variant="link" color="teal">
            <MenuIcon name="archive" state="default" />
            <MenuText>
              {getDictionaryValueOrKey(config?.archiveLabels?.archive)}
            </MenuText>
          </MenuButton>
        </MenuItem>
      ) : null}
      {config?.enableArchiveQuote && !enableArchive ? (
        <MenuItem
          onClick={() => {
            triggerRestore();
            onClose();
          }}
        >
          <MenuButton type="button" variant="link" color="teal">
            <MenuIcon name="restore" state="default" viewbox="0 0 16 16" />
            <MenuText>
              {getDictionaryValueOrKey(config?.archiveLabels?.restore)}
            </MenuText>
          </MenuButton>
        </MenuItem>
      ) : null}
    </Menu>
  );
}

export default ActionsMenu;
