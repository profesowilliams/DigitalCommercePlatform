//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Renewal.Models.Renewals.Internal;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Azure;

namespace DigitalCommercePlatform.UIServices.Renewal.Models.Renewals
{
    [ExcludeFromCodeCoverage]
    public class SummaryResponseModel
    {
        public List<SummaryModel> Response { get; set; }
        public int Count { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class SummaryModel : BaseResponseModel
    {
        public SourceModel Source { get; set; }
        public ResellerModel Reseller { get; set; }
        public PartyModel EndUser { get; set; }
        public PartyModel ShipTo { get; set; }
        public DateTime Published { get; set; }
        public QuoteTypeValueModel AlternateIdentifier { get; set; }
        public NameModel VendorSalesRep { get; set; }
        public NameModel VendorSalesAssociate { get; set; }
        public List<AttributeModel> Attributes { get; set; }
        public string ProgramName { get; set; }
        public DateTime FirstAvailableOrderDate { get; set; }
        public DateTime LastOrderDate { get; set; }
        public string StatusText { get; set; }
        public decimal? AmountSaved { get; set; }
        public List<string> LinkedRenewals { get; set; }
        public string RenewalGroupId { get; set; }
        public DateTime DueDate { get; set; }
        public int? DueDays { get; set; }
        public bool? Incumbent { get; set; }
        public decimal? TotalReinstatementFeeCost { get; set; }
        public decimal? TotalReinstatementFeeSell { get; set; }
        public VendorModel Vendor { get; set; }
        public string EndUserType { get; set; }
        public string RenewedDuration { get; set; }
        public string AgreementNumber { get; set; }
        public string Support { get; set; }
        public List<OptionsModel> Options { get; set; }
        public bool? QuoteCurrent { get; set; }
        public RenewalInRuleModel Renewal { get; set; }
        public string ResellerPO { get; set; }
        public string VendorLogo { get; set; }
    }
}
