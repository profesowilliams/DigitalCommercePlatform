//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Quote
{
    [ExcludeFromCodeCoverage]
    public class Annuity
    {
        public bool IsAnnuity { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool AutoRenewal { get; set; }
        public int? AutoRenewalTerm { get; set; }
        public string Duration { get; set; }
        public string BillingFrequency { get; set; }
        public string InitialTerm { get; internal set; }
    }
}
