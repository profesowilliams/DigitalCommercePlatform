using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Order.Helpers
{
    public static class TDOSOrderStatusMappingHelper
    {
        private const string UNDEFINED_KEY = "UNDEFINED";
        private static readonly Dictionary<string, string> _orderStatusCodeMap = new Dictionary<string, string>(){
            { UNDEFINED_KEY, "Undefined"}, //NULL
            { "OPEN", "Open"}, //A
            { "PROCESSING", "Being Processed" }, //B
            { "COMPLETED", "Completed"}, //C
            { "MAY_NOT_OCCUR", "May Not Occur"} //''
        };

        // This method is used only for output models. It doesn't affect the filtering.
        public static string GetOrderStatusLabelForTDOS(string status)
        {
            if (status == null)
                return _orderStatusCodeMap[UNDEFINED_KEY];

            if (_orderStatusCodeMap.ContainsKey(status))
                return _orderStatusCodeMap[status];

            return status;
        }
    }
}
