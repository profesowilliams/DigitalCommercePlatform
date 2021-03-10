using DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderQoute;
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Internal;
using DigitalFoundation.Common.Extensions;
using Flurl;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    [ExcludeFromCodeCoverage]
    public class CommerceService : ICommerceService
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly string _appOrderServiceUrl;
        //private readonly string _appQuoteServiceUrl;
        private static readonly Random getrandom = new Random();
        public CommerceService(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
            _appOrderServiceUrl = "https://eastus-dit-service.dc.tdebusiness.cloud/app-order/v1/";
            //_appQuoteServiceUrl = "https://eastus-dit-service.dc.tdebusiness.cloud/app-quote/v1/";            
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


        public Task<string> GetQuote(string Id)
        {
            throw new NotImplementedException();
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

        public async Task<QuoteDetailModel> GetOrderQuote(DetailsOfOrderQuote.Request request)
        {
            var QuoteDetailsModel = new List<QuoteDetailModel>();
            for (int i = 0; i < 30; i++)
            {
                QuoteDetailModel newSavedCart = new QuoteDetailModel();
                var randomNumber = GetRandomNumber(10, 60);
                newSavedCart.ShipTo = new Address()
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
                newSavedCart.EndUser = new Address()
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

                newSavedCart.GeneralInfo = new Models.Quote.Internal.DetailsForGenInfo()
                {
                    ConfigId = "12345!",
                    DealId = "hello",
                    Tier = "hello",
                    Reference = "",
                };
                newSavedCart.Notes = "heeeeloooo";
                newSavedCart.Details = new Line()
                {
                    Id ="IN000000"+randomNumber,
                     Parent ="TR123YU66"+randomNumber,
                    Quantity = randomNumber,
                    TotalPrice =randomNumber,
                     MSRP = randomNumber,
                     UnitPrice =randomNumber,
                     Currency ="USD",
                     Invoice ="",
                    Description ="",
                };
                newSavedCart.Products = new ProductDetailsForQuote()
                {
                     Name ="Test Quote",
                     Class ="Laptop",
                     ShortDescription ="",
                     MFRNum = "MFR"+randomNumber,
                     TDNum ="TD"+randomNumber,
                     UPCNum ="UPC"+randomNumber,
                      PartNum ="PI800"+randomNumber,
                     SupplierPartNum="SIQ8888"+randomNumber,
                     Description ="description of the details in the cart",
                     Qty =randomNumber,
                     UnitPrice =randomNumber,
                     UnitListPrice= randomNumber,//qty*unitprice
                     RebateValue =randomNumber,
                     URLProductImage ="Image/Ur/Link",
                    URLProductSpecs="Product/Specs"
                };
                newSavedCart.QuoteNumber = "TIW777"+randomNumber;
                newSavedCart.OrderNumber = "NQL33390"+randomNumber;
                newSavedCart.PONumber = "PO"+randomNumber;
                newSavedCart.EndUserPO = "EPO"+randomNumber;
                newSavedCart.PODate = "12/04/2020";
            }

            var QuoteDetails = new QuoteDetailModel
            {
                QuoteDetails = new QuoteDetailModel
                {
                    Notes = "Details of Notes",

                }
            };

            return Task.FromResult(QuoteDetails);
        }
        public static int GetRandomNumber(int min, int max)
        {
            return getrandom.Next(min, max);
        }
    }
    }
}
