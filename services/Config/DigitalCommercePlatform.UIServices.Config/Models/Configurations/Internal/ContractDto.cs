//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Configurations.Internal
{
    [ExcludeFromCodeCoverage]
    public class ContractDto
    {
        public string Id { get; set; }
        public string Status { get; set; }
        public string Duration { get; set; }
        public string RenewedDuration { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? NewAgreementStartDate { get; set; }
        public DateTime? NewAgreementEndDate { get; set; }
        public DateTime? NewUsagePeriodStartDate { get; set; }
        public DateTime? NewUsagePeriodEndDate { get; set; }
        public string SupportLevel { get; set; }
        public string ServiceLevel { get; set; }
        public DateTime? UsagePeriod { get; set; }
        public int? RenewalTerm { get; set; }
    }
}
