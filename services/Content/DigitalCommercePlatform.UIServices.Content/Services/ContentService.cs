using DigitalCommercePlatform.UIServices.Content.Actions.GetCartDetails;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Net.Http;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Content.Services
{
    [ExcludeFromCodeCoverage]
    public class ContentService : IContentService
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly string _coreCartURL;
        private readonly string _appCustomerURL;
        private readonly string _appCatalogURL;
        private readonly ILogger<ContentService> _logger;
        public ContentService(IHttpClientFactory clientFactory,
            IMiddleTierHttpClient httpClient,
            ILogger<ContentService> logger)
        {
            _logger = logger;
            _clientFactory = clientFactory;
            _coreCartURL = "http://Core-Cart/v1/";
            _appCustomerURL = "https://eastus-sit-service.dc.tdebusiness.cloud/app-customer/v1";
            _appCatalogURL = "https://eastus-dit-service.dc.tdebusiness.cloud/app-catalog/v1/";
        }
        public Task<GetCart.Response> GetCartDetails(GetCart.Request request)
        {
            var CartURL = _coreCartURL.BuildQuery(request);
            try
            {
                Random rnd = new Random();
                var v1 = new GetCart.Response
                {
                    CartId = "1",//Hardcoded now , in future it will come from the app service
                    CartItemCount = rnd.Next(1, 40)//Hardcoded now , in future it will come from the app service
                };
                return Task.FromResult(v1);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting GetCartDetails : " + nameof(ContentService));
                throw ex;
            }
        }
    }
}
