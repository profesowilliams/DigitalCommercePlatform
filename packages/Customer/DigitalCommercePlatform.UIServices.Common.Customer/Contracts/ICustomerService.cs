using DigitalCommercePlatform.UIServices.Common.Customer.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Common.Customer.Contracts
{
    public interface ICustomerService
    {
        Task<IEnumerable<AddressDetails>> GetAddressAsync(string criteria, bool ignoreSalesOrganization);
        Task<IEnumerable<CustomerModel>> GetCustomerDetails();
    }
}