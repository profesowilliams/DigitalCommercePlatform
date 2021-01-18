using DigitalCommercePlatform.UIService.Product.Dto.Product.Internal;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIService.Product.Dto.Product
{
    public class ProductDto
    {        
        public SourceDto Source { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ShortDescription { get; set; }
        public IDictionary<string, AttributeGroupDto> AttributeGroups { get; set; }
        public IEnumerable<string> Accessories { get; set; }
        public string BaseUnitOfMeasure { get; set; }
        public ClassCodeDto ClassCode { get; set; }
        public SubclassCodeDto SubclassCode { get; set; }
        public MaterialGroupDto MaterialGroup { get; set; }
        public FamilyCodeDto FamilyCode { get; set; }
        public decimal NetWeight { get; set; }
        public decimal EstimatedGrossWeight { get; set; }
        public string WeightUnit { get; set; }
        public string GlobalManufacturer { get; set; }
        public string ManufacturerPartNumber { get; set; }
        public string MaterialType { get; set; }
        public IEnumerable<PlantDto> Plants { get; set; }
        public IEnumerable<WarehouseDto> Warehouses { get; set; }
        public IndicatorDto Indicators { get; set; }
        public IEnumerable<SalesOrganizationDto> SalesOrganizations { get; set; }
        public IEnumerable<CustomerPartDto> CustomerParts { get; set; }
        public List<SiteDto> Sites { get; set; }
    }
}