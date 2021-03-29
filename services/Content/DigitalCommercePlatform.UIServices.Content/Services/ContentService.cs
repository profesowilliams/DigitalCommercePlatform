using DigitalCommercePlatform.UIServices.Content.Actions.GetCartDetails;
using DigitalCommercePlatform.UIServices.Content.Actions.TypeAhead;
using DigitalCommercePlatform.UIServices.Content.Models.Cart;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using Flurl;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Content.Services
{
    [ExcludeFromCodeCoverage]
    public class ContentService : IContentService
    {
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly string _coreCartURL;
#pragma warning disable CS0414 // The field is assigned but its value is never used
        private readonly string _appCustomerURL;
        private readonly string _appCatalogURL;
        private readonly string _typeSearchUrl;
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
            _typeSearchUrl = "https://typeahead.techdata.com/kw2";
        }
        
        public async Task<CartModel> GetCartDetails(GetCart.Request request)
        {
            var CartURL = "https://eastus-dit-service.dc.tdebusiness.cloud/app-cart/v2/";
            CartURL=CartURL.AppendPathSegment(request.Id);
            try
            {
                var getCustomerDetailsResponse = await _middleTierHttpClient.GetAsync<CartModel>(CartURL);
                return getCustomerDetailsResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting GetCartDetails : " + nameof(ContentService));
                throw ex;
            }
        }

        public async Task<TypeAheadSearch.Response> GetTypeAhead(TypeAheadSearch.Request request)
        {
            var typeAheadUrl = _typeSearchUrl.BuildQuery(request);
            try
            {
                var getTypeAheadResponse = await _middleTierHttpClient.GetAsync<TypeAheadSearch.Response>(typeAheadUrl);
                return getTypeAheadResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting GetTypeAhead : " + nameof(ContentService));
                throw ex;
            }
        }
    }
}
