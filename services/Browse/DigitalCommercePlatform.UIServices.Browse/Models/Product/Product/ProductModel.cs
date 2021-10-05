//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product.Internal;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Product.Product
{
    [ExcludeFromCodeCoverage]
    public class ProductModel
    {
        public string Id { get; set; }
        public string MaterialType { get; set; }
        public string DisplayName { get; set; }
        public string Description { get; set; }
        public string SubstituteMaterialNumber { get; set; }
        public string ManufacturerPartNumber { get; set; }

        [JsonProperty("UPC_EAN")]
        public string UPC_EAN { get; set; }

        public string Status { get; set; }
        public IEnumerable<ImageModel> Images { get; set; }
        public PriceModel Price { get; set; }
        public AuthorizationModel Authorization { get; set; }
        public IEnumerable<NoteModel> Notes { get; set; }

        [JsonProperty("indicators")]
        public IndicatorFlags IndicatorsFlags { get; set; }

        public ProductSpecificationsModel Specifications { get; set; }
        public StockModel Stock { get; set; }
        public string MarketingDescription { get; set; } // to fill
        public string[] ProductFeatures { get; set; } // to fill
        public string[] KeySellingPoints { get; set; } // to fill
        public string[] WhatsInTheBox { get; set; } // to fill
        public object Documents { get; set; } // to fill
    }
}