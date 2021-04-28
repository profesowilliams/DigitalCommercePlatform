using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Services
{
    [ExcludeFromCodeCoverage]
    public class SortingService : ISortingService
    {
        private readonly Dictionary<string, string> _propertiesMapping;

        public SortingService()
        {
            _propertiesMapping = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                { "Id", "ID" },
                { "ShipTo", "SHIPTONAME" },
                { "Created", "CREATED" },
                { "Type", "ORDERTYPE" },
                { "Price", "PRICE" },
                { "Status", "ORDERSTATUS" }
            };
        }

        public bool IsPropertyValid(string sortingValue)
        {
            if (string.IsNullOrWhiteSpace(sortingValue)) { return true; }

            var isValid = _propertiesMapping.ContainsKey(sortingValue.Trim());
            return isValid;
        }

        public string GetSortingProperty(string sortingValue)
        {
            if (string.IsNullOrWhiteSpace(sortingValue))
            {
                return "CREATED";
            }

            sortingValue = sortingValue.Trim();

            if (!_propertiesMapping.ContainsKey(sortingValue))
            {
                return "CREATED";
            }

            var sortingProperty = _propertiesMapping[sortingValue];

            return sortingProperty;
        }

        public string GetValidProperties()
        {
            var properties = string.Join(" , ", _propertiesMapping.Keys);
            return properties;
        }
    }
}
