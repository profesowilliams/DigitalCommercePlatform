using Newtonsoft.Json;
using System;

namespace DigitalCommercePlatform.UIServices.Quote.Models
{
    public class TdQuoteForGrid
    {
        [JsonProperty("Source.OriginId")]
        public string SourceOriginId { get; set; }
        [JsonProperty("Reference")]
        public string Reference { get; set; }
        [JsonProperty("EndUserName")]
        public string EndUserName { get; set; }
        [JsonProperty("DealId")]
        public string DealId { get; set; }
        [JsonProperty("Price")]
        public string Price { get; set; }
        [JsonProperty("Currency")]
        public string Currency { get; set; }
        [JsonProperty("Created")]
        public DateTime Created { get; set; }
        [JsonProperty("Expiry")]
        public DateTime Expiry { get; set; }
        [JsonProperty("Creator")]
        public string Creator { get; set; }
        [JsonProperty("Action")]
        public string Action { get; set; }
    }
}
