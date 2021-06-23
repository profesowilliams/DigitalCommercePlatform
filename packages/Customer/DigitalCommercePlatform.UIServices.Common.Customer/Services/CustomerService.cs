using DigitalCommercePlatform.UIServices.Common.Customer.Contracts;
using DigitalCommercePlatform.UIServices.Common.Customer.Models;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Common.Customer.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly string _appCustomerURL;
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly IUIContext _uiContext;

        public CustomerService(IOptions<AppSettings> options, IMiddleTierHttpClient middleTierHttpClient, IUIContext uiContext)
        {
            if (options == null) { throw new ArgumentNullException(nameof(options)); }
            _appCustomerURL = options.Value?.TryGetSetting("App.Customer.Url") ?? throw new InvalidOperationException("App.Customer.Url is missing from AppSettings");

            _middleTierHttpClient = middleTierHttpClient ?? throw new ArgumentNullException(nameof(middleTierHttpClient));
            _uiContext = uiContext ?? throw new ArgumentNullException(nameof(uiContext));
        }

        public async Task<IEnumerable<AddressDetails>> GetAddressAsync(string criteria, bool ignoreSalesOrganization)
        {
            var customerId = _uiContext.User.ActiveCustomer?.CustomerNumber;
            var customerURL = _appCustomerURL.BuildQuery("Id=" + customerId);
            var response = await _middleTierHttpClient.GetAsync<IEnumerable<AddressDetails>>(customerURL);
            if (response.Any())
            {
                // Current requirement is if system is 2 to take the 0100 as sales org
                var salesOrg = _uiContext.User.ActiveCustomer?.System == "2" ? "0100" : string.Empty;

                if (response.FirstOrDefault().addresses.Any() && criteria != "ALL" && ignoreSalesOrganization == false)
                    response.FirstOrDefault().addresses = response.FirstOrDefault().addresses.Where(t => t.AddressType.ToUpper() == criteria & t.SalesOrganization == salesOrg).ToList();
                else if (response.FirstOrDefault().addresses.Any() && criteria != "ALL" && ignoreSalesOrganization == true)
                    response.FirstOrDefault().addresses = response.FirstOrDefault().addresses.Where(t => t.AddressType.ToUpper() == criteria).ToList();
                else if (response.FirstOrDefault().addresses.Any() && ignoreSalesOrganization == false)
                    response.FirstOrDefault().addresses = response.FirstOrDefault().addresses.Where(t => t.SalesOrganization == salesOrg).ToList();
                else
                    return response;
            }
            return response;
        }

        public async Task<IEnumerable<CustomerModel>> GetCustomerDetails()
        {
            var customerId = _uiContext.User.Customers.FirstOrDefault();
            var CustomerURL = _appCustomerURL.BuildQuery("Id=" + customerId);
            var getCustomerDetailsResponse = await _middleTierHttpClient.GetAsync<IEnumerable<CustomerModel>>(CustomerURL);
            return getCustomerDetailsResponse;
        }
    }
}
