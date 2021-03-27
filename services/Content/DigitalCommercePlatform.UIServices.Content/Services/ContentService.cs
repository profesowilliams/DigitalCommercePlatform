using DigitalCommercePlatform.UIServices.Content.Actions.GetCartDetails;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Net.Http;
using System.Threading.Tasks;
using DigitalFoundation.Common.Settings;
using Microsoft.Extensions.Options;
using DigitalCommercePlatform.UIServices.Content.Models.Cart;
using Flurl;
using DigitalCommercePlatform.UIServices.Content.Models;

namespace DigitalCommercePlatform.UIServices.Content.Services
{
    [ExcludeFromCodeCoverage]
    public class ContentService : IContentService
    {
        //private readonly IHttpClientFactory _clientFactory;
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly string _coreCartURL;
#pragma warning disable CS0414 // The field is assigned but its value is never used
        private readonly string _appCustomerURL;
        private readonly string _appCatalogURL;
#pragma warning restore CS0414
        private readonly ILogger<ContentService> _logger;
        public ContentService(IMiddleTierHttpClient middleTierHttpClient,
            ILogger<ContentService> logger, IOptions<AppSettings> options)
        {
            _logger = logger;
            _middleTierHttpClient = middleTierHttpClient;
            _coreCartURL = options?.Value.GetSetting("App.Cart.Url");
            _appCustomerURL = options?.Value.GetSetting("App.Customer.Url");
            _appCatalogURL = options?.Value.GetSetting("App.Catalog.Url");
        }
        
        public async Task<Rootobject> GetCartDetails(GetCart.Request request)
        {
            var CartURL = "https://eastus-dit-service.dc.tdebusiness.cloud/app-cart/v2/";
            CartURL=CartURL.AppendPathSegment(request.Id);
                //"http://app-cart/v2/6027161385";
                //_coreCartURL.AppendPathSegment(request.Id);
                //.BuildQuery(request);
            try
            {
                var getCustomerDetailsResponse = await _middleTierHttpClient.GetAsync<Rootobject>(CartURL);
                return getCustomerDetailsResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting GetCartDetails : " + nameof(ContentService));
                throw ex;
            }
        }
    }
}
