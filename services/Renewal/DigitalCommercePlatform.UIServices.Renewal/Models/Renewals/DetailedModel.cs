//2021 (c) Tech Data Corporation -. All Rights Reserved.

using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIServices.Renewal.Models.Renewals.Internal;

namespace DigitalCommercePlatform.UIServices.Renewal.Models.Renewals
{
    [ExcludeFromCodeCoverage]
    public class DetailedModel:SummaryModel
    {
        public DateTime Published { get; set; }
        public QuoteTypeValueModel AlternateIdentifier { get; set; }
        public NameModel VendorSalesRep { get; set; }
        public NameModel VendorSalesAssociate { get; set; }
        public List<ItemModel> Items { get; set; }
        public List<AttributeModel> Attributes { get; set; }
        public string ProgramName { get; set; }
        public bool? QuoteCurrent { get; set; }
        public DateTime FirstAvailableOrderDate { get; set; }
        public DateTime LastOrderDate { get; set; }
        public string StatusText { get; set; }
        public decimal? AmountSaved { get; set; }
        public List<string> LinkedRenewals { get; set; }
        public string RenewalGroupId { get; set; }
        public DateTime DueDate { get; set; }
        public bool? Incumbent { get; set; }
        public decimal? TotalReinstatementFeeCost { get; set; }
        public decimal? TotalReinstatementFeeSell { get; set; }
    }
}
