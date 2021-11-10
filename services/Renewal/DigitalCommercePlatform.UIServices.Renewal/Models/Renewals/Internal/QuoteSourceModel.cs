//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Renewal.Models.Renewals.Internal
{
    [ExcludeFromCodeCoverage]
    public class QuoteSourceModel :SourceModel
    {
        public string SalesOrg { get; set; }
        public string TargetSystem { get; set; }
        public string Key { get; set; }
    }
}
