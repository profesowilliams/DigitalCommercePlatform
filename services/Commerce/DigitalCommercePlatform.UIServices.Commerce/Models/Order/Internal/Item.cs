//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Infrastructure;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal
{
    [ExcludeFromCodeCoverage]
    public class Item
    {
        public string ID { get; set; }
        public string Parent { get; set; }
        public int Quantity { get; set; }
        public decimal? TotalPrice { get; set; }
        public string TotalPriceFormatted { get { return string.Format(Constants.MoneyFormat, TotalPrice); } }
        public decimal? UnitPrice { get; set; }
        public string UnitPriceFormatted { get { return string.Format(Constants.MoneyFormat, UnitPrice); } }
        public string Currency { get; set; }
        public string CurrencySymbol { get; set; } = "$";
        public List<Product> Product { get; set; }
        public List<ShipmentModel> Shipments { get; set; }
        public List<InvoiceModel> Invoices { get; set; }
        public List<OrderLinkModel> PurchaseOrder { get; set; }
        public decimal? Tax { get; set; }
        public decimal? Freight { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class OrderLinkModel
    {
        public string ID { get; set; }
        public string AltID { get; set; }
        public string Line { get; set; }
    }
}
