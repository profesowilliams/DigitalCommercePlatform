import { ANALYTICS_TYPES, pushData } from "../../../../utils/dataLayerUtils";

export const pushAnalyticsEvent = (isQuoteStart, methodSelected) => {
  pushData({
    event: isQuoteStart ? ANALYTICS_TYPES.events.quoteStart : ANALYTICS_TYPES.events.quoteComplete,
    quotes: {
        options: methodSelected.label,
    }
  });
}
