//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Renewal.Actions.Renewal
{
    [ExcludeFromCodeCoverage]
    public class RefinementRequest
    {
        public string Type { get; set; }
        public string ResellerId { get; set; }
        public string ResellerName { get; set; }
        public bool Details { get; set; } = false;
        public int PageSize { get; set; } = 200;
        public int Page { get; set; } = 1;
        public string SortBy { get; set; }
        public bool SortByAscending { get; set; }
    }
}
