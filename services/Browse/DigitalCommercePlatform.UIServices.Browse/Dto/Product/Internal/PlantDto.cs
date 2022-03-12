//2022 (c) TD Synnex - All Rights Reserved.

using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class PlantDto
    {
        public string Id { get; set; }
        public decimal PlannedDeliveryTimeInDays { get; set; }
        public decimal PurchaseOrderQuantity { get; set; }
        public MaterialProfileDto MaterialProfile { get; set; }
        public PlantSpecificMaterialStatusDto PlantSpecificMaterialStatus { get; set; }
        public PurchasingGroupDto PurchasingGroup { get; set; }
        public LocationStockDto Stock { get; set; }
        public PlantIndicatorDto Indicators { get; set; }
    }
}