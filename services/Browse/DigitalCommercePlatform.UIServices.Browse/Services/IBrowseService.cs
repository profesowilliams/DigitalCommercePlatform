using System.Collections.Generic;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIService.Browse.Model.Customer;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCartDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogueDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCustomerDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails;

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
