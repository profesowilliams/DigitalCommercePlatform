//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal.Product
{
    [ExcludeFromCodeCoverage]
    public class ProductData
    {
        public ProductsModel[] Data { get; set; }
    }
    [ExcludeFromCodeCoverage]
    public class ProductsModel
    {
        public SourceModel Source { get; set; }
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public string Description { get; set; }
        public string ShortDescription { get; set; }
        public IDictionary<string, IEnumerable<ImageModel>> Images { get; set; }
        public IDictionary<string, IEnumerable<LogoModel>> Logos { get; set; }
        public string GlobalManufacturer { get; set; }
        public string ManufacturerPartNumber { get; set; }
        public PriceModel Price { get; set; }

    }
    [ExcludeFromCodeCoverage]
    public class ImageModel
    {
        public string Id { get; set; }
        public string Url { get; set; }
        public string Type { get; set; }
        public string Angle { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class PriceModel
    {
        public decimal? ListPrice { get; set; }
        public decimal? UnpromotedPrice { get; set; }
        public decimal? BestPrice { get; set; }
        public List<PromoPrice> PromoPrices { get; set; }
        public List<VolumePricingModel> VolumePricing { get; set; }
    }
    [ExcludeFromCodeCoverage]
    public class PromoPrice
    {
        public decimal PromoPriceValue { get; set; }
        public decimal PromoAmount { get; set; }
        public DateTime? PromoExpirationDate { get; set; }
        public string Type { get; set; }
        public int? MinQuantity { get; set; }
    }
    [ExcludeFromCodeCoverage]
    public class VolumePricingModel
    {
        public decimal Price { get; set; }
        public int? MinQuantity { get; set; }
        public DateTime? ExpirationDate { get; set; }
    }


    [ExcludeFromCodeCoverage]
    public class LogoModel
    {
        public string Id { get; set; }
        public string Url { get; set; }
    }
}
