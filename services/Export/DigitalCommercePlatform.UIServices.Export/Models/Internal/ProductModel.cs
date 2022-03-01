//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Export.Models.Internal
{
    [ExcludeFromCodeCoverage]
    public class ProductModel
    {
        public string Type { get; set; }
        public string Id { get; set; }
        public string VendorPartNumber { get; set; }
        public string Name { get; set; }
        public string Manufacturer { get; set; }
        public string LocalManufacturer { get; set; }
        public string Classification { get; set; }
    }
}
