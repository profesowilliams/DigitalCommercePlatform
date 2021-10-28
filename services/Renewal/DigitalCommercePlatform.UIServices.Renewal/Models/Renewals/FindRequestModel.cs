//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Renewal.Models.Renewals
{
    [ExcludeFromCodeCoverage]
    public class FindRequestModel
    {
        public List<string> Id { get; set; }
        public bool Details { get; set; } = true;
        public List<string> Type { get; set; }
        public string ResellerName { get; set; }
        public List<string> ResellerId { get; set; }
        public DateTime? CreatedFrom { get; set; }
        public DateTime? CreatedTo { get; set; }
        public DateTime? ExpiresFrom { get; set; }
        public DateTime? ExpiresTo { get; set; }
        public DateTime? DueDate { get; set; }
        public string EndUser { get; set; }
        public string EndUserEmail { get; set; }
        public string SortBy { get; set; }
        public bool SortAscending { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 25;
        public bool WithPaginationInfo { get; set; } = true;
        public List<string> VendorID { get; set; }
        public List<string> VendorName { get; set; }
        public List<string> DUNS { get; set; }
        public List<string> VATNumber { get; set; }
        public List<string> VendorAccountName { get; set; }
        public List<string> VendorAccountNumber { get; set; }
        public string EndUserType { get; set; }
        public string ProgramName { get; set; }
        public string ResellerPO { get; set; }
        public string ContractID { get; set; }
    }
}
