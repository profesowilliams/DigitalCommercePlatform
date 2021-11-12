//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Configurations.Internal
{
    [ExcludeFromCodeCoverage]
    public class QuoteDto
    {
        public string Id { get; set; }
        public string SalesOrg { get; set; }
        public string System { get; set; }
    }
}