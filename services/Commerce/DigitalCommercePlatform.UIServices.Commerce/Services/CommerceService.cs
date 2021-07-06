using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetPricingCondition;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Actions.QuotePreviewDetail;
using DigitalCommercePlatform.UIServices.Commerce.Infrastructure.ExceptionHandling;
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Create;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Find;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal;
using DigitalCommercePlatform.UIServices.Common.Cart.Contracts;
using DigitalCommercePlatform.UIServices.Common.Cart.Models.Cart;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.SimpleHttpClient.Exceptions;
using Flurl;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    [ExcludeFromCodeCoverage]
    public class CommerceService : ICommerceService
    {
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly ILogger<CommerceService> _logger;
        private readonly IHelperService _helperService;
        private readonly ICartService _cartService;
        private readonly IUIContext _uiContext;
        private readonly IAppSettings _appSettings;
        private string _appOrderServiceUrl;
        private string _appQuoteServiceUrl;
        private string _customerServiceURL;
        private static readonly Random getrandom = new Random();
        private readonly IMapper _mapper;
        public CommerceService(IMiddleTierHttpClient middleTierHttpClient,
            ILogger<CommerceService> logger,
            IAppSettings appSettings,
            ICartService cartService,
            IUIContext uiContext,
            IMapper mapper,
            IHelperService helperService)
        {
            _middleTierHttpClient = middleTierHttpClient ?? throw new ArgumentNullException(nameof(middleTierHttpClient));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _cartService = cartService;
            _helperService = helperService;
            _uiContext = uiContext;
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _appSettings = appSettings;
        }

        public async Task<Models.Order.Internal.OrderModel> GetOrderByIdAsync(string id)
        {
            _appOrderServiceUrl = _appSettings.GetSetting("App.Order.Url");
            var url = _appOrderServiceUrl.SetQueryParams(new { id });
            var getOrderByIdResponse = await _middleTierHttpClient.GetAsync<List<Models.Order.Internal.OrderModel>>(url);
            return getOrderByIdResponse?.FirstOrDefault();
        }

        public async Task<QuoteModel> GetQuote(GetQuote.Request request)
        {
            _appQuoteServiceUrl = _appSettings.GetSetting("App.Quote.Url");
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
            _appOrderServiceUrl = _appSettings.GetSetting("App.Order.Url");
            var url = _appOrderServiceUrl.AppendPathSegment("Find")
                        .SetQueryParams(new
                        {
                            orderParameters.Id,
                            orderParameters.CustomerPO,
                            orderParameters.Manufacturer,
                            orderParameters.CreatedFrom,
                            orderParameters.CreatedTo,
                            orderParameters.Status,
                            Sort = orderParameters.SortBy,
                            SortAscending = orderParameters.SortAscending.ToString(),
                            orderParameters.PageSize,
                            Page = orderParameters.PageNumber,
                            WithPaginationInfo = orderParameters.WithPaginationInfo,
                            Details = true,
                            orderParameters.OrderMethod
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
                ShipTo = GenerateAddress("ShipTo"),
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

                for (var i = 0; i < 3; i++)
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
            query.SortBy = _helperService.GetParameterName(query.SortBy);
            _appQuoteServiceUrl = _appSettings.GetSetting("App.Quote.Url");
            var quoteURL = _appQuoteServiceUrl.AppendPathSegment("Find").BuildQuery(query);
            //we need to fix this issue
            quoteURL = quoteURL.ToString().Replace("=False", "=false");
            quoteURL = quoteURL.ToString().Replace("=True", "=true");
            var getQuoteResponse = await _middleTierHttpClient.GetAsync<FindResponse<IEnumerable<QuoteModel>>>(quoteURL);
            return getQuoteResponse;
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

            var response = new PricingConditionsModel
            {
                Items = lstPricingConditions
            };

            return await Task.FromResult(response);
        }

        public async Task<CreateModelResponse> CreateQuote(CreateQuote.Request request)
        {
            _appQuoteServiceUrl = _appSettings.GetSetting("App.Quote.Url");
            var createQuoteUrl = _appQuoteServiceUrl + "/Create";
            CreateModelResponse response;
            try
            {
                response = await _middleTierHttpClient.PostAsync<CreateModelResponse>(createQuoteUrl, null, request.CreateModel);
            }
            catch (RemoteServerHttpException ex)
            {
                if (ex.Code == HttpStatusCode.BadRequest && ex.InnerException is RemoteServerHttpException innerException)
                {
                    object exceptionDetails = innerException?.Details;
                    object body = exceptionDetails?.GetType().GetProperty("Body")?.GetValue(exceptionDetails, null);
                    response = JsonConvert.DeserializeObject<CreateModelResponse>(body as string);
                }
                else
                {
                    throw;
                }
            }
            return response;
        }

        public async Task<CreateModelResponse> CreateQuoteFromActiveCart(CreateQuoteFrom.Request request)
        {
            CreateQuoteRequest(request.CreateModelFrom);
            ActiveCartModel activeCart = await _cartService.GetActiveCartAsync();
            if (activeCart.Items != null)
            {
                request.CreateModelFrom.Items = new List<ItemModel>();
                foreach (var cartLine in activeCart.Items)
                {
                    var item = new ItemModel();
                    item.Id = cartLine.ItemId;
                    item.Product = new List<ProductModel> {
                        new ProductModel {
                            Id = cartLine.ProductId,
                            Manufacturer = cartLine.ProductId, // call product service to get mfg part #
                            Name = cartLine.ProductId,
                            Type = "1",
                        }
                    };
                    item.Quantity = cartLine.Quantity;
                    request.CreateModelFrom.Items.Add(item);
                }
            }
            var response = await CallCreateQuote(request.CreateModelFrom);
            return response;
        }

        public async Task<CreateModelResponse> CreateQuoteFromSavedCart(CreateQuoteFrom.Request request)
        {
            SavedCartDetailsModel savedCart = await _cartService.GetSavedCartDetailsAsync(request.CreateModelFrom.CreateFromId);
            if (savedCart == null)
            {
                throw new UIServiceException("Invalid savedCartId: " + request.CreateModelFrom.CreateFromId, (int)UIServiceExceptionCode.GenericBadRequestError);
            }
            CreateQuoteRequest(request.CreateModelFrom);
            var createQuoteFrom = request.CreateModelFrom;

            if (savedCart.Items != null)
            {
                createQuoteFrom.Items = new List<ItemModel>();
                foreach (var cartLine in savedCart.Items)
                {
                    var itemModel = new ItemModel();
                    itemModel.Id = cartLine.ItemId;
                    itemModel.Product = new List<ProductModel> {
                        new ProductModel { Id = cartLine.ProductId, Manufacturer = cartLine.ProductId, Name = cartLine.ProductId, Type = "1", }
                    };
                    itemModel.Quantity = cartLine.Quantity;
                    createQuoteFrom.Items.Add(itemModel);
                }
            }
            //get order LEVEL and Type 



            var response = await CallCreateQuote(createQuoteFrom);
            return response;
        }

        public async Task<CreateModelResponse> CreateQuoteFromEstimationId(CreateQuoteFrom.Request request)
        {
            // TO_DO: Missing implementation, so we return dummy response for now           

            var response = new CreateModelResponse
            {
                Id = "TIW777" + GetRandomNumber(10000, 60000),
                Confirmation = "CONFIRM_" + GetRandomNumber(10000, 60000),
            };
            return await Task.FromResult(response);
        }

        public async Task<UpdateQuote.Response> UpdateQuote(UpdateQuote.Request request)
        {
            // TO_DO: 2021-04-30 the Update quote method doesn't exist yet on AppQuote side
            _appQuoteServiceUrl = _appSettings.GetSetting("App.Quote.Url");
            var url = _appQuoteServiceUrl + "/Update";
            var result = await _middleTierHttpClient.PostAsync<QuoteModel>(url, null, request.QuoteToUpdate);
            var response = new UpdateQuote.Response(result);
            return await Task.FromResult(response);
        }


        private void CreateQuoteRequest(CreateModelFrom createModelFrom)
        {
            if (_uiContext.User != null)
            {
                var contactList = new List<ContactModel>
                {
                    new ContactModel { Email =  _uiContext.User.Email, Name = _uiContext.User.FirstName + " " + _uiContext.User.LastName, Phone = _uiContext.User.Phone }
                };
                _helperService.GetOrderPricingConditions(createModelFrom.PricingCondition, out TypeModel orderType, out LevelModel orderLevel);
                createModelFrom.Type = orderType;
                createModelFrom.Level = orderLevel;
                createModelFrom.SalesOrg = "0100"; // read from user context once it is available
                var customerAddress = GetAddress("CUS", false).Result;
                // map customer address 
                createModelFrom.ShipTo = _mapper.Map<ShipToModel>(customerAddress.ToList().FirstOrDefault().addresses.ToList().FirstOrDefault());
                createModelFrom.Reseller = new ResellerModel
                {
                    Name = _uiContext.User.ActiveCustomer == null ? _uiContext.User.CustomerList.FirstOrDefault().CustomerName : _uiContext.User.ActiveCustomer.CustomerNumber,
                    Id = _uiContext.User.ActiveCustomer == null ? _uiContext.User.CustomerList.FirstOrDefault().CustomerNumber : _uiContext.User.ActiveCustomer.CustomerNumber,
                    Contact = contactList
                };
                createModelFrom.EndUser = new EndUserModel
                {
                    Address = createModelFrom.ShipTo.Address,
                    Contact = contactList,
                    Name = _uiContext.User.ActiveCustomer == null ? _uiContext.User.CustomerList.FirstOrDefault().CustomerName : _uiContext.User.ActiveCustomer.CustomerNumber,
                    Id = _uiContext.User.ActiveCustomer == null ? _uiContext.User.CustomerList.FirstOrDefault().CustomerNumber : _uiContext.User.ActiveCustomer.CustomerNumber,
                };
                createModelFrom.Creator = _uiContext.User.ID;
            }

            createModelFrom.CustomerPo = "";
            createModelFrom.EndUserPo = "";
            createModelFrom.Agreements = null;
            createModelFrom.VendorReference = new VendorReferenceModel
            {
                Type = "",
                Value = ""
            };
            createModelFrom.TargetSystem = "R3"; // verify logic for this

        }

        private async Task<CreateModelResponse> CallCreateQuote(CreateModelFrom createQuoteFrom)
        {
            _appQuoteServiceUrl = _appSettings.GetSetting("App.Quote.Url");
            var createQuoteUrl = _appQuoteServiceUrl + "/Create";
            _logger.LogInformation("Calling App-Quote to create a quote \r\n" + JsonConvert.SerializeObject(createQuoteFrom, Formatting.Indented));
            var response = await _middleTierHttpClient.PostAsync<CreateModelResponse>(createQuoteUrl, null, createQuoteFrom);
            return response;
        }

        private async Task<IEnumerable<AccountAddressDetails>> GetAddress(string criteria, bool ignoreSalesOrganization)
        {
            var customerId = _uiContext.User.Customers.FirstOrDefault();
            _customerServiceURL = _appSettings.GetSetting("App.Customer.Url");
            var customerURL = _customerServiceURL.BuildQuery("Id=" + customerId);
            var response = await _middleTierHttpClient.GetAsync<IEnumerable<AccountAddressDetails>>(customerURL);
            if (response.Any())
            {
                if (response.FirstOrDefault().addresses.Any() && criteria != "ALL" && ignoreSalesOrganization == false)
                    response.FirstOrDefault().addresses = response.FirstOrDefault().addresses.Where(t => t.AddressType.ToUpper() == criteria && t.SalesOrganization == "0100").ToList(); //t.SalesOrganization == "0100" read from uiContext once it is available
                else if (response.FirstOrDefault().addresses.Any() && criteria != "ALL" && ignoreSalesOrganization == true)
                    response.FirstOrDefault().addresses = response.FirstOrDefault().addresses.Where(t => t.AddressType.ToUpper() == criteria).ToList(); //t.SalesOrganization == "0100" read from uiContext once it is available
                else if (response.FirstOrDefault().addresses.Any() && ignoreSalesOrganization == false)
                    response.FirstOrDefault().addresses = response.FirstOrDefault().addresses.Where(t => t.SalesOrganization == "0100").ToList(); // use sales organization from user context
                else
                    return response;
            }
            return response;
        }
    }
}