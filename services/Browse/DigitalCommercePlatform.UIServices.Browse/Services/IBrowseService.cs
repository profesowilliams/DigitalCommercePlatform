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

namespace DigitalCommercePlatform.UIServices.Browse.Services
{
    public interface IBrowseService
    {
        public Task<GetCartResponse> GetCartDetails(GetCartRequest request);

        public Task<GetCatalogResponse> GetCatalogDetails(GetCatalogRequest request);

        public Task<IEnumerable<CustomerModel>> GetCustomerDetails(GetCustomerRequest request);

        public Task<GetHeaderResponse> GetHeader(GetHeaderRequest request);

        Task<GetProductResponse> FindProductDetails(GetProductRequest request);

        Task<FindSummaryResponse> FindSummaryDetails(FindSummaryRequest request);

        Task<GetProductDetailsResponse> GetProductDetails(GetProductDetailsRequest request);

        Task<GetProductSummaryResponse> GetProductSummary(GetProductSummaryRequest request);
    }
}