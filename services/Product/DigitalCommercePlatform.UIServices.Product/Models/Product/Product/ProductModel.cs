//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Product.Models.Product.Product.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Product.Models.Product.Product
{
    [ExcludeFromCodeCoverage]
    public class ProductData
    {
        public ProductModel[] Data { get; set; }
    }
    public class ProductModel
    {
        public SourceModel Source { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ShortDescription { get; set; }
        public IEnumerable<MainSpecificationModel> MainSpecifications { get; set; }
        public IEnumerable<ExtendedSpecificationModel> ExtendedSpecifications { get; set; }
        public IDictionary<string, IEnumerable<ImageModel>> Images { get; set; }
        public IDictionary<string, IEnumerable<LogoModel>> Logos { get; set; }
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
        public IEnumerable<PropertyModel> Properties { get; set; }
        public IEnumerable<MarketingModel> MarketAssignments { get; set; }
        public IEnumerable<AliasModel> Aliases { get; set; }
        public PriceModel Price { get; set; }
    }
}
