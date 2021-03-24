using DigitalCommercePlatform.UIService.Browse.Model.Customer;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Summary;
using System.Collections.Generic;
using System.Threading.Tasks;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetCartDetails.GetCartHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails.GetCatalogHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetCustomerDetails.GetCustomerHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails.GetHeaderHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails.GetProductDetailsHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails.GetProductSummaryHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary.FindProductHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary.FindSummaryHandler;

namespace DigitalCommercePlatform.UIServices.Browse.Services
{
    public interface IBrowseService
    {
        Task<GetCartResponse> GetCartDetails(GetCartRequest request);

        Task<GetCatalogResponse> GetCatalogDetails(GetCatalogRequest request);

        Task<IEnumerable<CustomerModel>> GetCustomerDetails(GetCustomerRequest request);

        Task<GetHeaderResponse> GetHeader(GetHeaderRequest request);

        Task<IEnumerable<ProductModel>> FindProductDetails(GetProductRequest request);

        Task<SummaryDetails> FindSummaryDetails(FindSummaryRequest request);

        Task<GetProductDetailsResponse> GetProductDetails(GetProductDetailsRequest request);

        Task<SummaryModel> GetProductSummary(GetProductSummaryRequest request);
    }
}