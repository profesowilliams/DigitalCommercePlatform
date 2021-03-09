using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Product.Find
{
    [ExcludeFromCodeCoverage]
    public class FindProductModel
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
    }
}