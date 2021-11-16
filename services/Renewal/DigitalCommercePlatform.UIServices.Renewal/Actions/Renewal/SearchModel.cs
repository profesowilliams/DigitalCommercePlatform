//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Renewal.Actions.Renewal
{
    [ExcludeFromCodeCoverage]
    public class SearchModel
    {
        public string Id { get; set; }
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
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 25;
        public bool WithPaginationInfo { get; set; } = false;
        public List<string> VendorName { get; set; }
        public string EndUserType { get; set; }
        public List<string> ProgramName { get; set; }
        public string VendorQuoteID { get; set; }
        public List<string> ContractId { get; set; }

    }
}
