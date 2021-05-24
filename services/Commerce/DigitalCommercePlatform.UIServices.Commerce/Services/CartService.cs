using DigitalCommercePlatform.UIServices.Content.Models.Cart;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.SimpleHttpClient.Exceptions;
using Flurl;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    [ExcludeFromCodeCoverage]
    public class CartService : ICartService
    {
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly ILogger<CommerceService> _logger;
        private readonly string _appCartURL;

        public CartService(IMiddleTierHttpClient middleTierHttpClient, ILogger<CommerceService> logger, IAppSettings appSettings)
        {
            _middleTierHttpClient = middleTierHttpClient ?? throw new ArgumentNullException(nameof(middleTierHttpClient));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _appCartURL = appSettings.GetSetting("App.Cart.Url");
        }

        public async Task<ActiveCartModel> GetActiveCart()
        {
            try
            {
                var activeCartURL = _appCartURL;
                var activeCartResponse = await _middleTierHttpClient.GetAsync<ActiveCartModel>(activeCartURL);
                return activeCartResponse;
            }
            catch (RemoteServerHttpException ex)
            {
                if (ex.Code == System.Net.HttpStatusCode.NotFound)
                {
                    return null;
                }
                _logger.LogError(ex, "Exception at getting Cart  : " + nameof(GetActiveCart));
                throw ex;
            }
        }

        public async Task<SavedCartDetailsModel> GetSavedCartDetails(string cartId)
        {
            try
            {
                var savedCartURL = _appCartURL.AppendPathSegment(cartId);
                var getCustomerDetailsResponse = await _middleTierHttpClient.GetAsync<SavedCartDetailsModel>(savedCartURL);
                return getCustomerDetailsResponse;
            }
            catch (RemoteServerHttpException ex)
            {
                if (ex.Code == System.Net.HttpStatusCode.NotFound)
                {
                    return null;
                }
                _logger.LogError(ex, "Exception at getting Cart  : " + nameof(GetSavedCartDetails));
                throw ex;
            }
        }
    }
}