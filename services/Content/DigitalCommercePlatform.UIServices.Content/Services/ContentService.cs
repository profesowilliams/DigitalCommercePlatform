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

namespace DigitalCommercePlatform.UIServices.Content.Services
{
    [ExcludeFromCodeCoverage]
    public class ContentService : IContentService
    {
        private readonly string _coreCartURL;
#pragma warning disable CS0414 // The field is assigned but its value is never used
        private readonly string _appCustomerURL;
        private readonly string _appCatalogURL;
#pragma warning restore CS0414
        private readonly ILogger<ContentService> _logger;
        public ContentService(ILogger<ContentService> logger, IOptions<AppSettings> options)
        {
            _logger = logger;
            _coreCartURL = options?.Value.GetSetting("Core.Cart.Url");
            _appCustomerURL = options?.Value.GetSetting("App.Customer.Url");
            _appCatalogURL = options?.Value.GetSetting("App.Catalog.Url");
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
