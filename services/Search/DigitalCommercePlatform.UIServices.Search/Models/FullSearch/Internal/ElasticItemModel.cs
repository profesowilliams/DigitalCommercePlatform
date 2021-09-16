//2021 (c) Tech Data Corporation -. All Rights Reserved.

using Newtonsoft.Json;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal
{
    [ExcludeFromCodeCoverage]
    public class ElasticItemModel
    {
        public string System { get; set; }
        public string Id { get; set; }
        public string ManufacturerPartNumber { get; set; }

        [JsonProperty(PropertyName = "UPC_EAN")]
        public string UpcEan { get; set; }

        public string Name { get; set; }
        public string DisplayName { get; set; }
        public string GlobalManufacturer { get; set; }
        public string ShortDescription { get; set; }
        public string LongDescription { get; set; }
        public string ProductType { get; set; }
        public int TotalStock { get; set; }
        public string SalesOrganization { get; set; }
        public SalesOrgStocksModel Stock { get; set; }
        public List<IndicatorModel> Indicators { get; set; }
        public List<ProductNoteModel> ProductNotes { get; set; }
        public PriceModel Price { get; set; }
        public Dictionary<string, List<ImageModel>> ProductImages { get; set; }
        public List<AttributeModel> Attributes { get; set; }
        public List<CategoryTypeModel> Categories { get; set; }
        public List<MarketModel> MarketAssignments { get; set; }
        public List<PropertyModel> Properties { get; set; }
        public List<AliasModel> Aliases { get; set; }
        public List<MainSpecificationModel> MainSpecifications { get; set; }
        public List<TerritoryModel> Territories { get; set; }
        public bool IsAuthorized { get; set; }
    }
}
