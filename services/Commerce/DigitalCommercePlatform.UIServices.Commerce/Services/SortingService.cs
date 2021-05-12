using System;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    public class SortingService : ISortingService
    {
        private readonly Dictionary<string, string> _propertiesMapping;
        private readonly List<string> _sortingDirections;
        private readonly int _indexOfAscendingValue = 0;

        public SortingService()
        {
            _propertiesMapping = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                { "Id", "ID" },
                { "ShipTo", "SHIPTONAME" },
                { "Created", "CREATED" },
                { "Type", "ORDERTYPE" },
                { "Price", "PRICE" },
                { "Status", "ORDERSTATUS" },
                { "PriceFormatted", "PRICE" }
            };

            _sortingDirections = new List<string>()
            {
                "asc",
                "desc"
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

        public bool IsSortingDirectionValid(string sortingValue)
        {
            if (string.IsNullOrWhiteSpace(sortingValue)) { return true; }

            var isValid = _sortingDirections.Contains(sortingValue.Trim().ToLower());
            return isValid;
        }

        public string GetValidSortingValues()
        {
            var values = string.Join(" , ", _sortingDirections);
            return values;
        }

        public bool IsSortingDirectionAscending(string sortingValue)
        {
            if (string.IsNullOrWhiteSpace(sortingValue))
            {
                return true;
            }

            sortingValue = sortingValue.Trim().ToLower();

            if (!_sortingDirections.Contains(sortingValue))
            {
                return true;
            }

            var sortAscending = sortingValue == _sortingDirections[_indexOfAscendingValue];

            return sortAscending;
        }
    }
}
