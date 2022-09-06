import React, { useState } from 'react';
import { TOASTER_LOCAL_STORAGE_KEY } from '../../../../../utils/constants';
import { useRenewalGridState } from '../store/RenewalsStore';
import { fetchQuoteRenewalDetails, mapRenewalForUpdateDashboard, mapRenewalForUpdateDetails } from './orderingRequests';

function useTriggerOrdering({renewalDetailsEndpoint, data }) {

  const [toggleOrderDialog, setToggleOrderDialog] = useState(false);
  const [details,setDetails] = useState(false);
  const effects = useRenewalGridState((state) => state.effects);
  const { closeAndCleanToaster } = effects;

  const handleCartIconClick = async (_event) => {
    closeAndCleanToaster();
    const quoteDetails = await fetchQuoteRenewalDetails(
      renewalDetailsEndpoint,
      data.source.id
    );
    const { content = false } = quoteDetails;
    setToggleOrderDialog((toggle) => !toggle);
    if (content?.details[0])
      return setDetails(mapRenewalForUpdateDetails(content.details[0]));
    setDetails(mapRenewalForUpdateDashboard(data));
  };

  const closeDialog = () => setToggleOrderDialog(false);

  return { handleCartIconClick, details, toggleOrderDialog, closeDialog };
}

export default useTriggerOrdering;
