namespace DigitalCommercePlatform.UIService.Product.Dto.Product.Internal
{
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
    }
}