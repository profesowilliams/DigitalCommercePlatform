using System;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    public class StatusMappingService : IStatusMappingService
    {
        private readonly Dictionary<string, string> _mappings;

        public StatusMappingService()
        {
            _mappings = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                { "open", "OPEN" },
                { "cancelled", "CANCELLED" },
                { "onHold", "ON_HOLD" },
                { "shipped", "SHIPPED" },
                { "inProcess", "IN_PROCESS" }
            };
        }

        public string GetMappingPropertyValue(string mappingValue)
        {
            if (string.IsNullOrWhiteSpace(mappingValue))
            {
                return string.Empty;
            }

            mappingValue = mappingValue.Trim();

            if (!_mappings.ContainsKey(mappingValue))
            {
                return string.Empty;
            }

            var statusValue = _mappings[mappingValue];

            return statusValue;
        }

        public bool IsStatusValid(string statusValue)
        {
            if (string.IsNullOrWhiteSpace(statusValue)) { return true; }

            var isValid = _mappings.ContainsKey(statusValue.Trim());
            return isValid;
        }

        public string GetValidStatusValues()
        {
            var values = string.Join(" , ", _mappings.Keys);
            return values;
        }
    }
}
