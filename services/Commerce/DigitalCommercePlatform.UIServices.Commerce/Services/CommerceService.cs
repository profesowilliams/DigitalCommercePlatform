//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetPricingCondition;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Actions.QuotePreviewDetail;
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Create;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Find;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal.Estimate;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal.Product;
using DigitalCommercePlatform.UIServices.Commerce.Models.Return;
using DigitalCommercePlatform.UIServices.Common.Cart.Contracts;
using DigitalCommercePlatform.UIServices.Common.Cart.Models.Cart;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Services.UI.ExceptionHandling;
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
using ContactModel = DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal.ContactModel;

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

            Models.Order.Internal.OrderModel result = PopulateOrderDetails(getOrderByIdResponse?.FirstOrDefault());
            return result;
        }

        private Models.Order.Internal.OrderModel PopulateOrderDetails(Models.Order.Internal.OrderModel order)
        {
            order.Tax = order.Items.Where(t => t.Tax.HasValue).Sum(t => t.Tax.Value);
            order.Freight = order.Items.Where(t => t.Freight.HasValue).Sum(t => t.Freight.Value);
            order.OtherFees = order.Items.Where(t => t.OtherFees.HasValue).Sum(t => t.OtherFees.Value);
            order.SubTotal = order.TotalCharge == null ? 0 : order.TotalCharge;
            decimal? subtotal = order.SubTotal == null ? 0 : order.SubTotal;
            decimal? Other = order.OtherFees == null ? 0 : order.OtherFees;
            decimal? Freight = order.Freight == null ? 0 : order.Freight;
            decimal? Tax = +order.Tax == null ? 0 : order.Tax;

            order.Total = subtotal + Other + Freight + Tax;

            return order;
        }

        public async Task<List<Line>> PopulateLinesFor(List<Line> items, string vendorName)
        {
            _appProductServiceURL = _appSettings.GetSetting("App.Product.Url");
            string productUrl = "";
            string productId = "";
            string manufacturer = "";
            string system = vendorName;//configurationFindResponse?.Data?.FirstOrDefault()?.Vendor.Name;
            string[] arrProductIds = new string[items.Count];
            string[] arrManufacturer = new string[items.Count];
            ProductData productDetails;

            //convert for-each statment to linq statment after App-Service is ready.
            int i = 0;
            foreach (var item in items)
            {
                productId = item?.VendorPartNo ?? item?.MFRNumber?? ""; // Fix this once app service is ready
                if (!string.IsNullOrWhiteSpace(productId) && !arrProductIds.Contains(productId))
                {

                    item.VendorPartNo = productId; // this is temp solution till APP service start returning real data Fix this once app service is ready
                    item.Manufacturer = item.Manufacturer ?? system;
                    manufacturer = item.Manufacturer ?? system;
                    arrManufacturer[i] = manufacturer;
                    arrProductIds[i] = productId;
                    i++;
                }
            }

            arrManufacturer = arrManufacturer.Where(c => c != null).Distinct().ToList().ToArray();
            arrProductIds = arrProductIds.Where(c => c != null).Distinct().ToList().ToArray();
            // call product app service
            productUrl = _appProductServiceURL.AppendPathSegment("Find")
             .SetQueryParams(new
             {
                 MfrPartNumber = arrProductIds,
                 Details = true,
                 SalesOrganization = "0100",//_uiContext.User.ActiveCustomer.SalesDivision.FirstOrDefault().SalesOrg,//"0100"; Goran Needs to Fix this
                 Manufacturer = arrManufacturer
             });
            
            try
            {
                productDetails = await _middleTierHttpClient.GetAsync<ProductData>(productUrl);
                ProductsModel product;
                foreach (var line in items)
                {
                    product = productDetails.Data.Where(p => p.ManufacturerPartNumber == line.VendorPartNo).FirstOrDefault();
                    if (product != null && line != null)
                    {
                        line.ShortDescription = string.IsNullOrWhiteSpace(product?.ShortDescription) ? line.ShortDescription : product?.ShortDescription;
                        line.TDNumber = product?.Source.ID;
                        line.URLProductImage = GetImageUrlForProduct(product);
                        line.Images = product.Images;
                        line.MSRP = product?.Price?.UnpromotedPrice;
                        line.MFRNumber = product?.ManufacturerPartNumber;
                    }
                }
            }
            catch (Exception ex )
            {
                _logger.LogError(ex, "Exception at getting product details : " + nameof(CommerceService));
            }            

            return items;
        }

        private static string GetImageUrlForProduct(ProductsModel product)
        {
            if (product.Images != null)
            {
                if (product?.Images?.Count == 1)
                    return product?.Images.FirstOrDefault().Value?.FirstOrDefault().Url;
                else if (product.Images.Where(a => a.Key == "75x75").Any())
                    return product.Images.Where(a => a.Key == "75x75").FirstOrDefault().Value.FirstOrDefault().Url;
                else
                    return product?.Images.FirstOrDefault().Value?.FirstOrDefault().Url;
            }

            return string.Empty;
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
            var origin = string.IsNullOrWhiteSpace(orderParameters.Origin) ? null : orderParameters.Origin.ToLower();

            if (origin == "web")
                orderParameters.Origin = "Web";
            else if (origin == "b2b")
                orderParameters.Origin = "B2B";
            else if (origin == "pe")
                orderParameters.Origin = "Manual";
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
                            orderParameters.Origin,
                            orderParameters.ConfirmationNumber,
                            orderParameters.InvoiceId
                        });

            var findOrdersDto = await _middleTierHttpClient.GetAsync<OrdersContainer>(url);

            foreach (var item in findOrdersDto.Data)
            {
                var invoiceDetails = item.Items?.SelectMany(i => i.Invoices)
               .Select(i => new InvoiceModel { ID = i.ID }).ToList();
                var invoices = invoiceDetails.Select(i => i.ID).Distinct().ToList();

                if (invoices.Any())
                {
                    foreach (var invoice in invoices)
                    {
                        var _appreturn = _appSettings.GetSetting("App.Return.Url");
                        _appreturn = _appreturn.AppendPathSegment("/Find").SetQueryParam("details=true&invoiceNumber", invoice);

                        var findReturnsDTO = await _middleTierHttpClient.GetAsync<FindResponse<IEnumerable<ReturnModel>>>(_appreturn);
                        if (findReturnsDTO.Data.Any())
                        {
                            item.Return = true;
                            break;
                        }
                    }
                }
            }
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
                throw new UIServiceException(ex.Message, (int)UIServiceExceptionCode.GenericBadRequestError);
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

            lstPricingConditions.Add(new PricingCondition("Commercial (Non-Govt)", "Commercial"));
            lstPricingConditions.Add(new PricingCondition("Education (Student, Staff)", "EduStudentStaff"));
            lstPricingConditions.Add(new PricingCondition("Education (Higher)", "EduHigher"));
            lstPricingConditions.Add(new PricingCondition("Education (K - 12)", "EduK12"));
            lstPricingConditions.Add(new PricingCondition("Education E-Rate (K - 12)", "EduErate"));
            lstPricingConditions.Add(new PricingCondition("Federal", "GovtFederal"));
            lstPricingConditions.Add(new PricingCondition("Federal GSA", "GovtFederalGSA"));
            lstPricingConditions.Add(new PricingCondition("Local", "GovtLocal"));
            lstPricingConditions.Add(new PricingCondition("State", "GovtState"));
            lstPricingConditions.Add(new PricingCondition("Medical", "Medical"));
            lstPricingConditions.Add(new PricingCondition("SEWP Contract", "SEWPContract "));

            var response = new PricingConditionsModel
            {
                Items = lstPricingConditions
            };

            return await Task.FromResult(response);
        }

        public async Task<CreateModelResponse> CreateQuoteFrom(CreateQuote.Request request)
        {
            var createQuoteRequest = CreateQuoteRequestFromQuotePreview(request.CreateModel);


            //await CallCreateQuote(createQuoteRequest); // we need to call this method 
           
            _appQuoteServiceUrl = _appSettings.GetSetting("App.Quote.Url");
            var createQuoteUrl = _appQuoteServiceUrl + "/Create";
            CreateModelResponse response;
            try
            {
                response = await _middleTierHttpClient.PostAsync<CreateModelResponse>(createQuoteUrl, null, createQuoteRequest);
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

        private CreateQuoteModel CreateQuoteRequestFromQuotePreview(QuotePreviewModel input)
        {
            CreateQuoteModel createModelFrom = new CreateQuoteModel();

            if (_uiContext.User != null)
            {
                input.QuoteDetails.Tier = string.IsNullOrWhiteSpace(input.QuoteDetails.Tier) ? "Commercial" : input.QuoteDetails.Tier;
                _helperService.GetOrderPricingConditions(input.QuoteDetails.Tier, out TypeModel orderType, out LevelModel orderLevel);
                createModelFrom.Type = orderType;
                createModelFrom.Level = orderLevel;
                createModelFrom.SalesOrg = "0100"; // read from user context once it is available
                var customerAddress = GetAddress("CUS", false).Result;
                // map customer address
                createModelFrom.ShipTo = _mapper.Map<ShipToModel>(customerAddress.ToList().FirstOrDefault().addresses.ToList().FirstOrDefault());
                createModelFrom.Reseller = new ResellerModel
                {
                    Address = MapAddress(input.QuoteDetails.Reseller),
                    Name = input.QuoteDetails.Reseller.FirstOrDefault().CompanyName,
                    Id = input.QuoteDetails.Reseller.FirstOrDefault().Id,
                    Contact = new List<ContactModel> { new ContactModel { Email = input.QuoteDetails.Reseller.FirstOrDefault().ContactEmail, Name = input.QuoteDetails.Reseller.FirstOrDefault().Name, Phone = input.QuoteDetails.Reseller.FirstOrDefault().PhoneNumber } },
                };
#if DEBUG
                input.QuoteDetails.EndUser = input.QuoteDetails.EndUser != null ? input.QuoteDetails.EndUser : input.QuoteDetails.Reseller;
#endif
                if ( input.QuoteDetails.EndUser != null)
                {
                    createModelFrom.EndUser = new EndUserModel
                    {
                        Address = MapAddress(input.QuoteDetails.EndUser),
                        Contact = new List<ContactModel> { new ContactModel { Email = input.QuoteDetails.EndUser.FirstOrDefault().ContactEmail, Name = input.QuoteDetails.EndUser.FirstOrDefault().Name, Phone = input.QuoteDetails.EndUser.FirstOrDefault().PhoneNumber } },
                        Name = input.QuoteDetails.EndUser.FirstOrDefault().CompanyName,
                        Id = input.QuoteDetails.EndUser.FirstOrDefault().Id,
                    };
                }
                createModelFrom.Creator = _uiContext.User.ID;
            }
            MapQuoteLinesForCreatingQuote(createModelFrom, input);
            createModelFrom.CustomerPo = "";
            createModelFrom.EndUserPo = "";
            createModelFrom.Agreements = null;

            if (input.QuoteDetails.Source != null)
            {
                createModelFrom.VendorReference = new VendorReferenceModel
                {
                    Type = input.QuoteDetails.Source.Type ?? string.Empty,  // Expected Values : Estimate / Renewal / VendorQuote / ""
                    Value = input.QuoteDetails.Source.Value ?? string.Empty // 
                };
            }
            createModelFrom.TargetSystem = "R3"; // verify logic for this
            return createModelFrom;
        }

        private void MapQuoteLinesForCreatingQuote(CreateQuoteModel createModelFrom, QuotePreviewModel input)
        {
            if (input.QuoteDetails.Items == null) 
                return;

            var lstItems = new List<ItemModel>();
            foreach (var item in input.QuoteDetails.Items)
            {
                ItemModel requestItem = GetLinesforRequest(item);
                lstItems.Add(requestItem);
                
                if (item.Children !=null)
                {
                    foreach (var subline in item.Children)
                    {
                        ItemModel sublineItem = GetLinesforRequest(subline);
                        lstItems.Add(sublineItem);
                    } 
                }
                
            }
            createModelFrom.Items = lstItems;            
        }

        private ItemModel GetLinesforRequest(Line item)
        {
            var lstProduct = new List<ProductModel>{
                    new ProductModel {
                        Id = item.TDNumber?? item.MFRNumber,
                        Type = !string.IsNullOrWhiteSpace(item.TDNumber) ? "TECHDATA" : "MANUFACTURER",
                        Manufacturer = item.Manufacturer,
                        Name = item.ShortDescription
                    }
                };

            var requestItem = new ItemModel
            {
                Id = item.Id,
                Parent = item.Parent,
                Quantity = item.Quantity,
                UnitPrice = (decimal)item.UnitPrice,
                UnitListPrice = (decimal)item.UnitPrice,
                ExtendedListPrice = (decimal)item.UnitPrice * item.Quantity,
                TotalPrice = (decimal)item.UnitPrice * item.Quantity,
                UnitCost = (decimal)item.UnitPrice,
                Product = lstProduct
            };
            return requestItem;
        }

        private Models.Quote.Quote.Internal.AddressModel MapAddress(List<Address> addressList)
        {
            if (addressList.Any())
            {
                var requestAddress = addressList.FirstOrDefault();
                var address = new Models.Quote.Quote.Internal.AddressModel
                {
                    City = requestAddress.City,
                    Country = requestAddress.Country,
                    Id = requestAddress.Id,
                    Line1 = requestAddress.Line1,
                    Line2 = requestAddress.Line2,
                    Line3 = requestAddress.Line3,
                    State = requestAddress.State,
                    PostalCode = requestAddress.PostalCode
                };
                return address;
            }
            else
                return new Models.Quote.Quote.Internal.AddressModel();
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
                    decimal tmpvalue;
                    decimal? result = null;

                    if (decimal.TryParse(Convert.ToString(cartLine.Quantity), out tmpvalue))
                        result = tmpvalue;
                    item.Quantity = result;
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
                    decimal tmpvalue;
                    decimal? result = null;

                    if (decimal.TryParse(Convert.ToString(cartLine.Quantity), out tmpvalue))
                        result = tmpvalue;

                    itemModel.Quantity = result;
                    createQuoteFrom.Items.Add(itemModel);
                }
            }
            //get order LEVEL and Type

            var response = await CallCreateQuote(createQuoteFrom);
            return response;
        }

        public async Task<CreateModelResponse> CreateQuoteFromExpired(CreateQuoteFrom.Request request)
        {
            // TO_DO: App Sercice Missing implementation, so we return dummy response for now
            //var response = await CallCreateQuote(request.CreateModelFrom);
            //return response;
            // delete below code once App-Service implementation is available
            var response = new CreateModelResponse
            {
                Id = "QuoteId_" + GetRandomNumber(10000, 60000),
                Confirmation = "Confirm_" + GetRandomNumber(10000, 60000),
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

                MapEndUserAndResellerForQuotePreview(configurationFindResponse, quotePreview); 
                quotePreview.Items = await PopulateLinesFor(quotePreview.Items, configurationFindResponse?.Data?.FirstOrDefault()?.Vendor.Name);
                
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

        private bool MapEndUserAndResellerForQuotePreview(FindResponse<List<DetailedDto>> configurationFindResponse, QuotePreview quotePreview)
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

        #endregion Private Methods
    }
}
