//2021 (c) Tech Data Corporation - All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.Models.Internal
{
    [ExcludeFromCodeCoverage]
    public class ItemModel
    {
        public string LineId { get; set; }
        public string TechDataPartNumber { get; set; }
        public string Name { get; set; }
        public string Manufacturer { get; set; }
        public string ManufacturerPartNumber { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
        public decimal UnitPrice { get; set; }
        public string Currency { get; set; }
        public string Status { get; set; }
        public string BlockReason { get; set; }
        public List<string> Serials { get; set; }
        public List<ShipmentsModel> Shipments { get; set; }
        public List<DeliveryModel> DeliveryNotes { get; set; }
        public bool IsDropShip { get; set; }
    }
}
