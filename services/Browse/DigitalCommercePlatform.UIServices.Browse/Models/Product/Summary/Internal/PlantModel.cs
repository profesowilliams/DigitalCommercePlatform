//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Product.Summary.Internal
{
    [ExcludeFromCodeCoverage]
    public class PlantModel
    {
        public string Id { get; set; }
        public string UPC { get; set; }
        public VendorModel Vendor { get; set; }
        public MaterialProfileModel MaterialProfile { get; set; }
    }
}
