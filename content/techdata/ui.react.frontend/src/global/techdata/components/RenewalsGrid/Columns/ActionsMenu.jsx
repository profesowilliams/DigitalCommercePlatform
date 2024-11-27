import React, { useEffect, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import { useRenewalGridState } from '../store/RenewalsStore';
import {
  CopyIcon,
  ShareIcon,
  DownloadIcon,
  EyeLightIcon,
  RevisionIcon,
  ArchiveIcon,
  RestoreIcon,
  EnterArrowIcon
} from '../../../../../fluentIcons/FluentIcons';
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
      value: { isOpen: false}});
    onClose();
    const archived = true;

    const postData = {
      "quoteId": data?.source?.id,
       "archived": archived
    };

    try {
      const response = await callServiceWrapper(archiveOrRestoreRenewals,archiveOrRestoreRenewalsEndpoint, postData);

      if (response.errors.length > 0) {
        effects.setCustomState({
          key: 'toaster',
          value: { ...archiveToasterFail },
        });
      } else {
        effects.setCustomState({
          key: 'toaster',
          value: { ...archiveToasterSuccess },
        });
        effects.refreshRenealsGrid();
      }
    } catch (error) {
      effects.setCustomState({
        key: 'toaster',
        value: { ...archiveToasterFail },
      });
    }
  };

  const triggerRestore = async () => {
    effects.setCustomState({
      key: 'toaster',
      value: { isOpen: false}});
    onClose();
    const archived = false;

    const postData = {
      "quoteId": data?.source?.id,
       "archived": archived
    };

    try {
      const response = await callServiceWrapper(archiveOrRestoreRenewals,archiveOrRestoreRenewalsEndpoint, postData);

      if (response.errors.length > 0) {
        effects.setCustomState({
          key: 'toaster',
          value: { ...restoreToasterFail },
        });
      } else {
        effects.setCustomState({
          key: 'toaster',
          value: { ...restoreToasterSuccess },
        });
        effects.refreshRenealsGrid();
      }
    } catch (error) {
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
      message: getDictionaryValueOrKey(config?.archiveLabels?.archiveToasterSuccess).replace("{0}", data?.endUser?.name),
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
    };

    const restoreToasterSuccess = {
      isOpen: true,
      origin: 'restoreRenewals',
      isAutoClose: false,
      isSuccess: true,
      message: getDictionaryValueOrKey(config?.archiveLabels?.restoreToasterSuccess).replace("{0}", data?.endUser?.name),
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
    };

  return (
    <Dialog
      onClose={onClose}
      ref={dialogRef}
      hideBackdrop
      open={open}
      disableScrollLock
      sx={sx}
    >
      <div
        className={
          canRequestQuote
            ? 'cmp-renewals-actions-menu is-opportunity'
            : 'cmp-renewals-actions-menu'
        }
      >
        <div
          className="cmp-renewals-actions-menu__item view-details"
          onClick={() =>
            redirectToRenewalDetail(detailUrl, data?.source?.id, analyticsData)
          }
        >
          <span className="cmp-renewals-actions-menu__item-icon">
            <EyeLightIcon />
          </span>
          <span className="cmp-renewals-actions-menu__item-label">
            {getDictionaryValue(
              'button.common.label.seeDetails',
              'See details'
            )}
          </span>
        </div>
        {canCopy && enableArchive ? (
          <div
            className="cmp-renewals-actions-menu__item"
            onClick={triggerCopyFlyout}
          >
            <span className="cmp-renewals-actions-menu__item-icon">
              <CopyIcon width="16" height="16" />
            </span>
            <span className="cmp-renewals-actions-menu__item-label">Copy</span>
          </div>
        ) : null}
        {enableShareOption && canShare && enableArchive ? (
          <div
            className="cmp-renewals-actions-menu__item"
            onClick={triggerShareFlyout}
          >
            <span className="cmp-renewals-actions-menu__item-icon">
              <ShareIcon width="16" height="16" />
            </span>
            <span className="cmp-renewals-actions-menu__item-label">Share</span>
          </div>
        ) : null}
        {enableReviseOption && canRequestRevision && enableArchive ? (
          <div
            className="cmp-renewals-actions-menu__item"
            onClick={triggerRevisionFlyout}
          >
            <span className="cmp-renewals-actions-menu__item-icon">
              <RevisionIcon width="16" height="16" />
            </span>
            <span className="cmp-renewals-actions-menu__item-label">
              Request revision
            </span>
          </div>
        ) : null}
        {menuOptions?.showDownloadPDFButton && enableArchive ? (
          <div
            className="cmp-renewals-actions-menu__item"
            onClick={downloadPDF}
          >
            <span className="cmp-renewals-actions-menu__item-icon">
              <DownloadIcon />
            </span>
            <span className="cmp-renewals-actions-menu__item-label">
              {getDictionaryValue(
                'button.common.label.downloadPDF',
                'Download PDF'
              )}
            </span>
          </div>
        ) : null}
        {menuOptions?.showDownloadXLSButton && enableArchive ? (
          <div
            className="cmp-renewals-actions-menu__item"
            onClick={downloadXLS}
          >
            <span className="cmp-renewals-actions-menu__item-icon">
              <DownloadIcon />
            </span>
            <span className="cmp-renewals-actions-menu__item-label">
              {getDictionaryValue(
                'button.common.label.downloadXLS',
                'Download XLS'
              )}
            </span>
          </div>
        ) : null}
        {
            (canRequestQuote && enableRequestQuote && enableArchive) && (
                <span
                    className="cmp-renewals-actions-menu__item request-quote"
                    onClick={() => triggerRequestFlyout(data)}
                  >
                    <EnterArrowIcon/>
                    Request quote
                </span>
            )
        }

        {config?.enableArchiveQuote && enableArchive ? (
          <div
            className="cmp-renewals-actions-menu__item"
            onClick={triggerArchive}
          >
            <span className="cmp-renewals-actions-menu__item-icon">
              <ArchiveIcon />
            </span>
            <span className="cmp-renewals-actions-menu__item-label">
              {getDictionaryValueOrKey(config?.archiveLabels?.archive)}
            </span>
          </div>
        ) : null}
        {config?.enableArchiveQuote && !enableArchive ? (
          <div
            className="cmp-renewals-actions-menu__item"
            onClick={triggerRestore}
          >
            <span className="cmp-renewals-actions-menu__item-icon">
              <RestoreIcon />
            </span>
            <span className="cmp-renewals-actions-menu__item-label">
              {getDictionaryValueOrKey(config?.archiveLabels?.restore)}
            </span>
          </div>
        ) : null}
      </div>
    </Dialog>
  );
}

export default ActionsMenu;
