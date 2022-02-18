//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Config.Models.Common;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Configurations
{
    [ExcludeFromCodeCoverage]
    public class FindModel : Paginated
    {
        public string Id { get; set; }
        public bool Details { get; set; }
        public ConfigType? ConfigurationType { get; set; }
        public IList<string> Type { get; set; }
        public string Manufacturer { get; set; }
        public string ResellerName { get; set; }
        public string ResellerId { get; set; }
        public DateTime? CreatedFrom { get; set; }
        public DateTime? CreatedTo { get; set; }
        public string EndUser { get; set; }
        public string SortBy { get; set; }
        public SortDirection SortDirection { get; set; }
        public string ConfigName { get; set; }
        public string ConfigId { get; set; }
        public IList<string> VendorName { get; set; }
    }

    public enum ConfigType
    {
        All = 0,
        Estimate = 1,
        Renewal = 2,
        RenewalQuote = 3,
        VendorQuote = 4,
        EstimateAndVendor=5,
        EstimateAndRenewal=6,
        VendorAndRenewal=7,
        Deal=8,
        EstimateAndVendorAndDeal=9,
    }
}
