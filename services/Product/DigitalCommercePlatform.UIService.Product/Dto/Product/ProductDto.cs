using DigitalCommercePlatform.UIService.Product.Dto.Product.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Product.Dto.Product
{
    [ExcludeFromCodeCoverage]
    public class ProductDto
    {
        public SourceDto Source { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ShortDescription { get; set; }
        public MainSpecificationDto MainSpecification { get; set; }
        public ExtendedSpecificationDto ExtendedSpecification { get; set; }
        public IDictionary<string, ImageDto> Images { get; set; }
        public IDictionary<string, LogoDto> Logos { get; set; }
        public IEnumerable<MarketingDto> Marketing { get; set; }
        public IEnumerable<AttributeDto> Attributes { get; set; }
        public string BaseUnitOfMeasure { get; set; }
        public MaterialGroupDto MaterialGroup { get; set; }
        public decimal NetWeight { get; set; }
        public decimal EstimatedGrossWeight { get; set; }
        public string WeightUnit { get; set; }
        public string GlobalManufacturer { get; set; }
        public string ManufacturerPartNumber { get; set; }
        public string MaterialType { get; set; }
        public IEnumerable<PlantDto> Plants { get; set; }
        public IEnumerable<WarehouseDto> Warehouses { get; set; }
        public IEnumerable<IndicatorDto> Indicators { get; set; }
        public IEnumerable<SalesOrganizationDto> SalesOrganizations { get; set; }
        public IEnumerable<CustomerPartDto> CustomerParts { get; set; }
        public IEnumerable<RelatedProductDto> RelatedProducts { get; set; }
        public IEnumerable<CategoryDto> Categories { get; set; }
    }
}