//2021 (c) Tech Data Corporation -. All Rights Reserved.
using Newtonsoft.Json;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Product.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class IndicatorFlags
    {
        // The suffix "Flag" was added to avoid using C# reserved keywords like @new, @virtual
        [JsonProperty("new")]
        public bool NewFlag { get; set; }
        [JsonProperty("returnable")]
        public bool ReturnableFlag { get; set; }
        [JsonProperty("endUserRequired")]
        public bool EndUserRequiredFlag { get; set; }
        [JsonProperty("refurbished")]
        public bool RefurbishedFlag { get; set; }
        [JsonProperty("dropShip")]
        public bool DropShipFlag { get; set; }
        [JsonProperty("warehouse")]
        public bool WarehouseFlag { get; set; }
        [JsonProperty("virtual")]
        public bool VirtualFlag { get; set; }
        [JsonIgnore] // This field is used in the field ProductModel.Status
        public string DisplayStatus { get; set; }
    }
}