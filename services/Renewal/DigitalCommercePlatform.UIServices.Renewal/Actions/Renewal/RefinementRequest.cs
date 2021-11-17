//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Renewal.Actions.Renewal
{
    [ExcludeFromCodeCoverage]
    public class RefinementRequest
    {
        public string SourceType { get; set; }
        public string ResellerId { get; set; }
        public string ResellerName { get; set; }
        public bool Details { get; set; } = false;
        public int PageSize { get; set; } = 25;
        public int Page { get; set; } = 1;
    }
}
