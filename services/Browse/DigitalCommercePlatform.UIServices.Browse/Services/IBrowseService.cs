//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary;
using DigitalCommercePlatform.UIServices.Browse.Dto.Product;
using DigitalCommercePlatform.UIServices.Browse.Dto.RelatedProduct;
using DigitalCommercePlatform.UIServices.Browse.Dto.Validate;
using DigitalCommercePlatform.UIServices.Browse.Models.Catalogue;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Summary;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Services
{
    public interface IBrowseService
    {
        Task<List<CatalogResponse>> GetCatalogDetails(GetCatalogHandler.Request request);

        Task<ProductData> FindProductDetails(FindProductHandler.Request request);

        Task<SummaryDetails> FindSummaryDetails(FindSummaryHandler.Request request);

        Task<IEnumerable<ProductDto>> GetProductDetails(GetProductDetailsHandler.Request request);

        Task<List<CatalogResponse>> GetProductCatalogDetails(GetProductCatalogHandler.Request request);

        Task<RelatedProductResponseDto> GetRelatedProducts(RelatedProductRequestDto request);

        Task<IEnumerable<ValidateDto>> ValidateProductTask(IEnumerable<string> productIds);
    }
}