using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.DTO
{
    [ExcludeFromCodeCoverage]
    public class PaginatedResponse<T> : Response<T>
    {
        public int PageNumber { get; set; }

        public int? TotalPages
        {
            get
            {
                if (PageSize > 0 && TotalRecords.HasValue)
                    return (int)Math.Ceiling((decimal)TotalRecords / PageSize);
                else
                    return null;
            }
        }

        public int PageSize { get; set; }
        public long? TotalRecords { get; set; }

        public PaginatedResponse()
        { }

        public PaginatedResponse(T returnObject) : base(returnObject)
        { }

        public PaginatedResponse(T returnObject, int page, int pageSize, long? totalRecords) : base(returnObject)
        {
            PageNumber = page;
            PageSize = pageSize;
            TotalRecords = totalRecords;
        }
    }
}