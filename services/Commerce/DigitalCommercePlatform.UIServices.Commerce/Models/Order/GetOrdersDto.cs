//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Order
{
    [ExcludeFromCodeCoverage]
    public class GetOrdersDto
    {
        public string Id { get; set; }
        public string Reseller { get; set; }
        public string Vendor { get; set; }
        public DateTime? CreatedFrom { get; set; }
        public DateTime? CreatedTo { get; set; }
        public string Status { get; set; }
        public string SortBy { get; set; }
        public string SortDirection { get; set; } 
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public bool WithPaginationInfo { get; set; }
        public string OrderMethod { get; set; }
        public string ConfirmationNumber { get; set; }
    }
}
