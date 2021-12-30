//2021 (c) Tech Data Corporation -. All Rights Reserved.

using Newtonsoft.Json;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal
{
    [ExcludeFromCodeCoverage]
    public class ElasticItemDto
    {
        public List<AliasDto> Aliases { get; set; }
        public List<AttributeDto> Attributes { get; set; }
        public List<CategoryTypeDto> Categories { get; set; }
        public string CNETManufacturer { get; set; }
        public string DisplayName { get; set; }
        public string GlobalManufacturer { get; set; }
        public string Id { get; set; }
        public List<IndicatorDto> Indicators { get; set; }
        public bool IsAuthorized { get; set; }
        public string LongDescription { get; set; }
        public List<MainSpecificationDto> MainSpecifications { get; set; }
        public string ManufacturerPartNumber { get; set; }
        public List<MarketDto> MarketAssignments { get; set; }
        public string Name { get; set; }
        public PriceDto Price { get; set; }
        public Dictionary<string, List<ImageDto>> ProductImages { get; set; }
        public List<ProductNoteDto> ProductNotes { get; set; }
        public string ProductType { get; set; }
        public List<PropertyDto> Properties { get; set; }
        public string SalesOrganization { get; set; }
        public string ShortDescription { get; set; }
        public SalesOrgStocksDto Stock { get; set; }
        public string System { get; set; }
        public List<TerritoryDto> Territories { get; set; }

        [JsonProperty(PropertyName = "UPC_EAN")]
        public string UpcEan { get; set; }
    }
}