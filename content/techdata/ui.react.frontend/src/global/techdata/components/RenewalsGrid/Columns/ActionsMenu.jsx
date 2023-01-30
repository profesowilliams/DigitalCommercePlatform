import React, { useEffect, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import { useRenewalGridState } from '../store/RenewalsStore';
import {
    CopyIcon,
    DownloadIcon,
    EyeLightIcon,
} from '../../../../../fluentIcons/FluentIcons';
import useOutsideClick from '../../../hooks/useOutsideClick';
import {
    analyticsColumnDataToPush,
    redirectToRenewalDetail,
} from '../utils/renewalUtils';
import {
    ANALYTICS_TYPES,
    pushEvent,
} from '../../../../../utils/dataLayerUtils';
import { fileExtensions, generateFileFromPost, getDictionaryValue } from '../../../../../utils/utils';

function ActionsMenu({ data, open, onClose, sx, menuOptions, endpoints, canCopy, detailUrl }) {

    const dialogRef = useRef();
    const { setCustomState } = useRenewalGridState(st => st.effects);


    useOutsideClick(dialogRef, onClose, 'mousedown', [onClose]);

    const { exportXLSRenewalsEndpoint, exportPDFRenewalsEndpoint } = endpoints;

    useEffect(() => {
        let timer;
        if(open) {
          timer = setTimeout(() => document.body.style.paddingRight = '0px', 800);
        } else {
          document.body.style.removeProperty('padding-right');
        };
        return () => {
            document.body.style.removeProperty('padding-right');
            clearTimeout(timer);
        }
      },[open])

    const downloadPDF = () => {
        try {
            pushEvent(
                ANALYTICS_TYPES.events.click,
                analyticsColumnDataToPush(ANALYTICS_TYPES.name.downloadPDF)
            );
            generateFileFromPost({
                url: exportPDFRenewalsEndpoint,
                name: `Renewals Quote ${data?.source?.id}.pdf`,
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
            pushEvent(
                ANALYTICS_TYPES.events.click,
                analyticsColumnDataToPush(ANALYTICS_TYPES.name.downloadXLS)
            );
            generateFileFromPost({
                url: exportXLSRenewalsEndpoint,
                name: `Renewals Quote ${data?.source?.id}.xlsx`,
                postData: {
                    Id: data?.source?.id,
                },
            });
        } catch (error) {
            console.error('error', error);
        }
    };

    const triggerCopyFlyout = () => {
        onClose();
        setCustomState({ key: 'showCopyFlyout', value: true });
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
            <div className="cmp-renewals-actions-menu">
                <div
                    className="cmp-renewals-actions-menu__item"
                    onClick={() => redirectToRenewalDetail(detailUrl, data?.source?.id)}
                >
                    <span className="cmp-renewals-actions-menu__item-icon">
                        <EyeLightIcon />
                    </span>
                    <span className="cmp-renewals-actions-menu__item-label">
                        {getDictionaryValue("button.common.label.seeDetails", "See details")}
                    </span>
                </div>
                {canCopy ? (
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
                {menuOptions?.showDownloadPDFButton ? (
                    <div
                        className="cmp-renewals-actions-menu__item"
                        onClick={downloadPDF}
                    >
                        <span className="cmp-renewals-actions-menu__item-icon">
                            <DownloadIcon />
                        </span>
                        <span className="cmp-renewals-actions-menu__item-label">
                            {getDictionaryValue("button.common.label.downloadPDF", "Download PDF")}
                        </span>
                    </div>
                ) : null}
                {menuOptions?.showDownloadXLSButton ? (
                    <div
                        className="cmp-renewals-actions-menu__item"
                        onClick={downloadXLS}
                    >
                        <span className="cmp-renewals-actions-menu__item-icon">
                            <DownloadIcon />
                        </span>
                        <span className="cmp-renewals-actions-menu__item-label">
                            {getDictionaryValue("button.common.label.downloadXLS", "Download XLS")}
                        </span>
                    </div>
                ) : null}
            </div>
        </Dialog>
    );
}

export default ActionsMenu;
