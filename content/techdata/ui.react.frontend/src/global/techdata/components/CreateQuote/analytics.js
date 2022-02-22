import { pushData } from "../../../../utils/dataLayerUtils";

export const pushAnalyticsEvent = (isQuoteStart, methodSelected) => {
  pushData({
    event: isQuoteStart ? "quoteStart" : "quoteComplete",
    quotes: {
        options: methodSelected.label,
    }
  });
}
