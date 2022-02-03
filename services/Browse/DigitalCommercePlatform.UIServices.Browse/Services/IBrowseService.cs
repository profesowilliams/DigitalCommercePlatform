//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary;
using DigitalCommercePlatform.UIServices.Browse.Dto.Product;
using DigitalCommercePlatform.UIServices.Browse.Dto.RelatedProduct;
using DigitalCommercePlatform.UIServices.Browse.Dto.Validate;
using DigitalCommercePlatform.UIServices.Browse.Models.Catalog;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Services
{
    public interface IBrowseService
    {
        Task<ProductData> FindProductDetails(FindProductHandler.Request request);

        Task<IEnumerable<ProductDto>> GetProductDetails(GetProductDetailsHandler.Request request);

        Task<List<CatalogResponse>> GetProductCatalogDetails(GetProductCatalogHandler.Request request);

        Task<RelatedProductResponseDto> GetRelatedProducts(RelatedProductRequestDto request);

        Task<IEnumerable<ValidateDto>> ValidateProductTask(IEnumerable<string> productIds);

        Task<List<CatalogResponse>> GetCatalogUsingDF(ProductCatalogRequest request);
    }
}