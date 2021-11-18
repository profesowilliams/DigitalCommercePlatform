//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Renewal.Dto.Renewals.Internal;
using DigitalFoundation.App.Services.Renewal.Dto.CoreQuote.Internal;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Renewal.Dto.Renewals
{
    [ExcludeFromCodeCoverage]
    public class DetailedDto : SummaryDto
    {
        public DateTime Published { get; set; }
        public TypeValueDto AlternateIdentifier { get; set; }
        public NameDto VendorSalesRep { get; set; }
        public NameDto VendorSalesAssociate { get; set; }
        public List<ItemDto> Items { get; set; }
        public List<AttributeDto> Attributes { get; set; }
        public bool? QuoteCurrent { get; set; }
        public DateTime FirstAvailableOrderDate { get; set; }
        public DateTime LastOrderDate { get; set; }
        public string StatusText { get; set; }
        public decimal? AmountSaved { get; set; }
        public List<string> LinkedRenewals { get; set; }
        public string RenewalGroupId { get; set; }
        public DateTime DueDate { get; set; }
        public string DueDays { get; set; }
        public bool? Incumbent { get; set; }
        public decimal? TotalReinstatementFeeCost { get; set; }
        public decimal? TotalReinstatementFeeSell { get; set; }
        public string AgreementNumber { get; set; }
        public string Support { get; set; }
    }
}
