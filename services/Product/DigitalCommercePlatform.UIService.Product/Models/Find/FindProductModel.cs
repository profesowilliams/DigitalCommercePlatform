using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Product.Models.Find
{
    [ExcludeFromCodeCoverage]
    public class FindProductModel
    {
        public string[] MaterialNumber { get; set; }
        public string[] OldMaterialNumber { get; set; }
        public string[] Manufacturer { get; set; }
        public string[] MfrPartNumber { get; set; }
        public string[] UPC { get; set; }
        public string CustomerNumber { get; set; }
        public string CustomerPartNumber { get; set; }
        public string SalesOrganization { get; set; }
        public string[] MaterialStatus { get; set; }
        public string Territory { get; set; }
        public string Description { get; set; }
        public string System { get; set; }
    }
}