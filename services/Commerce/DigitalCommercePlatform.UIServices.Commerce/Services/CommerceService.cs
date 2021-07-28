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
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal.Estimate;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal.Product;
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
        private string _appConfigServiceURL;
        private string _appProductServiceURL;
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
            var origin = string.IsNullOrWhiteSpace(orderParameters.Origin)?null: orderParameters.Origin.ToLower();

            if (origin == "web")
                orderParameters.Origin = "Web";
            else if (origin == "edi")
                orderParameters.Origin = "B2B";
            else if (origin == "pe" )
                orderParameters.Origin = "Manual";
            else if (origin == "xml")
                orderParameters.Origin = "B2B";
            else
                orderParameters.Origin = null;
            
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
                            orderParameters.Origin
                        });

            var findOrdersDto = await _middleTierHttpClient.GetAsync<OrdersContainer>(url);
            return findOrdersDto;
        }


        public async Task<QuotePreviewModel> QuotePreview(GetQuotePreviewDetails.Request request)
        {
            if (request.IsEstimateId)
            {
                QuotePreviewModel preview = await CreateResponseUsingEstimateId(request);
                return preview;
            }
            return await Task.FromResult(new QuotePreviewModel());

        }



        public static int GetRandomNumber(int min, int max)
        {
            return getrandom.Next(min, max);
        }

        public async Task<FindResponse<IEnumerable<QuoteModel>>> FindQuotes(FindModel query)
        {
            try
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
            catch (RemoteServerHttpException ex)
            {
                _logger.LogError(ex, "Exception at : " + nameof(CommerceService));
                throw new UIServiceException( ex.Message, (int)UIServiceExceptionCode.GenericBadRequestError);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at Generating Quote grid: " + nameof(CommerceService));
                throw ex;
            }

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

        #region Private Methods

        private async Task<QuotePreviewModel> CreateResponseUsingEstimateId(GetQuotePreviewDetails.Request request)
        {
            _appConfigServiceURL = _appSettings.GetSetting("App.Configuration.Url");
            _appProductServiceURL = _appSettings.GetSetting("App.Product.Url");


            try
            {
                var url = _appConfigServiceURL.AppendPathSegment("find")
                      .SetQueryParams(new
                      {
                          Id = request.Id,
                          Details = true,
                          PageSize = 1,
                          PageNumber = 1,
                          WithPaginationInfo = false
                      });

                var configurationFindResponse = await _middleTierHttpClient
                        .GetAsync<FindResponse<List<DetailedDto>>>(url);
                var data = configurationFindResponse.Data;

                var quotePreview = _mapper.Map<QuotePreview>(configurationFindResponse.Data.FirstOrDefault());


                MapEndUserAndReseller(configurationFindResponse, quotePreview); // Fix this using AutoMapper
               
                string productUrl = "";
                string productId = "";
                string manufacturer = "";
                string system = configurationFindResponse?.Data?.FirstOrDefault()?.Source.System;
                string[] arrProductIds = new string[quotePreview.Items.Count];
                string[] arrManufacturer = new string[quotePreview.Items.Count];
                ProductData productDetails;

                //convert for-each statment to linq statment after App-Service is ready.
                int i = 0;
                foreach (var item in quotePreview.Items)
                {
                    productId = item?.VendorPartNo ?? ""; // Fix this once app service is ready
                    item.VendorPartNo = productId; // this is temp solution till APP service start returning real data Fix this once app service is ready                    
                    item.Manufacturer = item.Manufacturer ??system;
                    manufacturer = item.Manufacturer ?? system;
                    arrManufacturer[i] = manufacturer;
                    arrProductIds[i] = productId;
                    i++;
                }

                // call product app service
                productUrl = _appProductServiceURL.AppendPathSegment("Find")
                 .SetQueryParams(new
                 {
                     MfrPartNumber = arrProductIds,
                     Details = true,
                     SalesOrganization = "0100",//_uiContext.User.ActiveCustomer.SalesDivision.FirstOrDefault().SalesOrg; Goran Needs to Fix this
                     Manufacturer = arrManufacturer
                 });
               
                productDetails = await _middleTierHttpClient.GetAsync<ProductData>(productUrl);

                ProductsModel product;
                foreach (var line in quotePreview.Items)
                {

                    product = productDetails.Data.Where(p => p.ManufacturerPartNumber == line.VendorPartNo).FirstOrDefault();
                    if (product != null && line != null)
                    {
                        line.TDNumber = product?.Source.ID;
                        line.URLProductImage = product?.Images?.Where(a => a.Key == "75x75")?.FirstOrDefault().Value?.FirstOrDefault().Url;
                        line.MSRP = product?.Price?.UnpromotedPrice;
                        line.MFRNumber = product?.ManufacturerPartNumber;
                    }
                }
                
                QuotePreviewModel response = new QuotePreviewModel
                {
                    QuoteDetails = quotePreview
                };
                return response;

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at searching configurations : " + nameof(CommerceService));
                throw;
            }
        }

        private bool MapEndUserAndReseller(FindResponse<List<DetailedDto>> configurationFindResponse, QuotePreview quotePreview)
        {
            if (configurationFindResponse.Data?.FirstOrDefault().EndUser != null)
            {
                var objEndUser = configurationFindResponse.Data?.FirstOrDefault().EndUser;
                Address endUser = new Address
                {
                    Line1 = objEndUser?.Address.Address1,
                    Line2 = objEndUser?.Address.Address2,
                    Line3 = objEndUser?.Address.Address3,
                    State = objEndUser?.Address.City,
                    Country = objEndUser?.Address.Country,
                    PostalCode = objEndUser?.Address.PostalCode,
                    Email = objEndUser?.Contact?.EmailAddress,
                    Name = objEndUser?.Contact?.FirstName + " " + objEndUser?.Contact?.LastName,
                };
                quotePreview.EndUser = new List<Address> { endUser };
            }

            if (configurationFindResponse.Data?.FirstOrDefault().Reseller != null)
            {
                var objReseller = configurationFindResponse.Data?.FirstOrDefault().Reseller;
                Address reseller = new Address
                {
                    Line1 = objReseller?.Address?.Address1,
                    Line2 = objReseller?.Address?.Address2,
                    Line3 = objReseller?.Address?.Address3,
                    State = objReseller?.Address?.City,
                    Country = objReseller?.Address?.Country,
                    PostalCode = objReseller?.Address?.PostalCode,
                    Email = objReseller?.ContactModel?.EmailAddress,
                    CompanyName = objReseller?.Name,
                    Name = objReseller?.ContactModel?.FirstName + " " + objReseller?.ContactModel?.LastName,
                };
                quotePreview.Reseller = new List<Address> { reseller };
            }
            return true;
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

        #endregion
    }
}