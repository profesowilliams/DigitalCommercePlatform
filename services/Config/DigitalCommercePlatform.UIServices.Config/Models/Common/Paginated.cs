using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Common
{
    [ExcludeFromCodeCoverage]
    public class Paginated : IPaginated
    {
        public int PageNumber { get; set ; }
        public int PageSize { get; set; }
    }

    public interface IPaginated
    {
        int PageNumber { get; set; }
        int PageSize { get; set; }
    }
}
