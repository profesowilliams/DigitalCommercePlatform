using DigitalCommercePlatform.UIServices.Commerce.Actions.GetPricingCondition;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Actions.QuotePreviewDetail;
using DigitalCommercePlatform.UIServices.Commerce.Infrastructure.ExceptionHandling;
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Find;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal;
using DigitalCommercePlatform.UIServices.Content.Models.Cart;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.SimpleHttpClient.Exceptions;
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
        private readonly string _appCartURL;
        private static readonly Random getrandom = new Random();

        public CommerceService(IMiddleTierHttpClient middleTierHttpClient, ILogger<CommerceService> logger, IOptions<AppSettings> options)
        {
            _middleTierHttpClient = middleTierHttpClient ?? throw new ArgumentNullException(nameof(middleTierHttpClient));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _appOrderServiceUrl = options?.Value.GetSetting("App.Order.Url");
            _appQuoteServiceUrl = options?.Value.GetSetting("App.Quote.Url");
            _appCartURL = options?.Value.GetSetting("App.Cart.Url");
        }

        public async Task<Models.Order.Internal.OrderModel> GetOrderByIdAsync(string id)
        {
            var url = _appOrderServiceUrl.SetQueryParams(new { id });
            var getOrderByIdResponse = await _middleTierHttpClient.GetAsync<List<Models.Order.Internal.OrderModel>>(url);
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
                            WithPaginationInfo = orderParameters.WithPaginationInfo,
                            Details = true
                        });

            var findOrdersDto = await _middleTierHttpClient.GetAsync<OrdersContainer>(url);
            return findOrdersDto;
        }

        public async Task<QuotePreviewModel> CreateQuotePreview(GetQuotePreviewDetails.Request request)
        {
            var lineItems = new List<Line>();

            for (int i = 0; i < 15; i++)
            {
                Line lineItem = new Line();
                var randomNumber = GetRandomNumber(10, 60);

                lineItem.Id = "IN000000" + randomNumber;
                lineItem.Parent = "TR123YU66" + randomNumber;
                lineItem.Quantity = randomNumber;
                lineItem.TotalPrice = randomNumber;
                lineItem.MSRP = randomNumber;
                lineItem.UnitPrice = randomNumber;
                lineItem.Invoice = $"IHT128763K0987{i}";
                lineItem.Description = "Description of the Product is very good";
                lineItem.ShortDescription = "Product Short Description";
                lineItem.MFRNumber = $"{i}PUT9845011123";
                lineItem.TDNumber = $"{i}ITW398765243";
                lineItem.UPCNumber = $"924378465{i}";
                lineItem.UnitListPrice = "2489.00";
                lineItem.ExtendedPrice = "2349.00";
                lineItem.Availability = randomNumber.ToString();
                lineItem.RebateValue = randomNumber.ToString();
                lineItem.URLProductImage = "https://Product/Image";
                lineItem.URLProductSpecs = "https://Product/details";
                lineItems.Add(lineItem);
            };

            var quoteNumber = "TIW777" + GetRandomNumber(10000, 60000);
            var orderNumber = new List<Models.Quote.Quote.Internal.OrderModel>();
            for (int i = 0; i < 2; i++)
            {
                Models.Quote.Quote.Internal.OrderModel newSavedCart = new Models.Quote.Quote.Internal.OrderModel();
                var randomNumber = GetRandomNumber(10, 60);

                newSavedCart.Id = "IN000000" + randomNumber;
                newSavedCart.System = "2";
                newSavedCart.SalesOrg = "0100";
                orderNumber.Add(newSavedCart);
            }
            var poNumber = "PO" + GetRandomNumber(10000, 60000);
            var endUserNumber = "EPO" + GetRandomNumber(10000, 60000);

            var quotePreview = new QuotePreview
            {

                 ShipTo= GenerateAddress("ShipTo"),
                EndUser = GenerateAddress("EndUser"),
                //GeneralInformation = new QuoteGeneralInformation()
                //{
                //    QuoteReference = GetRandomNumber(1000000, 6000000).ToString(),
                //    Source = $"Estimate ID" + GetRandomNumber(10000, 60000).ToString(),
                //    SPAId = GetRandomNumber(1000000, 6000000).ToString(),
                //    Tier = GetRandomNumber(1, 6).ToString()
                //},
                Notes = "Descrption of Internal Notes",
                Id = quoteNumber,
                //OrderNumber = orderNumber,
                CustomerPO = poNumber,
                EndUserPO = endUserNumber,
                PODate = "12/04/2020",
                Items = lineItems,
                Currency = "USD",
                CurrencySymbol = "$"
        };

            List<Address> GenerateAddress(string prefix)
            {
                var addressList = new List<Address>();

                for(var i=0; i < 3; i++)
                {
                    var address = new Address
                    {
                       
                        Name = prefix + i,
                        Email = $"myemail{i}@example.com",
                        Line1 = $"Line 1{i} Road",
                        Line2 = $"Line 2{i} Road",
                        Line3 = $"Line 3{i} Road",
                        City = $"City{i}",
                        State = $"State{i}",
                        Zip = $"{i}{i - 0}{i}{i - 0}{i}",
                        Country = $"Country{i}"

                    };

                    addressList.Add(address);
                }
               
                return addressList;
            }
            var response = new QuotePreviewModel()
            {
                QuoteDetails = quotePreview,
            };
            return await Task.FromResult(response);        
        }

        public static int GetRandomNumber(int min, int max)
        {
            return getrandom.Next(min, max);
        }

        public async Task<FindResponse<IEnumerable<QuoteModel>>> FindQuotes(FindModel query)
        {
            var quoteURL = _appQuoteServiceUrl.AppendPathSegment("Find").BuildQuery(query);
            var getQuoteResponse = await _middleTierHttpClient.GetAsync<FindResponse<IEnumerable<QuoteModel>>>(quoteURL);
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

        public async Task<PricingConditionsModel> GetPricingConditions(GetPricingConditions.Request request)
        {
           
            List<PricingCondition> lstPricingConditions = new List<PricingCondition>();

            lstPricingConditions.Add(new PricingCondition("Commercial (Non-Govt)", "0"));
            lstPricingConditions.Add(new PricingCondition("Education (Student, Staff)", "1"));
            lstPricingConditions.Add(new PricingCondition("Education (Higher)", "2"));
            lstPricingConditions.Add(new PricingCondition("Education (K - 12)", "3"));
            lstPricingConditions.Add(new PricingCondition("Education E-Rate (K - 12)", "4"));
            lstPricingConditions.Add(new PricingCondition("Federal", "5"));
            lstPricingConditions.Add(new PricingCondition("Federal GSA", "6"));
            lstPricingConditions.Add(new PricingCondition("State", "7"));
            lstPricingConditions.Add(new PricingCondition("Medical", "8"));
            lstPricingConditions.Add(new PricingCondition("SEWP Contract", "11"));

            var response = new PricingConditionsModel {
                Items = lstPricingConditions
            };

            return await Task.FromResult(response);
        }

        public async Task<CreateQuoteFrom.Response> CreateQuoteFromSavedCart(CreateQuoteFrom.Request request)
        {
            var savedCartId = request.CreateModelFrom.CreateFromId;
            CartModel cart = await GetCartDetails(savedCartId);
            if (cart == null)
            {
                throw new UIServiceException("Invalid savedCartId: " + savedCartId, (int)UIServiceExceptionCode.GenericBadRequestError);
            }

            // Mapping cart into a quote
            request.CreateModelFrom.SalesOrg = cart.source.SalesOrg;
            request.CreateModelFrom.TargetSystem = cart.source.System;
            request.CreateModelFrom.Creator = cart.userId;
            request.CreateModelFrom.EndUser.Id = cart.customerNo;
            foreach(var cartLine in cart.lines)
            {
                var item = new ItemModel();
                item.Quantity = cartLine.Quantity;
                item.Id = cartLine.ProductId;
                //cartLine.Type
                //cartLine.UAN
                //item.Product
            }

            var response = new CreateQuoteFrom.Response
            {
                QuoteId = "TIW777" + GetRandomNumber(10000, 60000),
                ConfirmationId = "CONFIRM_" + GetRandomNumber(10000, 60000),
            };
            return await Task.FromResult(response);
        }

        public async Task<CartModel> GetCartDetails(string cartId)
        {
            try
            {
                var cartURL = _appCartURL.Replace("/v1", "/v2") + "/";
                cartURL = cartURL.AppendPathSegment(cartId);
                var getCustomerDetailsResponse = await _middleTierHttpClient.GetAsync<CartModel>(cartURL);
                return getCustomerDetailsResponse;
            }
            catch (RemoteServerHttpException ex)
            {
                if (ex.Code == System.Net.HttpStatusCode.NotFound)
                {
                    return null;
                }
                _logger.LogError(ex, "Exception at getting Cart  : " + nameof(GetCartDetails));
                throw ex;
            }
        }
    }
}
