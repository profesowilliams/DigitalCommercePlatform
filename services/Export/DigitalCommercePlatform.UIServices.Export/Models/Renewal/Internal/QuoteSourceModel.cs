//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Export.Models.Renewal.Internal
{
    [ExcludeFromCodeCoverage]
    public class QuoteSourceModel : SourceModel
    {
        public string SalesOrg { get; set; }
        public string TargetSystem { get; set; }
        public string Key { get; set; }
    }
}
