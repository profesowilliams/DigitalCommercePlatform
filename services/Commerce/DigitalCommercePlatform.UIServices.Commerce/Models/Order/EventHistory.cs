//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Order
{
    public class EventHistory
    {
        public string DismissedById { get; set; }
        public DateTime? DismissedOn { get; set; }
        public byte Severity { get; set; }
        public bool IsLineEvent { get; set; }
        public string WarehouseCode { get; set; }
        public string EstimatedShipDate { get; set; }
        public string DismissedByName { get; set; }
        public int Quantity { get; set; }
        public byte NotificationTypeId { get; set; }
        public DateTime ChangeDate { get; set; }
        public long EventId { get; set; }
        public string LineNumber { get; set; }
        public string ParentLine { get; set; }
        public string NotificationTypeDesc { get; set; }
        public string EventMessage { get; set; }
        public string WarehouseDesc { get; set; }
    }
}
