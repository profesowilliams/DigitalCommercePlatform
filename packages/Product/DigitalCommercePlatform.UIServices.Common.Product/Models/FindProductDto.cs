using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Common.Product.Models
{
    public class FindProductDto
    {
        public IEnumerable<string> MaterialNumber { get; set; }
        public IEnumerable<string> OldMaterialNumber { get; set; }
        public IEnumerable<string> Manufacturer { get; set; }
        public IEnumerable<string> MfrPartNumber { get; set; }
        public IEnumerable<string> UPC { get; set; }
        public string CustomerNumber { get; set; }
        public string CustomerPartNumber { get; set; }
        public string SalesOrganization { get; set; }
        public IEnumerable<string> MaterialStatus { get; set; }
        public IEnumerable<string> Territories { get; set; }
        public string Description { get; set; }
        public string System { get; set; }
        public bool Details { get; set; } = true;
        public bool WithPaginationInfo { get; set; }
        public int? Page { get; set; }
        public int? PageSize { get; set; }
        public Sort SortBy { get; set; } = Sort.ID;
        public bool SortAscending { get; set; } = true;
    }
}
