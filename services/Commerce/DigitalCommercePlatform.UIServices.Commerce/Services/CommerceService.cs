using DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderQoute;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Infrastructure.ExceptionHandling;
using DigitalCommercePlatform.UIServices.Commerce.Infrastructure.Filters;
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Find;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote;
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

namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    [ExcludeFromCodeCoverage]
    public class CommerceService : ICommerceService
    {
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly ILogger<CommerceService> _logger;
        private readonly string _appOrderServiceUrl;
        private readonly string _appQuoteServiceUrl;
        private static readonly Random getrandom = new Random();

        public CommerceService(IMiddleTierHttpClient middleTierHttpClient, ILogger<CommerceService> logger,IOptions<AppSettings> options)
        {
            _middleTierHttpClient = middleTierHttpClient ?? throw new ArgumentNullException(nameof(middleTierHttpClient));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _appOrderServiceUrl = options?.Value.GetSetting("App.Order.Url");
            _appQuoteServiceUrl = options?.Value.GetSetting("App.Quote.Url");
        }

        public async Task<OrderModel> GetOrderByIdAsync(string id)
        {
            var url = _appOrderServiceUrl.SetQueryParams(new { id });
            var getOrderByIdResponse = await _middleTierHttpClient.GetAsync<List<OrderModel>>(url);
            return getOrderByIdResponse?.FirstOrDefault();
        }

        
        public async Task<QuoteModel> GetQuote(GetQuote.Request request)
        {
            var quoteURL = _appQuoteServiceUrl.BuildQuery(request);

            var getQuoteResponse = await _middleTierHttpClient.GetAsync<IEnumerable<QuoteModel>>(quoteURL);
            return getQuoteResponse?.FirstOrDefault();
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
                            orderParameters.Manufacturer,
                            orderParameters.CreatedFrom,
                            orderParameters.CreatedTo,
                            Sort = orderParameters.SortBy,
                            SortAscending = orderParameters.SortAscending.ToString(),
                            orderParameters.PageSize,
                            Page = orderParameters.PageNumber,
                            WithPaginationInfo = true,
                            Details = true
                        });

            var findOrdersDto = await _middleTierHttpClient.GetAsync<OrdersContainer>(url);
            return findOrdersDto;
        }

        public async Task<QuoteDetailModel> GetCartDetailsInQuote()
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
                    newSavedCart.CurrencySymbol = "$";
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

        public async Task<FindResponse<IEnumerable<QuoteModel>>> FindQuotes(FindModel query)
        {
            var quoteURL = _appQuoteServiceUrl.AppendPathSegment("Find").BuildQuery(query);
            var getQuoteResponse = await _middleTierHttpClient.GetAsync<FindResponse<IEnumerable<QuoteModel>>>(quoteURL);
            getQuoteResponse.Count = getQuoteResponse.Data.Count();
            return getQuoteResponse;
        }

        public async Task<CreateQuoteFrom.Response> CreateQuoteFrom(CreateQuoteFrom.Request request)
        {
            // Manual faking all possible scenarios, so the frontend developers can code the error handling on their side
            if (request.CreateModelFrom.CreateFromId == "99999")
            {
                throw new UIServiceException("Unable to create a quote. The Quote publisher service is unavailable.", (int)UIServiceExceptionCode.QuoteCreationFailed);
            }
            var response = new CreateQuoteFrom.Response
            {
                QuoteId = "TIW777" + GetRandomNumber(10000, 60000),
                ConfirmationId = "CONFIRM_" + GetRandomNumber(10000, 60000),
            };
            return await Task.FromResult(response);
        }
    }
}
