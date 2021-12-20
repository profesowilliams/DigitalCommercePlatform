//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Models.Common;
using DigitalCommercePlatform.UIServices.Export.Models.Internal;
using DigitalFoundation.Common.Features.Contexts.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Export.Models.Order.Internal
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
        public string EndUserPO { get; set; }
        public DateTime? PoDate { get; set; }
        public bool BlindPackaging { get; set; }
        public string PaymentTermText { get; set; }
        public string FreightFormatted { get; set; }
        public decimal? Freight { get; set; }
        public decimal? Tax { get; set; }
        public decimal? TotalCharge { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? Total { get; set; }        
        public decimal? OtherFees { get; set; }
        public bool Return { get; set; }

    }
}
