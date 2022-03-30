//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Config.Models.Deals;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Configurations.Internal
{
    [ExcludeFromCodeCoverage]
    public class FindModel
    {
        public string Id { get; set; }
        public bool Details { get; set; }
        public string Type { get; set; }
        public string Manufacturer { get; set; }
        public string ResellerName { get; set; }
        public string ResellerId { get; set; }
        public DateTime? CreatedFrom { get; set; }
        public DateTime? CreatedTo { get; set; }
        public string EndUser { get; set; }
        public string SortBy { get; set; }
        public bool SortByAscending { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public bool WithPaginationInfo { get; set; }
        public string Name { get; set; }
        public IList<string> VendorName { get; set; }

    }

    [ExcludeFromCodeCoverage]
    public class FindSpaCriteriaModel
    {
        public string[] MfrPartNumbers { get; set; }
        public string[] ProductIds { get; set; }
        public string VendorBidNumber { get; set; }
        public string VendorName { get; set; }
        public string PricingLevel { get; set; }
        public string EndUserName { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
        public DateTime? UpdatedFrom { get; set; }
        public DateTime? UpdatedTo { get; set; }
        public bool Details { get; set; }
        public SortField? Sort { get; set; }
        public bool SortAscending { get; set; }
        public bool TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public bool EndUserSpaOnly { get; set; } = true;
        public bool Parallel { get; set; } = true;
        
    }

    public enum SortField
    {
        Description,
        EndUserName,
        ExpirationDate,
        VendorBidNumber,
        VendorName
    }

}
