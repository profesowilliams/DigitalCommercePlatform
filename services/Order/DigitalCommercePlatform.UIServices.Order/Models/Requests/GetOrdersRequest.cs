using System;

namespace DigitalCommercePlatform.UIServices.Order.Models.Requests
{
    public class GetOrdersRequest
    {
        public string Id { get; set; }
        public string Reseller { get; set; }
        public DateTime? CreatedFrom { get; set; }
        public DateTime? CreatedTo { get; set; }
        public string OrderBy { get; set; }
        public bool SortAscending { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}
