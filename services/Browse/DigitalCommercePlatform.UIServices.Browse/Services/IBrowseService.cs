//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIService.Browse.Model.Customer;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCartDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails;
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
        Task<GetCartHandler.Response> GetCartDetails(GetCartHandler.Request request);

        Task<List<CatalogResponse>> GetCatalogDetails(GetCatalogHandler.Request request);

        Task<IEnumerable<CustomerModel>> GetCustomerDetails();

        Task<GetHeaderHandler.Response> GetHeader(GetHeaderHandler.Request request);

        Task<ProductData> FindProductDetails(FindProductHandler.Request request);

        Task<SummaryDetails> FindSummaryDetails(FindSummaryHandler.Request request);

        Task<IEnumerable<ProductDto>> GetProductDetails(GetProductDetailsHandler.Request request);

        Task<SummaryModel> GetProductSummary(GetProductSummaryHandler.Request request);

        Task<List<CatalogResponse>> GetProductCatalogDetails(GetProductCatalogHandler.Request request);

        Task<RelatedProductResponseDto> GetRelatedProducts(RelatedProductRequestDto request);

        Task<IEnumerable<ValidateDto>> ValidateProductTask(IEnumerable<string> productIds);
    }
}
