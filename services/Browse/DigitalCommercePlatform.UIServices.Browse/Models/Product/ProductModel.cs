using DigitalCommercePlatform.UIService.Browse.Models.Product.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Browse.Models.Product
{
    [ExcludeFromCodeCoverage]
    public class ProductModel
    {
        public SourceModel Source { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ShortDescription { get; set; }
        public MainSpecificationModel MainSpecification { get; set; }
        public ExtendedSpecificationModel ExtendedSpecification { get; set; }
        public IDictionary<string, ImageModel> Images { get; set; }
        public IDictionary<string, LogoModel> Logos { get; set; }
        public IEnumerable<MarketingModel> Marketing { get; set; }
        public IEnumerable<AttributeModel> Attributes { get; set; }
        public string BaseUnitOfMeasure { get; set; }
        public MaterialGroupModel MaterialGroup { get; set; }
        public decimal NetWeight { get; set; }
        public decimal EstimatedGrossWeight { get; set; }
        public string WeightUnit { get; set; }
        public string GlobalManufacturer { get; set; }
        public string ManufacturerPartNumber { get; set; }
        public string MaterialType { get; set; }
        public IEnumerable<PlantModel> Plants { get; set; }
        public IEnumerable<WarehouseModel> Warehouses { get; set; }
        public IEnumerable<IndicatorModel> Indicators { get; set; }
        public IEnumerable<SalesOrganizationModel> SalesOrganizations { get; set; }
        public IEnumerable<CustomerPartModel> CustomerParts { get; set; }
        public IEnumerable<RelatedProductModel> RelatedProducts { get; set; }
        public IEnumerable<CategoryModel> Categories { get; set; }
    }
}