//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models
{
    [ExcludeFromCodeCoverage]
    public class AccountDetails
    {
        public string CustomerNumber { get; set; }
        public string MappedAccount { get; set; }
        public string BuyMethod { get; set; }
        public bool? IsExclusive { get; set; }
        public string BeGeoId { get; set; }
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string CustomerName { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class AccountDetailsFindModel
    {
        public string Value { get; set; }
        public string Type { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class ProductResult
    {
        public string ProductLongDescription { get; set; }
        public ArticleResult Article { get; set; }
    }
    [ExcludeFromCodeCoverage]
    public class ArticleResult
    {
        public string DisplayDescription { get; set; }
        public decimal MSRP { get; set; }
        public string TechDataPartNumber { get; set; }
        public string ManufacturerPartNumber { get; set; }
}

    [ExcludeFromCodeCoverage]
    public class Response
    {
        public List<ProductResult> Products { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class GetProductRequest
    {
        public string MaterialNumber { get; set; }
        public string ManufacturerPartNumber { get; set; }
    }
    [ExcludeFromCodeCoverage]
    public class ShopProductRequest
    {
        public List<GetProductRequest> Products { get; set; }
    }
}
