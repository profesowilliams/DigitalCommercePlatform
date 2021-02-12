using DigitalCommercePlatform.UIService.Browse.DTO.Product.Product.Internal;
using DigitalCommercePlatform.UIService.Browse.Models.Product.Stock;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Browse.Models.Product.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class PlantModel
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
        public VendorModel Vendor { get; set; }
        public MaterialProfileModel MaterialProfile { get; set; }
        public PlantSpecificMaterialStatusModel PlantSpecificMaterialStatus { get; set; }
        public PurchasingGroupModel PurchasingGroup { get; set; }
        public LocationStockModel Stock { get; set; }
        public IEnumerable<IndicatorDto> Indicators { get; set; }
    }
}