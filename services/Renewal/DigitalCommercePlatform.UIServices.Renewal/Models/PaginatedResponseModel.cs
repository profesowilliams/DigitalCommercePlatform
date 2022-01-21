//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Renewal.Models.RefinementGroup;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Renewal.Models
{
    [ExcludeFromCodeCoverage]
    public class PaginatedResponseModel<TList>
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int? TotalItems { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int? PageCount
        {
            get
            {
                if (PageSize.HasValue && TotalItems.HasValue)
                    return (int)Math.Ceiling((decimal)TotalItems / (decimal)PageSize);
                else
                    return null;
            }
        }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int? PageNumber { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int? PageSize { get; set; }

        public List<TList> Items { get; set; }
        public RefinementGroupsModel RefinementGroups { get; set; }
    }
}
