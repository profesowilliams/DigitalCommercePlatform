using System.Collections.Generic;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIService.Browse.Model.Customer;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetCartDetails.GetCartHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails.GetCatalogHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetCustomerDetails.GetCustomerHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails.GetHeaderHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary.FindProductHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary.FindSummaryHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails.GetProductDetailsHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails.GetProductSummaryHandler;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Summary;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product;

namespace DigitalCommercePlatform.UIServices.Browse.Services
{
    public interface IBrowseService
    {
        Task<GetCartResponse> GetCartDetails(GetCartRequest request);

        Task<GetCatalogResponse> GetCatalogDetails(GetCatalogRequest request);

        Task<IEnumerable<CustomerModel>> GetCustomerDetails(GetCustomerRequest request);

        Task<GetHeaderResponse> GetHeader(GetHeaderRequest request);

        Task<IEnumerable<ProductModel>> FindProductDetails(GetProductRequest request);

        Task<IEnumerable<SummaryModel>> FindSummaryDetails(FindSummaryRequest request);

        Task<GetProductDetailsResponse> GetProductDetails(GetProductDetailsRequest request);

        Task<GetProductSummaryResponse> GetProductSummary(GetProductSummaryRequest request);
    }
}