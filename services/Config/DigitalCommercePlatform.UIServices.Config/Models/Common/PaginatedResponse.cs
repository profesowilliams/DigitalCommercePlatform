//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Common
{
    [ExcludeFromCodeCoverage]
    public class PaginatedResponse<T> : IPaginatedResponse<T> where T : class
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public long TotalItems { get; set; }

        public IEnumerable<T> Items { get; set; }
    }

    public interface IPaginatedResponse<T> : IPaginated where T : class
    {
        long TotalItems { get; set; }
        IEnumerable<T> Items { get; set; }
    }
}
