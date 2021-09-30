//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class PlantDto
    {
        public string Id { get; set; }
        public string EAN { get; set; }
        public string UPC { get; set; }
        public string CommodityCode { get; set; }
        public string MaterialCountryOfOrgin { get; set; }
        public string MultiLayerSerialNumberProfile { get; set; }
        public decimal PlannedDeliveryTimeInDays { get; set; }
        public decimal PurchaseOrderQuantity { get; set; }
        public string PurchaserPhone { get; set; }
        public string SerialNumberProfile { get; set; }
        public string SubstituteMaterialNumber { get; set; }
        public VendorDto Vendor { get; set; }
        public MaterialProfileDto MaterialProfile { get; set; }
        public PlantSpecificMaterialStatusDto PlantSpecificMaterialStatus { get; set; }
        public PurchasingGroupDto PurchasingGroup { get; set; }
        public LocationStockDto Stock { get; set; }
        public PlantIndicatorDto Indicators { get; set; }
    }
}
