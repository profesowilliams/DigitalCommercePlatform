//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Export.Models
{
    [ExcludeFromCodeCoverage]
    public class Annuity
    {
        public bool IsAnnuity { get; set; }

        public DateTime StartDate { get; set; }
        public int AutoRenewal { get; set; }
        public int Duration { get; set; }
        public string BillingFrequency { get; set; }
    }
}
