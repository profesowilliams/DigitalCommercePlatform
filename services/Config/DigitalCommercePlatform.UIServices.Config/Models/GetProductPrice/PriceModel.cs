//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Config.Models.GetProductPrice.Internal;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.GetProductPrice
{
    [ExcludeFromCodeCoverage]
    public class PriceModel
    {
        public SourceResponseModel Source { get; set; }
        public decimal? Cost { get; set; }
        public decimal? Dealer { get; set; }
        public decimal? List { get; set; }
        public string Provider { get; set; }
        public decimal? Purchase { get; set; }
        public decimal? BasePrice { get; set; }
        public decimal? BestPrice { get; set; }
        public DateTime? BestPriceExpiration { get; set; }
        public bool? BestPriceIncludesWebDiscount { get; set; }
        public IEnumerable<SaleResponseModel> Sale { get; set; }
        public IEnumerable<SaleResponseModel> QuantityBreaks { get; set; }
        public IEnumerable<SaleResponseModel> EndUserPromos { get; set; }
        public object Debug { get; set; }
        public string LineId { get; set; }

    }
}
