using DigitalCommercePlatform.UIServices.Content.Actions.SavedCartDetails;
using DigitalCommercePlatform.UIServices.Content.Actions.TypeAhead;
using DigitalCommercePlatform.UIServices.Content.Infrastructure.ExceptionHandling;
using DigitalCommercePlatform.UIServices.Content.Models.Cart;
using DigitalCommercePlatform.UIServices.Content.Models.Search;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using Flurl;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Content.Services
{
    [ExcludeFromCodeCoverage]
    public class ContentService : IContentService
    {
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly string _appCartURL;
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
            _appCartURL = options?.Value.GetSetting("App.Cart.Url");
            _appCustomerURL = options?.Value.GetSetting("App.Customer.Url");
            _appCatalogURL = options?.Value.GetSetting("App.Catalog.Url");
            _typeSearchUrl = options?.Value.GetSetting("Core.Search.Url");
        }

        public async Task<ActiveCartModel> GetActiveCartDetails()
        {
            try
            {
                var getActiveCartResponse = await _middleTierHttpClient.GetAsync<ActiveCartModel>(_appCartURL);
                var totalQunatity= getActiveCartResponse.Items.Where(x=>x.Quantity!=0).ToList().Sum(o => o.Quantity);
                getActiveCartResponse.TotalQuantity = totalQunatity;
                return getActiveCartResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting GetCartDetails : " + nameof(ContentService));
                throw ex;
            }
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
            try
            {
                var getCustomerDetailsResponse = await _middleTierHttpClient.GetAsync<SavedCartDetailsModel>(cartURL);
                return getCustomerDetailsResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting GetCartDetails : " + nameof(ContentService));
                throw ex;
            }
        }

        public async Task<IEnumerable<TypeAheadSuggestion>> GetTypeAhead(TypeAheadSearch.Request request)
        {
            var typeAheadUrl = _typeSearchUrl.AppendPathSegment("/GetTypeAheadTerms").BuildQuery(request);
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
    }
}
