using DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderQoute;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetQuotes;
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Internal;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using Flurl;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetQuoteDetails;

namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    [ExcludeFromCodeCoverage]
    public class CommerceService : ICommerceService
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly string _appOrderServiceUrl;
        private readonly string _appQuoteServiceUrl;
        private readonly ILogger<CommerceService> _logger;
        private static readonly Random getrandom = new Random();
        public CommerceService(IHttpClientFactory clientFactory, IOptions<AppSettings> options, ILogger<CommerceService> logger)
        {
            _clientFactory = clientFactory;
            _logger = logger;
            _appOrderServiceUrl = options?.Value.GetSetting("App.Order.Url");
            _appQuoteServiceUrl=options?.Value.GetSetting("App.Quote.Url");      
        }

        public async Task<OrderModel> GetOrderByIdAsync(string id)
        {
            var url = _appOrderServiceUrl.SetQueryParams(new { id });
            var getOrderByIdRequestMessage = new HttpRequestMessage(HttpMethod.Get, url);

            var apiOrdersClient = _clientFactory.CreateClient("apiServiceClient");

            var getOrderByIdHttpResponse = await apiOrdersClient.SendAsync(getOrderByIdRequestMessage);
            getOrderByIdHttpResponse.EnsureSuccessStatusCode();

            var getOrderByIdResponse = await getOrderByIdHttpResponse.Content.ReadAsAsync<List<OrderModel>>();
            return getOrderByIdResponse?.FirstOrDefault();
        }

        
        public async Task<Models.Quote.Quote.QuoteModel> GetQuote(GetQuote.Request request)
        {
            var quoteURL = _appQuoteServiceUrl.BuildQuery(request);
            try
            {
                var getQuoteRequestMessage = new HttpRequestMessage(HttpMethod.Get, quoteURL);
                var apiQuoteSummaryClient = _clientFactory.CreateClient("apiServiceClient");

                var response = await apiQuoteSummaryClient.SendAsync(getQuoteRequestMessage).ConfigureAwait(false);
                response.EnsureSuccessStatusCode();

                var getQuoteResponse = await response.Content.ReadAsAsync<IEnumerable<QuoteModel>>().ConfigureAwait(false);
                if (getQuoteResponse != null)
                    return getQuoteResponse.FirstOrDefault();
                else
                    return null; // fix this

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Exception at getting {nameof(FindQuoteDetails)}: {nameof(CommerceService)}");
                throw;
            }
        }

        public Task<string> GetQuotes(string Id)
        {
            throw new NotImplementedException();
        }

        public async Task<OrdersContainer> GetOrdersAsync(SearchCriteria orderParameters)
        {
            var url = _appOrderServiceUrl.AppendPathSegment("Find")
                        .SetQueryParams(new
                        {
                            orderParameters.Id,
                            orderParameters.CustomerPO,
                            orderParameters.CreatedFrom,
                            orderParameters.CreatedTo,
                            Sort = orderParameters.OrderBy,
                            SortAscending = orderParameters.SortAscending.ToString(),
                            orderParameters.PageSize,
                            Page = orderParameters.PageNumber,
                            WithPaginationInfo = true,
                            Details = true
                        });

            var getOrdersHttpRequestMessage = new HttpRequestMessage(HttpMethod.Get, url);

            var apiOrdersClient = _clientFactory.CreateClient("apiServiceClient");

            var getOrdersHttpResponse = await apiOrdersClient.SendAsync(getOrdersHttpRequestMessage);
            getOrdersHttpResponse.EnsureSuccessStatusCode();
            var findOrdersDto = await getOrdersHttpResponse.Content.ReadAsAsync<OrdersContainer>();
            return findOrdersDto;
        }

        public async Task<QuoteDetailModel> GetCartDetailsInQuote(DetailsOfSavedCartsQuote.Request request)
        {
           
                var LineDetails = new List<Line>();
                for (int i = 0; i < 3; i++)
                {
                    Line newSavedCart = new Line();
                    var randomNumber = GetRandomNumber(10, 60);

                    newSavedCart.Id = "IN000000" + randomNumber;
                    newSavedCart.Parent = "TR123YU66" + randomNumber;
                    newSavedCart.Quantity = randomNumber;
                    newSavedCart.TotalPrice = randomNumber;
                    newSavedCart.MSRP = randomNumber;
                    newSavedCart.UnitPrice = randomNumber;
                    newSavedCart.Currency = "USD";
                    newSavedCart.Invoice = "IHT128763K0987";
                    newSavedCart.Description = "Description of the Product is very good";
                    newSavedCart.ShortDescription = "Product Description";
                    newSavedCart.MFRNumber = "PUT9845011123";
                    newSavedCart.TDNumber = "ITW398765243";
                    newSavedCart.UPCNumber = "924378465";
                    newSavedCart.UnitListPrice = "2489.00";
                    newSavedCart.ExtendedPrice = "2349.00";
                    newSavedCart.Availability = randomNumber.ToString();
                    newSavedCart.RebateValue = randomNumber.ToString();
                    newSavedCart.URLProductImage = "https://Product/Image";
                    newSavedCart.URLProductSpecs = "https://Product/details";
                    LineDetails.Add(newSavedCart);
                }

                var shipTo = new Address()
                {
                    Name = "Sis Margaret's Inc",
                    Line1 = "Wade Wilson",
                    Line2 = "9071",
                    Line3 = "Santa Monica Blvd",
                    City = "West Hollywood",
                    State = "CA",
                    Zip = "90069",
                    Country = "United States",
                    Email = "dpool@sismargarets.com",
                };
                var endUser = new Address()
                {
                    Name = "Stark Enterprises",
                    Line1 = "Tony Stark",
                    Line2 = "10880 ",
                    Line3 = "Malibu Point",
                    City = "Malibu",
                    State = "CA",
                    Zip = "90069",
                    Country = "United States",
                    Email = "dpool@sismargarets.com",
                };
                var generalInfo = new DetailsForGenInfo()
                {
                    ConfigId = "12345!",
                    DealId = "hello",
                    Tier = "hello",
                    Reference = "",
                };
                var quoteNumber = "TIW777" + GetRandomNumber(10000, 60000);
                var orderNumber = "NQL33390" + GetRandomNumber(10000, 60000);
                var poNumber = "PO" + GetRandomNumber(10000, 60000);
                var endUserNumber = "EPO" + GetRandomNumber(10000, 60000);

                var savedCartResponse = new QuoteDetailModel
                {

                    QuoteDetails = new QuoteDetails
                    {

                        ShipTo = shipTo,
                        EndUser = endUser,
                        GeneralInfo = generalInfo,
                        Notes = "Descrption of Internal Notes",
                        QuoteNumber = quoteNumber,
                        OrderNumber = orderNumber,
                        PONumber = poNumber,
                        EndUserPO = endUserNumber,
                        PODate = "12/04/2020",
                        Details = LineDetails,
                       
                    }
                };
                return await Task.FromResult(savedCartResponse);

        }
        public static int GetRandomNumber(int min, int max)
        {
            return getrandom.Next(min, max);
        }

        public async Task<FindResponse<IEnumerable<QuoteModel>>> FindQuoteDetails(GetQuotes.Request request)
        {
            var quoteURL = _appQuoteServiceUrl.AppendPathSegment("Find").BuildQuery(request);

            try
            {
                var getQuoteRequestMessage = new HttpRequestMessage(HttpMethod.Get, quoteURL);
                var apiQuoteSummaryClient = _clientFactory.CreateClient("apiServiceClient");

                var response = await apiQuoteSummaryClient.SendAsync(getQuoteRequestMessage).ConfigureAwait(false);
                response.EnsureSuccessStatusCode();

                var getQuoteResponse = await response.Content.ReadAsAsync<FindResponse<IEnumerable<QuoteModel>>>().ConfigureAwait(false);
                return getQuoteResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Exception at getting {nameof(FindQuoteDetails)}: {nameof(CommerceService)}");
                throw;
            }
        }

        
    }
}
