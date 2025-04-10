import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  CartIcon,
  CopyIcon,
  DownloadIcon,
  EllipsisIcon,
  EyeIcon,
  EyeLightIcon,
  LoaderIcon,
} from '../../../../../fluentIcons/FluentIcons';
import { PLANS_ACTIONS_LOCAL_STORAGE_KEY } from '../../../../../utils/constants';
import VerticalSeparator from '../../Widgets/VerticalSeparator';
import useIsIconEnabled from '../Orders/hooks/useIsIconEnabled';
import PlaceOrderDialog from '../Orders/PlaceOrderDialog';
import useTriggerOrdering from '../Orders/hooks/useTriggerOrdering';
import {
  getLocalStorageData,
  hasLocalStorageData,
  isFromRenewalDetailsPage,
  redirectToRenewalDetail,
  setLocalStorageData,
} from '../utils/renewalUtils';
import { useRenewalGridState } from '../store/RenewalsStore';
import Dialog from '@mui/material/Dialog';
import {
  fileExtensions,
  generateFileFromPost,
} from '../../../../../utils/utils';
import useOutsideClick from '../../../hooks/useOutsideClick';
import ActionsMenu from './ActionsMenu';
import { getRowAnalytics, ANALYTIC_CONSTANTS } from '../../Analytics/analytics';
import Button from '../../Widgets/Button';

