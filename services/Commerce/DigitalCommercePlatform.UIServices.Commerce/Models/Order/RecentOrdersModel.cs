using System;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Order
{
    public class RecentOrdersModel
    {
        public string Id { get; set; }
        public string Reseller { get; set; }
        public string ShipTo { get; set; }
        public DateTime? Created { get; set; }
        public string Type { get; set; }
        public string Price { get; set; }
        public string Status { get; set; }
        public string Invoice { get; set; }
        public string IsReturn { get; set; }
        public IList<TrackingDetails> Tracking { get; set; }
    }
}
