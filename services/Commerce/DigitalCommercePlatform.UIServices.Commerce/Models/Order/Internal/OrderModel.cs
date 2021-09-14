//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Infrastructure;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal
{
    [ExcludeFromCodeCoverage]
    public class OrderModel
    {
        public Source Source { get; set; }
        public AddressModel ShipTo { get; set; }
        public DateTime? Created { get; set; }
        public string DocType { get; set; }
        public decimal? Price { get; set; }
        public string PriceFormatted { get { return string.Format(Constants.MoneyFormat, Price); } }
        public string Currency { get; set; }
        public string CurrencySymbol { get; set; } = "$";
        public Status Status { get; set; }
        public List<Item> Items { get; set; }
        public string CustomerPO { get; set; }
        public bool BlindPackaging { get; set; }
        public string PaymentTermText { get; set; }
    }
}
