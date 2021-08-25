//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalFoundation.Common.Models;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Common
{
    [ExcludeFromCodeCoverage]
    public class PaginatedResponse<T> : Paginated, IPaginatedResponse<T> where T : class
    {
        public long? TotalItems { get; set; }
        public IEnumerable<T> Items { get; set; }
        public long? PageCount { get; set; }

        public PaginatedResponse(FindResponse<T> findResponse, IPaginated request)
        {
            if (findResponse == null)
                return;

            Items = findResponse.Data;
            TotalItems = findResponse.Count;

            PageNumber = request.PageNumber;
            PageSize = request.PageSize;

            PageCount = (findResponse.Count + request.PageSize - 1) / request.PageSize;
        }
    }

    public interface IPaginatedResponse<T> : IPaginated where T : class
    {
        long? TotalItems { get; set; }
        IEnumerable<T> Items { get; set; }
        public long? PageCount { get; set; }
    }
}
