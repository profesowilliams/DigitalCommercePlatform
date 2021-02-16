using System.Collections.Generic;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIService.Browse.Model.Customer;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetCartDetails.GetCartHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogueDetails.GetCatalogueHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetCustomerDetails.GetCustomerHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails.GetHeaderHandler;

namespace DigitalCommercePlatform.UIServices.Browse.Services
{
    public interface IBrowseService
    {
        public Task<GetCartResponse> GetCartDetails(GetCartRequest request);

        public Task<GetCatalogueResponse> GetCatalogueDetails(GetCatalogueRequest request);

        public Task<IEnumerable<CustomerModel>> GetCustomerDetails(GetCustomerRequest request);

        public Task<GetHeaderResponse> GetHeader(GetHeaderRequest request);
    }
}
