//2022 (c) TD Synnex - All Rights Reserved.

using DigitalCommercePlatform.UIServices.Browse.Dto.Product.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.Product
{
    [ExcludeFromCodeCoverage]
    public class ProductDto
    {
        public SourceDto Source { get; set; }
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public string Description { get; set; }
        public string ShortDescription { get; set; }
        public string CNETMappedId { get; set; }
        public IEnumerable<MainSpecificationDto> MainSpecifications { get; set; }
        public IEnumerable<ExtendedSpecificationDto> ExtendedSpecifications { get; set; }
        public IDictionary<string, IEnumerable<ImageDto>> Images { get; set; }
        public IDictionary<string, IEnumerable<LogoDto>> Logos { get; set; }
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
        public string UPC { get; set; }
        public string CommodityCode { get; set; }
        public string MaterialCountryOfOrgin { get; set; }
        public string MultiLayerSerialNumberProfile { get; set; }
        public string PurchaserPhone { get; set; }
        public string SerialNumberProfile { get; set; }
        public string SubstituteMaterialNumber { get; set; }
        public VendorDto Vendor { get; set; }
        public StockDto Stock { get; set; }
        public IEnumerable<PlantDto> Plants { get; set; }
        public IEnumerable<WarehouseDto> Warehouses { get; set; }
        public IEnumerable<IndicatorDto> Indicators { get; set; }
        public IEnumerable<SalesOrganizationDto> SalesOrganizations { get; set; }
        public IEnumerable<CustomerPartDto> CustomerParts { get; set; }
        public IEnumerable<RelatedProductDto> RelatedProducts { get; set; }
        public IEnumerable<CategoryDto> Categories { get; set; }
        public IEnumerable<MarketDto> MarketAssignments { get; set; }
        public IEnumerable<AliasDto> Aliases { get; set; }
        public PriceDto Price { get; set; }
        public IEnumerable<TaxClassificationDto> TaxClassifications { get; set; }
    }
}