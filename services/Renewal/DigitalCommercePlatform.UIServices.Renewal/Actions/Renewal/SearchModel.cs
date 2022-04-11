//2022 (c) Tech Data Corporation -. All Rights Reserved.
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
        public List<string> ResellerId { get; set; }
        public DateTime? DueDateFrom { get; set; }
        public DateTime? DueDateTo { get; set; }
        public string EndUser { get; set; }
        public string EndUserEmail { get; set; }
        public List<string> SortBy { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 25;
        public bool WithPaginationInfo { get; set; } = false;
        public List<string> VendorName { get; set; }
        public List<string> EndUserType { get; set; }
        public List<string> ProgramName { get; set; }
        public string VendorQuoteID { get; set; }
        public string ContractID { get; set; }
        public string SessionId { get; set; }
        public List<string> DUNS { get; set; }
        public List<string> VendorID { get; set; }
        public List<string> VATNumber { get; set; }
        public List<string> VendorAccountName { get; internal set; }
        public List<string> VendorAccountNumber { get; set; }
        public DateTime? CreatedFrom { get; set; }
        public DateTime? CreatedTo { get; set; }
        public DateTime? ExpiresFrom { get; set; }
        public DateTime? ExpiresTo { get; set; }
        public string SerialNumber { get; set; }
        public string Instance { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class PartialSearchProps
    {
        public List<string> ResellerId { get; set; }
        public string ResellerName { get; set; }
        public string ResellerPO { get; set; }
        public string EndUser { get; set; }
        public string EndUserEmail { get; set; }
        public string ContractID { get; set; }
        public string Instance { get; set; }
        public string SerialNumber { get; set; }
    }
}