//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Export.Models.Renewal.Internal.Product
{
    [ExcludeFromCodeCoverage]
    public class ProductData
    {
        public ProductsModel[] Data { get; set; }
    }
    
    [ExcludeFromCodeCoverage]
    public class ProductsModel
    {
        public SourceModel Source { get; set; }
        public string DisplayName { get; set; }
        public string Description { get; set; }
        public string GlobalManufacturer { get; set; }
        public string ManufacturerPartNumber { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class SourceModel
    {
        public string ID { get; set; }
        public string System { get; set; }
        public string SalesOrg { get; set; }
        public string TargetSystem { get; set; }
        public string Key { get; set; }
    }
}
