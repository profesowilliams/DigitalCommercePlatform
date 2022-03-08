//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Renewal.Dto.Renewals.Internal
{
    [ExcludeFromCodeCoverage]
    public class OptionsDto
    {
        public string Id { get; set; }
        public string AgreementNumber { get; set; }
        public string QuoteID { get; set; }
        public string ContractDuration { get; set; }
        public string Support { get; set; }
        public decimal? Total { get; set; }
        public string Currency { get; set; }
        public decimal? Save { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public bool? QuoteCurrent { get; set; }
    }
}
