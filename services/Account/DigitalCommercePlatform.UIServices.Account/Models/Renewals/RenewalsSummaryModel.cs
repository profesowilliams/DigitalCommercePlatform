using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Renewals
{
    [ExcludeFromCodeCoverage]
    public class RenewalsSummaryModel
    {
        public int NinetyDays { get; set; }
        public int ThirtyDays { get; set; }
        public int Today { get; set; }
        public int SixtyDays { get; set; }
    }
}
