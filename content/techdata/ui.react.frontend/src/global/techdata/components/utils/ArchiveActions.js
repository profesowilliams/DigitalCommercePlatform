import React from 'react';
import {
  getDictionaryValueOrKey,
  archiveOrRestoreRenewals
} from '../../../../utils/utils';
import { callServiceWrapper } from '../../../../utils/api';
import { getStatusLoopUntilStatusIsActive } from "../RenewalsGrid/Orders/orderingRequests";

export const triggerArchiveRestore = async (setIsArchived, archiveToasterSuccessLabel, restoreToasterSuccessLabel, undoLabel,
    archiveToasterFailLabel, restoreToasterFailLabel, weAreSorryLabel, archiveOrRestoreRenewalsEndpoint, statusEndpoint,
     effects, quoteId, endUserName, archived = false, isActionMenu = false, onClose = null) => {
  const toasterSuccess = {
    isOpen: true,
    origin: 'restoreRenewals',
    isAutoClose: false,
    isSuccess: true,
    message: getDictionaryValueOrKey(
      archived
        ? archiveToasterSuccessLabel
        : restoreToasterSuccessLabel
    )?.replace("{0}", endUserName),
    Child: (
      <button onClick={() => triggerArchiveRestore(setIsArchived, archiveToasterSuccessLabel, restoreToasterSuccessLabel,
                                                    undoLabel, archiveToasterFailLabel, restoreToasterFailLabel,
                                                    weAreSorryLabel, archiveOrRestoreRenewalsEndpoint, statusEndpoint,
                                                    effects, quoteId, endUserName, !archived, isActionMenu, onClose)}>
          {getDictionaryValueOrKey(undoLabel)}
      </button>
    ),
  };

  const toasterFail = {
    isOpen: true,
    origin: 'restoreRenewals',
    isAutoClose: false,
    isSuccess: false,
    message: getDictionaryValueOrKey(archived
      ? archiveToasterFailLabel
      : restoreToasterFailLabel
    ),
    Child: null,
  };

  effects.setCustomState({
    key: 'toaster',
    value: { isOpen: false}});

  if(isActionMenu) {
    onClose();
  }

  const postData = {
    "quoteId": quoteId,
     "archived": archived
  };

  try {
    if(isActionMenu) {
      effects.setRenewalsGridActionPerformed(quoteId);
    }

    const response = await callServiceWrapper(archiveOrRestoreRenewals,archiveOrRestoreRenewalsEndpoint, postData);

    if(isActionMenu) {
      effects.resetRenewalsGridActionPerformed();
    }

    if (response.errors.length > 0) {
      effects.setCustomState({
        key: 'toaster',
        value: { ...toasterFail },
      });
    } else {
      if(isActionMenu) {
        effects.setRenewalsGridActionPerformed(quoteId);
      }

      const isActiveQuote = await getStatusLoopUntilStatusIsActive({
        getStatusEndpoint: statusEndpoint,
        id: quoteId,
        delay: 2000,
        iterations: 7,
      });

      if(isActionMenu) {
        effects.resetRenewalsGridActionPerformed();
      }

      if (!isActiveQuote) {
        effects.setCustomState({
          key: 'toaster',
          value: {
            isOpen: true,
            origin: 'restoreRenewals',
            isAutoClose: false,
            isSuccess: false,
            message: getDictionaryValueOrKey(weAreSorryLabel),
            Child: null,
          },
        });
      } else {
        effects.setCustomState({
          key: 'toaster',
          value: { ...toasterSuccess },
        });
        if(!isActionMenu) {
          setIsArchived(archived);
        }

        effects.refreshRenealsGrid();
      }
    }
  } catch (error) {
    if(isActionMenu) {
      effects.resetRenewalsGridActionPerformed();
    }
    console.log('error', error);

    effects.setCustomState({
      key: 'toaster',
      value: { ...toasterFail },
    });
  }
};