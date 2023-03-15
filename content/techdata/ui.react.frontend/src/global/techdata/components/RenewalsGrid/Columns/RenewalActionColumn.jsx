import React, { useEffect, useMemo, useState, useRef } from 'react';
import { CartIcon, CopyIcon, DownloadIcon, EllipsisIcon, EyeIcon, EyeLightIcon } from '../../../../../fluentIcons/FluentIcons';
import { PLANS_ACTIONS_LOCAL_STORAGE_KEY } from '../../../../../utils/constants';
import VerticalSeparator from '../../Widgets/VerticalSeparator';
import useIsIconEnabled from '../Orders/hooks/useIsIconEnabled';
import PlaceOrderDialog from '../Orders/PlaceOrderDialog';
import useTriggerOrdering from '../Orders/hooks/useTriggerOrdering';
import {
  analyticsColumnDataToPush,
  getLocalStorageData,
  hasLocalStorageData,
  isFromRenewalDetailsPage,
  redirectToRenewalDetail,
  setLocalStorageData,
} from '../utils/renewalUtils';
import { useRenewalGridState } from '../store/RenewalsStore';
import Dialog from "@mui/material/Dialog";
import { ANALYTICS_TYPES, pushEvent } from '../../../../../utils/dataLayerUtils';
import { fileExtensions, generateFileFromPost } from '../../../../../utils/utils';
import useOutsideClick from '../../../hooks/useOutsideClick';
import ActionsMenu from './ActionsMenu';

function _RenewalActionColumn({ eventProps }) {
  const { value, data } = eventProps;
  const [isToggled, setToggled] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const parentPosition = useRef({ x: 0, y: 0 });
  const divRef = useRef(null);
  const dialogRef = useRef();
  const effects = useRenewalGridState((state) => state.effects);
  const openedActionMenu = useRenewalGridState((state) => state.openedActionMenu);
  const { pageNumber } = useRenewalGridState((state) => state.pagination);
  const {
    detailUrl = '',
    orderingFromDashboard,
    productGrid,
    ...endpoints
  } = useRenewalGridState((state) => state.aemConfig);

  const isIconEnabled = useIsIconEnabled(
    data?.firstAvailableOrderDate,
    data?.canPlaceOrder,
    orderingFromDashboard?.showOrderingIcon
  );

  const canCopy = data?.canCopy;

  const { handleCartIconClick, details, toggleOrderDialog, closeDialog } =
    useTriggerOrdering({ renewalDetailsEndpoint, data, detailUrl });

  const {
    updateRenewalOrderEndpoint,
    getStatusEndpoint,
    orderRenewalEndpoint,
    renewalDetailsEndpoint,
    exportXLSRenewalsEndpoint,
    exportPDFRenewalsEndpoint
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

  useOutsideClick(dialogRef, () => setShowActionsMenu(false), 'mousedown', [setShowActionsMenu]);

  useEffect(() => {
    const currentNode = eventProps.node;
    openedActionMenu !== currentNode?.rowIndex && setShowActionsMenu(false);
  }, [eventProps.node,openedActionMenu]);

  const isTheLastRow = useMemo(() => {
    let maximumValue = 0;
    eventProps.api.forEachNode(node => {      
      maximumValue = Math.max(node?.rowIndex, maximumValue);
    });   
    return eventProps.node.rowIndex === maximumValue;
  },[]);

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
    parentPosition.current = {top: evt?.clientY, right: evt.clientX }; 
    effects.setCustomState({key:'openedActionMenu', value: eventProps.node?.rowIndex});  
  };

  const dialogStyling = {
    position: 'fixed',
    top: parentPosition.current.top,
    left: parentPosition.current.right,
    bottom:'initial',
    width: '15rem',
    transform:`translate(-12.31rem,${isTheLastRow ? '-13rem' : '1rem'})`,          
    '& .MuiDialog-container': {             
      height:'max-content',           
      '& .MuiPaper-root' : {
        margin: 0
      }
    }
  };

  const downloadXLS = () => {
    try {
      pushEvent(ANALYTICS_TYPES.events.click, analyticsColumnDataToPush(ANALYTICS_TYPES.name.downloadXLS));
      generateFileFromPost({
        url: exportXLSRenewalsEndpoint,
        name: `Renewals Quote ${data?.source?.id}.xlsx`,
        postData: {
          Id: data?.source?.id
        }
      });
    } catch (error) {
      console.error("error", error);
    }
  };

  const downloadPDF = () => {
    try {      
      pushEvent(ANALYTICS_TYPES.events.click, analyticsColumnDataToPush(ANALYTICS_TYPES.name.downloadPDF));
      generateFileFromPost({
        url: exportPDFRenewalsEndpoint,
        name: `Renewals Quote ${data?.source?.id}.pdf`,
        postData: {
          Id: data?.source?.id
        },
        fileTypeExtension: fileExtensions.pdf
      })
    } catch (error) {
      console.error("error", error);
    }
    }
  
  const triggerCopyFlyout = () => {
    setShowActionsMenu(false);
    effects.setCustomState({key:'showCopyFlyout',value:true})
  }

  return (
    <>
      <div className="cmp-renewal-action-container" style={{position:'relative'}} key={Math.random()}>
        {isIconEnabled ? (
          <span className="cmp-renewals-cart-icon">
            <CartIcon onClick={handleCartIconClick} />
          </span>
        ) : (
          <CartIcon
            className="disabled"
            fill="#bcc0c3"
            style={{ pointerEvents: 'none' }}
          />
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
        <span className="cmp-renewals-ellipsis" ref={divRef}>
          <EllipsisIcon onClick={handleShowActionMenu} style={iconStyle} />
        </span>
        <ActionsMenu 
          onClose={() => setShowActionsMenu(false)}
          open={showActionsMenu}
          menuOptions={productGrid}
          sx={dialogStyling}
          canCopy={canCopy}
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
