using DigitalCommercePlatform.UIService.Product.Models.Product.Internal;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIService.Product.Models.Product
{
    public class ProductModel
    {
        public SourceModel Source { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ShortDescription { get; set; }
        public IDictionary<string, AttributeGroupModel> AttributeGroups { get; set; }
        public IEnumerable<string> Accessories { get; set; }
        public string BaseUnitOfMeasure { get; set; }
        public ClassCodeModel ClassCode { get; set; }
        public SubclassCodeModel SubclassCode { get; set; }
        public MaterialGroupModel MaterialGroup { get; set; }
        public FamilyCodeModel FamilyCode { get; set; }
        public decimal NetWeight { get; set; }
        public decimal EstimatedGrossWeight { get; set; }
        public string WeightUnit { get; set; }
        public string GlobalManufacturer { get; set; }
        public string ManufacturerPartNumber { get; set; }
        public string MaterialType { get; set; }
        public IEnumerable<PlantModel> Plants { get; set; }
        public IEnumerable<WarehouseModel> Warehouses { get; set; }
        public IndicatorModel Indicators { get; set; }
        public IEnumerable<SalesOrganizationModel> SalesOrganizations { get; set; }
        public IEnumerable<CustomerPartModel> CustomerParts { get; set; }
        public List<SiteModel> Sites { get; set; }
    }
}