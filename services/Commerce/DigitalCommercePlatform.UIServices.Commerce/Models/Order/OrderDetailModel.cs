//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Order
{
    [ExcludeFromCodeCoverage]
    public class OrderDetailModel
    {
        public PaymentDetails PaymentDetails { get; set; }
        public Address ShipTo { get; set; }
        public Address EndUser { get; set; }
        public bool CanBeExpedited { get; set; }
        public List<OrderNotification> EndUserNotifications { get; set; }
        public Customer Reseller { get; set; }
        public List<OrderNotification> ResellerNotifications { get; set; }
        public List<Line> Lines { get; set; }
        public string Message { get; set; }
        public string QuoteNumber { get; set; }
        public string OrderNumber { get; set; }
        public string PONumber { get; set; }
        public string EndUserPO { get; set; }
        public string PODate { get; set; }
        public string SiteID { get; set; }
        public bool ShipComplete { get; set; }
        public int StandardOrderStatusCode { get; set; }
        public string StandardOrderStatus { get; set; }
        public string ConfigurationOrderStatus { get; set; }
        public bool BlindPackaging { get; set; }
        public string SiteURL { get; set; }
        public string Status { get; set; }
    }
}