function _RenewalActionColumn({ eventProps, config }) {
  const { value, data } = eventProps;
  const [isToggled, setToggled] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const parentPosition = useRef({ x: 0, y: 0 });
  const divRef = useRef(null);
  const dialogRef = useRef();
  const effects = useRenewalGridState((state) => state.effects);
  const openedActionMenu = useRenewalGridState(
    (state) => state.openedActionMenu
  );
  const { pageNumber } = useRenewalGridState((state) => state.pagination);
  const {
    detailUrl = '',
    orderingFromDashboard,
    productGrid,
    ...endpoints
  } = useRenewalGridState((state) => state.aemConfig);
  const analyticsCategory = useRenewalGridState(
    (state) => state.analyticsCategory
  );

  const isIconEnabled = useIsIconEnabled(
    data?.firstAvailableOrderDate,
    data?.canPlaceOrder,
    orderingFromDashboard?.showOrderingIcon
  );

  const renewalsGridActionPerformed = useRenewalGridState(
    (state) => state.renewalsGridActionPerformed
  );
  const renewalsGridActionPerformedColumn = useRenewalGridState(
    (state) => state.renewalsGridActionPerformedColumn
  );
  const canCopy = data?.canCopy;
  const canShare = data?.canShareQuote;
  const canRequestRevision = data?.canRequestRevision;
  const canRequestQuote = data?.canRequestQuote;
  data.orderSource = 'Grid';

  const { handleCartIconClick, details, toggleOrderDialog, closeDialog } =
    useTriggerOrdering({ renewalDetailsEndpoint, data, detailUrl });

  const {
    updateRenewalOrderEndpoint,
    getStatusEndpoint,
    orderRenewalEndpoint,
    renewalDetailsEndpoint,
    exportXLSRenewalsEndpoint,
    exportPDFRenewalsEndpoint,
    archiveOrRestoreRenewalsEndpoint,
  } = endpoints;

  const orderEndpoints = {
    updateRenewalOrderEndpoint,
    getStatusEndpoint,
    orderRenewalEndpoint,
    renewalDetailsEndpoint,
  };

  const iconStyle = {
    color: '#21314D',
    cursor: 'pointer',
    fontSize: '1.2rem',
    width: '1.3rem',
  };

  useOutsideClick(dialogRef, () => setShowActionsMenu(false), 'mousedown', [
    setShowActionsMenu,
  ]);

  useEffect(() => {
    const currentNode = eventProps.node;
    openedActionMenu !== currentNode?.rowIndex && setShowActionsMenu(false);
  }, [eventProps.node, openedActionMenu]);

  const isTheLastRow = useMemo(() => {
    let maximumValue = 0;
    eventProps.api.forEachNode((node) => {
      maximumValue = Math.max(node?.rowIndex, maximumValue);
    });
    return eventProps.node.rowIndex === maximumValue;
  }, []);

  useEffect(() => {
    getInitialToggleState();
    return () => {
      localStorage.removeItem(PLANS_ACTIONS_LOCAL_STORAGE_KEY);
    };
  }, []);

  /**
   * Gets the initial toggle value if it exist in local storage
   * and set the initial toggle value to respective row.
   * @returns void
   */
  function getInitialToggleState() {
    if (!isFromRenewalDetailsPage()) return;

    if (hasLocalStorageData(PLANS_ACTIONS_LOCAL_STORAGE_KEY)) {
      if (
        getLocalStorageData(PLANS_ACTIONS_LOCAL_STORAGE_KEY)?.detailRender !==
        'primary'
      )
        return;

      const localRowIndex = getLocalStorageData(
        PLANS_ACTIONS_LOCAL_STORAGE_KEY
      )?.rowIndex;
      const capturedPlanPage = getLocalStorageData(
        PLANS_ACTIONS_LOCAL_STORAGE_KEY
      )['capturedPlanPage'];

      if (
        eventProps.node.rowIndex === localRowIndex - 1 &&
        capturedPlanPage === pageNumber
      ) {
        eventProps.node.setExpanded(!isToggled);
        setToggled(!isToggled);
      }
    }
  }

  /**
   * Triggered when the actions button is clicked.
   * @returns void
   */
  const handleShowActionMenu = (evt) => {
    setShowActionsMenu((st) => !st);
    parentPosition.current = { top: evt?.clientY, right: evt.clientX };
    effects.setCustomState({
      key: 'openedActionMenu',
      value: eventProps.node?.rowIndex,
    });
  };

  const dialogStyling = {
    position: 'fixed',
    top: parentPosition.current.top,
    left: parentPosition.current.right,
    bottom: 'initial',
    width: '15rem',
    transform: `translate(-12.31rem,${isTheLastRow ? '-13rem' : '1rem'})`,
    '& .MuiDialog-container': {
      height: 'max-content',
      '& .MuiPaper-root': {
        margin: 0,
      },
    },
  };

  const downloadXLS = () => {
    try {
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

  const downloadPDF = () => {
    try {
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

  const triggerCopyFlyout = () => {
    setShowActionsMenu(false);
    effects.setCustomState({ key: 'showCopyFlyout', value: true });
  };

  const triggerRequestFlyout = (data) => {
    data['link'] = '';
    setShowActionsMenu(false);
    effects.setCustomState({
      key: 'requestFlyout',
      value: { data, show: true },
    });
  };

  return (
    <>
      <div
        className={
          (isIconEnabled && !canRequestQuote) || data.vendor.name === 'Adobe'
            ? 'cmp-renewal-action-container'
            : 'cmp-renewal-action-container cart-disabled'
        }
        style={{ position: 'relative' }}
        key={Math.random()}
      >
        {(isIconEnabled && !canRequestQuote) || data.vendor.name === 'Adobe' ? (
          <Button
            onClick={() => {
              if (data.vendor.name === 'Adobe') {
                redirectToRenewalDetail(detailUrl, data?.source?.id);
              } else {
                handleCartIconClick();
              }
            }}
          >
            <span className="cmp-renewals-cart-icon">
              <CartIcon />
            </span>
          </Button>
        ) : (
          <Button>
            <span className="cmp-renewals-cart-icon">
              <CartIcon
                className="disabled"
                fill="#bcc0c3"
                style={{ pointerEvents: 'none' }}
              />
            </span>
          </Button>
        )}
        <PlaceOrderDialog
          key={Math.random()}
          isDialogOpen={toggleOrderDialog}
          onClose={closeDialog}
          orderingFromDashboard={orderingFromDashboard}
          renewalData={data}
          closeOnBackdropClick={false}
          orderEndpoints={orderEndpoints}
          store={useRenewalGridState}
        />
        <VerticalSeparator />
        {renewalsGridActionPerformed &&
        renewalsGridActionPerformedColumn === data.source?.id ? (
          <LoaderIcon className="loadingIcon-search-rotate" />
        ) : (
          <span className="cmp-renewals-ellipsis" ref={divRef}>
            <EllipsisIcon onClick={handleShowActionMenu} style={iconStyle} />
          </span>
        )}
        <ActionsMenu
          config={config}
          onClose={() => setShowActionsMenu(false)}
          open={showActionsMenu}
          menuOptions={productGrid}
          canCopy={canCopy}
          triggerRequestFlyout={triggerRequestFlyout}
          canRequestRevision={canRequestRevision}
          canShare={canShare}
          canRequestQuote={canRequestQuote}
          detailUrl={detailUrl}
          data={data}
          endpoints={endpoints}
        />
      </div>
    </>
  );
}

const RenewalActionColumn = React.memo(_RenewalActionColumn);
export default RenewalActionColumn;
