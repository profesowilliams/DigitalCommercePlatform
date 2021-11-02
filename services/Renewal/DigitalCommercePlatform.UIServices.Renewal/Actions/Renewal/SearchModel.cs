//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;

namespace DigitalCommercePlatform.UIServices.Renewal.Actions.Renewal
{
    public class SearchModel
    {
        public bool Details { get; set; }
        public string[] Type { get; set; }
        public string ResellerName { get; set; }
        public string ResellerId { get; set; }
        public DateTime? DueDateFrom { get; set; }
        public DateTime? DueDateTo { get; set; }
        public string EndUser { get; set; }
        public string EndUserEmail { get; set; }
        public string SortBy { get; set; }
        public bool SortAscending { get; set; }
        public string Page { get; set; }
        public string PageSize { get; set; }
        public bool WithPaginationInfo { get; set; }
        public string[] VendorName { get; set; }
        public string[] EndUserType { get; set; }
        public string[] ProgramName { get; set; }
        public string VendorQuoteID { get; set; }
        public string[] ContractId { get; set; }

    }
}
