//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal;
using Newtonsoft.Json.Converters;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace DigitalCommercePlatform.UIServices.Search.Models.FullSearch
{
    public class ExportRequestModel
    {
        public string SearchString { get; set; }
        public string OrderLevel { get; set; } = "Commercial";
        public List<RefinementGroupRequestModel> RefinementGroups { get; set; }
        public SortRequestModel Sort { get; set; }
        public string[] Territories { get; set; }
        public string[] Countries { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public ExportFormatEnum ExportFormat { get; set; } = ExportFormatEnum.json;
    }

    public enum ExportFormatEnum
    {
        json = 0,
        csv = 1
    }
}