using System;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIService.Order.Services
{
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

            var propertyNameWithoutSortingType = GetPropertyName(sortingValue);

            var isValid = _propertiesMapping.ContainsKey(propertyNameWithoutSortingType);
            return isValid;
        }

        public (string sortingProperty, bool sortAscending) GetSortingParameters(string sortingValue)
        {
            if(string.IsNullOrWhiteSpace(sortingValue))
            {
                return ("ID", true);
            }

            var propertyNameWithoutSortingType = GetPropertyName(sortingValue);
            var sortingProperty = _propertiesMapping[propertyNameWithoutSortingType];

            bool sortDescending = sortingValue.Trim().EndsWith(" desc", StringComparison.OrdinalIgnoreCase);
            bool sortAscending = !sortDescending;
            
            return (sortingProperty, sortAscending);
        }

        public string GetValidProperties()
        {
            var properties = string.Join(" , ", _propertiesMapping.Keys);
            return properties;
        }

        private string GetPropertyName(string sortingValue)
        {
            var sortingValueAfterTrim = sortingValue.Trim();
            var indexOfFirstSpace = sortingValueAfterTrim.IndexOf(" ",StringComparison.OrdinalIgnoreCase);
            var propertyNameWithoutSortingType = indexOfFirstSpace == -1 ? sortingValueAfterTrim : sortingValueAfterTrim.Remove(indexOfFirstSpace);
            return propertyNameWithoutSortingType;
        }
    }
}
