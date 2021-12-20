//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Content.Actions;
using DigitalCommercePlatform.UIServices.Content.Actions.CreateCartByQuote;
using DigitalCommercePlatform.UIServices.Content.Actions.ReplaceCartQuotes;
using DigitalCommercePlatform.UIServices.Content.Actions.SavedCartDetails;
using DigitalCommercePlatform.UIServices.Content.Actions.TypeAhead;
using DigitalCommercePlatform.UIServices.Content.Models.Cart;
using DigitalCommercePlatform.UIServices.Content.Models.Cart.Internal;
using DigitalCommercePlatform.UIServices.Content.Models.Search;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Client.Exceptions;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI.ExceptionHandling;
using Flurl;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Content.Services
{
    [ExcludeFromCodeCoverage]
    public class ContentService : IContentService
    {
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly string _appCartURL;
        private readonly string _appCustomerURL;
        private readonly string _typeSearchUrl;
        private readonly string _appCartUrl;
        private readonly ILogger<ContentService> _logger;
        private readonly IUIContext _context;

        public ContentService(IMiddleTierHttpClient middleTierHttpClient,
            ILogger<ContentService> logger, IAppSettings appSettings, IUIContext context)
        {
            _logger = logger;
            _context = context;
            _middleTierHttpClient = middleTierHttpClient;
            _appCartURL = appSettings.GetSetting("App.Cart.Url");
            _appCustomerURL = appSettings.GetSetting("App.Customer.Url");
            _typeSearchUrl = appSettings.GetSetting("Search.App.Url");
            _appCartUrl = appSettings.GetSetting("App.Cart.Url");
        }

        public async Task<ActiveCartModel> GetActiveCartDetails()
        {
            var getActiveCartResponse = await _middleTierHttpClient.GetAsync<ActiveCartModel>(_appCartURL);
            var totalQunatity = getActiveCartResponse.Items.Where(x => x.Quantity != 0).ToList().Sum(o => o.Quantity);
            getActiveCartResponse.TotalQuantity = totalQunatity;
            return getActiveCartResponse;
        }

        public async Task<SavedCartDetailsModel> GetSavedCartDetails(GetSavedCartDetails.Request request)
        {
            if (request.IsCartName)
            {
                var savedCartURL = _appCartURL.AppendPathSegment("listsavedcarts");
                var savedCartresponse = await _middleTierHttpClient.GetAsync<List<SavedCartDetailsModel>>(savedCartURL);

                request.Id = savedCartresponse.Where(c => c.Name == request.Id).Any() ?
                    savedCartresponse.Where(c => c.Name == request.Id)?.FirstOrDefault().Source.Id :
                        throw new UIServiceException("Invalid Saved Cart Name: " + request.Id, (int)UIServiceExceptionCode.GenericBadRequestError);
            }
            var cartURL = _appCartURL.AppendPathSegment(request.Id);
            var getCustomerDetailsResponse = await _middleTierHttpClient.GetAsync<SavedCartDetailsModel>(cartURL);
            return getCustomerDetailsResponse;
        }

        public async Task<IEnumerable<TypeAheadSuggestion>> GetTypeAhead(TypeAheadSearch.Request request)
        {
            var typeAheadUrl = _typeSearchUrl.AppendPathSegment("/TypeAhead").BuildQuery(request);
            try
            {
                var getTypeAheadResponse = await _middleTierHttpClient.GetAsync<IEnumerable<TypeAheadSuggestion>>(typeAheadUrl);
                return getTypeAheadResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting GetTypeAhead : " + nameof(ContentService));
                throw ex;
            }
        }

        //The middleTierHttpClient returns null
        //middleTierHttpClient needs to be fixed to return the right HTTP Response of a PATCH
        public async Task<AddCartItem.Response> AddItemCart(AddCartItem.Request request)
        {
            var url = _appCartUrl + "/AddItems";
            var result = await _middleTierHttpClient.PatchAsync<CartItemModel>(url, null, request.Items);
            var response = new AddCartItem.Response(result);
            return await Task.FromResult(response);
        }

        public async Task<GetCreateCartByQuote.Response> CreateCartByQuote(string QuoteId)
        {
            var cartURL = _appCartUrl.AppendPathSegment("/CreateByQuote").AppendPathSegment(QuoteId);
            try
            {
                var createByQuote = await _middleTierHttpClient.PutAsync<ReplaceCartModel>(cartURL, null, null).ConfigureAwait(false);
                var result = createByQuote?.StatusCode ?? HttpStatusCode.OK;

                var response = new GetCreateCartByQuote.Response();
                response.IsSuccess = result == HttpStatusCode.OK ? true : false;
                return response;
            }
            catch (RemoteServerHttpException ex)
            {
                _logger.LogError(ex, "Exception from the App-Service : " + nameof(ContentService));
                throw new UIServiceException("Error while calling App-Cart Service" + ex.Message, (int)UIServiceExceptionCode.GenericBadRequestError);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at Create cart by Quote : " + nameof(ContentService));
                throw ex;
            }
        }

        public async Task<ReplaceCart.Response> ReplaceCart(ReplaceCart.Request request)
        {
            try
            {
                var requestUrl = "";
                if (request.Type.ToLower() == "cart")
                    requestUrl = _appCartUrl.AppendPathSegment("/Replace/" + request.Id);
                else
                    requestUrl = _appCartUrl.AppendPathSegment("/CreateByQuote").AppendPathSegment(request.Id);

                var replaceResponse = await _middleTierHttpClient.PutAsync<ReplaceCartModel>(requestUrl, null, null);
                var result = replaceResponse?.StatusCode ?? HttpStatusCode.OK;

                var response = new ReplaceCart.Response();
                response.IsSuccess = result == HttpStatusCode.OK ? true : false;
                return response;
            }
            catch (RemoteServerHttpException ex)
            {
                if (ex.Message.Contains("Error"))
                {
                    var response = new ReplaceCart.Response();
                    response.IsSuccess = false;
                    return response;
                    throw new UIServiceException(ex.Message, (int)UIServiceExceptionCode.GenericBadRequestError);
                }
                else
                {
                    _logger.LogError(ex, "Exception at : " + nameof(ContentService));
                    throw new UIServiceException(ex.Message, (int)UIServiceExceptionCode.GenericBadRequestError);
                }
               
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at replace cart by Quote : " + nameof(ContentService));
                throw ex;
            }
        }
    }
}
