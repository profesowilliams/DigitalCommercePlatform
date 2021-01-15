using DigitalCommercePlatform.UIService.Customer.Models.AppServices.Customer;
using DigitalCommercePlatform.UIService.Customer.Services.Abstract;
using DigitalCommercePlatform.UIServices.Customer.Actions.Customer.Get;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Customer.Services
{
    public class AppServiceConnector : IAppServiceConnector
    {
        //private const string _appServiceGetCustomerUrl = "https://service.dit.df.svc.us.tdworldwide.com/app-customer/get";
        private const string _appServiceGetCustomerUrl = "https://eastus-dit-service.dc.tdebusiness.cloud/app-customer/v1/12";
        private readonly IHttpClientFactory _clientFactory;
        private readonly ILogger _logger;

        public AppServiceConnector(IHttpClientFactory clientFactory, ILoggerFactory loggerFactory)
        {
            _clientFactory = clientFactory;
            _logger = loggerFactory.CreateLogger<AppServiceConnector>();
        }

        public async Task<CustomerModel> GetCustomerAsync(GetCustomerRequest request)
        {
            //var client = _clientFactory.CreateClient("AppServicesCustomerClient");
            var client = _clientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "0006J3sbx8uBx4woZEuPnX3yxkhE");
            client.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
            client.DefaultRequestHeaders.Add("Accept-Language", "en-us");
            client.DefaultRequestHeaders.Add("Site", "NA");
            client.DefaultRequestHeaders.Add("Consumer", "NA");
            //client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "Oauth token");

            var reqMsg = new HttpRequestMessage(HttpMethod.Get, _appServiceGetCustomerUrl);
            var response = await client.SendAsync(reqMsg);

            if (response.IsSuccessStatusCode)
            {
                using var appServiceResponseStream = await response.Content.ReadAsStreamAsync();

                //TODO: refer to CustomerModel from Customer App service
                var customerModel = await JsonSerializer.DeserializeAsync<CustomerModel>(appServiceResponseStream);
                return customerModel;
            }
            else
            {
                _logger.LogError($"");
                return null;
            }
        }
    }
}
