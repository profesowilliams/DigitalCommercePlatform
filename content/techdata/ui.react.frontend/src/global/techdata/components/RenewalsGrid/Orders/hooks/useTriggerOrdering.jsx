import React, { useState } from 'react';
import { redirectToRenewalDetail } from "../../renewalUtils";
import { TOASTER_LOCAL_STORAGE_KEY } from '../../../../../../utils/constants';
import { useRenewalGridState } from '../../store/RenewalsStore';
import { fetchQuoteRenewalDetails, mapRenewalForUpdateDashboard, mapRenewalForUpdateDetails } from '../orderingRequests';

function useTriggerOrdering({renewalDetailsEndpoint, data, detailUrl }) {
  
  const [toggleOrderDialog, setToggleOrderDialog] = useState(false);
  const [details,setDetails] = useState(false);
  const effects = useRenewalGridState((state) => state.effects);
  const { closeAndCleanToaster } = effects;

  const handleCartIconClick = async (_event, planOption) => {
    const renewalsId = planOption ? planOption.id : data.source.id;
    const isDefaultQuote = !planOption || planOption.id === data.source.id;

    if (isDefaultQuote && !data.isValid) {
      redirectToRenewalDetail(detailUrl, renewalsId);
      return ;
    }

    closeAndCleanToaster();
    const quoteDetails = await fetchQuoteRenewalDetails(
      renewalDetailsEndpoint,
      renewalsId
    );
    const { content = false } = quoteDetails;

    if (!content.details[0].canOrder) {
      redirectToRenewalDetail(detailUrl, renewalsId);
    }
    else {
      setToggleOrderDialog((toggle) => !toggle);
      if (content?.details[0])
        return setDetails(mapRenewalForUpdateDetails(content.details[0]));
      setDetails(mapRenewalForUpdateDashboard(data));
    }
  };

  const closeDialog = () => setToggleOrderDialog(false);

  return { handleCartIconClick, details, toggleOrderDialog, closeDialog };
}

export default useTriggerOrdering;
