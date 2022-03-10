//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetPricingCondition;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Actions.QuotePreviewDetail;
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Create;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Find;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal.Estimate;
using DigitalCommercePlatform.UIServices.Common.Cart.Contracts;
using DigitalCommercePlatform.UIServices.Common.Cart.Models.Cart;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Client.Exceptions;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI.ExceptionHandling;
using Flurl;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using ContactModel = DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal.ContactModel;

namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    public class CommerceService : ICommerceService
    {
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly ILogger<CommerceService> _logger;
        private readonly IHelperService _helperService;
        private readonly ICartService _cartService;
        private readonly IUIContext _uiContext;
        private readonly IAppSettings _appSettings;
        private static readonly Random getrandom = new();
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

        public async Task<QuoteModel> GetQuote(GetQuote.Request request)
        {
            string _appQuoteServiceUrl = _appSettings.GetSetting("App.Quote.Url");

            var quoteURL = _appQuoteServiceUrl.BuildQuery(request);

            var getQuoteResponse = await _middleTierHttpClient.GetAsync<IEnumerable<QuoteModel>>(quoteURL);

            var response = getQuoteResponse?.FirstOrDefault();

            if (response != null)
            {
                response = MapAnnuity(response);
                MapEndUserName(response);
            }

            return response;
        }

        private void MapEndUserName(QuoteModel response)
        {
            if ((response?.EndUser!=null) && (bool)response?.EndUser?.Contact?.Any())
            {
                response.EndUser.Contact.FirstOrDefault().Name = response.EndUser.Contact.FirstOrDefault().Name ?? "";
                response.EndUser.Contact.FirstOrDefault().Name = response.EndUser.Contact.FirstOrDefault().Name.Contains("..") ? "" : response.EndUser.Contact.FirstOrDefault().Name;
            }
        }

        private QuoteModel MapAnnuity(QuoteModel input)
        {
            if (input.Items.Any())
            {
                foreach (var line in input.Items)
                {
                    BuildAnnuity(line);
                }
            }
            return input;
        }

        private void BuildAnnuity(ItemModel line)
        {
            try
            {
                var attribute = line.Attributes.Where(x => x.Name.ToLower().Equals("materialtype")).FirstOrDefault();
                if (string.Equals(attribute?.Value?.ToLower(), "service"))
                {
                    var startDate = DateTime.TryParseExact(line.Attributes.FirstOrDefault(x => x.Name.ToLower().Equals("requestedstartdate"))?.Value, "MM/dd/yyyy", CultureInfo.InvariantCulture,
                    DateTimeStyles.None, out var sdt) ? sdt : null as DateTime?;
                    var endDate = DateTime.TryParseExact(line.Attributes.FirstOrDefault(x => x.Name.ToLower().Equals("requestedenddate"))?.Value, "MM/dd/yyyy", CultureInfo.InvariantCulture,
                    DateTimeStyles.None, out var edt) ? edt : null as DateTime?;
                    line.Annuity = new Annuity
                    {
                        BillingFrequency = line.Attributes.Where(x => x.Name.ToLower().Equals("billingterm")).FirstOrDefault()?.Value ?? string.Empty,
                        StartDate = startDate,
                        EndDate = endDate,
                        Duration = line.Attributes.Where(x => x.Name.ToLower().Equals("initialterm")).FirstOrDefault()?.Value ?? string.Empty, // or use servicelength                             
                        AutoRenewal = line.Attributes.Where(x => x.Name.ToLower().Equals("autorenewalterm")).Any()
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogInformation("Error ocuured at BuildAnnuity" + ex, ex.Message);
            }
        }

        public Task<string> GetQuotes(string Id)
        {
            throw new NotImplementedException();
        }


        public async Task<QuotePreviewModel> QuotePreview(GetQuotePreviewDetails.Request request)
        {
            if (request.IsEstimateId)
            {
                return await CreateResponseUsingEstimateId(request);
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
                if (!string.IsNullOrWhiteSpace(query.Id))
                {
                    query.Id += "*";
                }
                else if (!string.IsNullOrWhiteSpace(query.EndUserName))
                {
                    query.EndUserName += "*";
                }
                else if (!string.IsNullOrWhiteSpace(query.DealId))
                {
                    query.DealId += "*";
                }

                query.CreatedFrom = _helperService.GetDateParameter((DateTime)query.CreatedFrom, "from");
                query.CreatedTo = _helperService.GetDateParameter((DateTime)query.CreatedTo, "to");
                query.SortBy = _helperService.GetParameterName(query.SortBy);
                string _appQuoteServiceUrl = _appSettings.GetSetting("App.Quote.Url");
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
            if (!request.IsSPAFind)
            {
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
            }
            else
            {
                lstPricingConditions.Add(new PricingCondition("Commercial (Non-Govt)", "Commercial"));
                lstPricingConditions.Add(new PricingCondition("Higher Education", "EduHigher"));
                lstPricingConditions.Add(new PricingCondition("Lower Education", "EduK12"));
                lstPricingConditions.Add(new PricingCondition("State", "GovtState"));
                lstPricingConditions.Add(new PricingCondition("Federal", "GovtFederal"));
                lstPricingConditions.Add(new PricingCondition("Medical", "Medical"));
            }

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

            string _appQuoteServiceUrl = _appSettings.GetSetting("App.Quote.Url");
            var createQuoteUrl = _appQuoteServiceUrl + "/CreateAsync";
            CreateModelResponse response;
            _logger.LogInformation("Calling App-Quote to create a quote \r\n" + JsonConvert.SerializeObject(createQuoteRequest, Formatting.Indented));
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
                    _logger.LogInformation("error while create a quote " + ex.Message);
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
                createModelFrom.VendorQuoteType = input.QuoteDetails?.Source?.Type ?? string.Empty;
                createModelFrom.System = "Q";
                input.QuoteDetails.BuyMethod = input.QuoteDetails?.BuyMethod ?? "tdavnet67";
                if (input.QuoteDetails.BuyMethod.ToLower().Equals("tdavnet67"))
                {
                    createModelFrom.TargetSystem = "ECC";
                }
                else
                {
                    createModelFrom.TargetSystem = "R3";
                }
                input.QuoteDetails.Tier = string.IsNullOrWhiteSpace(input.QuoteDetails.Tier) ? "Commercial" : input.QuoteDetails.Tier;
                _helperService.GetOrderPricingConditions(input.QuoteDetails.Tier, out TypeModel orderType, out LevelModel orderLevel);
                createModelFrom.Type = orderType;
                createModelFrom.Level = orderLevel;
                createModelFrom.SalesOrg = "0100"; // read from user context once it is available
                var customerAddress = GetAddress("CUS", false).Result;
                // map customer address
                createModelFrom.ShipTo = _mapper.Map<ShipToModel>(customerAddress.ToList().FirstOrDefault().addresses.ToList().FirstOrDefault());
                string contactName = string.Empty;

                if (string.IsNullOrWhiteSpace(input.QuoteDetails?.Reseller.FirstOrDefault().Name))
                {
                    contactName = _uiContext.User?.FirstName + " " + _uiContext.User?.LastName;
                }
                else
                {
                    contactName = input.QuoteDetails?.Reseller.FirstOrDefault().Name;
                }


                createModelFrom.Reseller = new ResellerModel
                {
                    Address = MapAddress(input.QuoteDetails.Reseller),
                    Name = input.QuoteDetails.Reseller.FirstOrDefault().CompanyName ?? _uiContext.User.ActiveCustomer.CustomerName,
                    Id = input.QuoteDetails.Reseller.FirstOrDefault().Id ?? _uiContext.User.ActiveCustomer.CustomerNumber,
                    Contact = new List<ContactModel> { new ContactModel {
                        Email = input.QuoteDetails.Reseller.FirstOrDefault().ContactEmail ?? _uiContext.User?.Email,
                        Name = contactName ,
                        Phone = input.QuoteDetails.Reseller.FirstOrDefault().PhoneNumber ??  _uiContext.User?.Phone} },
                };

                if (input.QuoteDetails.EndUser != null)
                {
                    createModelFrom.EndUser = new EndUserModel
                    {
                        Name = input.QuoteDetails.EndUser.FirstOrDefault()?.Name,
                        Address = MapAddress(input.QuoteDetails.EndUser, input.QuoteDetails.EndUser.FirstOrDefault()?.CompanyName),
                        Contact = new List<ContactModel> { new ContactModel { Email = input.QuoteDetails.EndUser.FirstOrDefault().ContactEmail, Name = input.QuoteDetails.EndUser.FirstOrDefault().Name, Phone = input.QuoteDetails.EndUser.FirstOrDefault().PhoneNumber } },
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
                var vendorAtribue = BuildAttribute(createModelFrom.VendorReference.Value, "ORIGINALESTIMATEID");
                createModelFrom.Attributes = new List<AttributeDto> { vendorAtribue };
            }

            return createModelFrom;
        }

        private void MapQuoteLinesForCreatingQuote(CreateQuoteModel createModelFrom, QuotePreviewModel input)
        {
            if (input.QuoteDetails.Items == null)
                return;

            var lstItems = new List<ItemModel>();
            string configId = string.Empty;
            string Type = input.QuoteDetails.Source?.Type.ToLower();

            if (!string.IsNullOrWhiteSpace(input.QuoteDetails.ConfigurationId))
            {
                configId = input.QuoteDetails.ConfigurationId;
            }
            GetQuotePreviewDetails.Request productRequest = new GetQuotePreviewDetails.Request(configId, true, "CISCO",Type);

            var configDetails = CreateResponseUsingEstimateId(productRequest);
            foreach (var item in input.QuoteDetails.Items)
            {

                ItemModel requestItem = GetLinesforRequest(item, configId, Type, configDetails);
                lstItems.Add(requestItem);

                if (item.Children != null)
                {
                    foreach (var subline in item.Children)
                    {
                        ItemModel sublineItem = GetLinesforRequest(subline, configId, Type, configDetails);
                        lstItems.Add(sublineItem);
                    }
                }

            }
            createModelFrom.Items = lstItems;
        }

        private void MapQuotePrice(Task<QuotePreviewModel> configDetails, Line item)
        {
            var configItem = configDetails.Result.QuoteDetails?.Items?.Where((i => (i.Id == item.Id && i.VendorPartNo?.ToUpper() == item.VendorPartNo.ToUpper()))).FirstOrDefault();

            if (configItem != null)
            {
                item.UnitPrice = configItem.UnitPrice;
                item.UnitListPrice = configItem.UnitListPrice;
                item.PurchaseCost = configItem.PurchaseCost;
            };
        }

        private ItemModel GetLinesforRequest(Line item, string id, string Type, Task<QuotePreviewModel> configDetails)
        {

            MapQuotePrice(configDetails, item);

            if (item.UnitPrice == null || item.UnitPrice < 0.1M)
                item.UnitPrice = item.UnitListPrice;

            if (Type.ToLower() == "estimate")
                item.PurchaseCost = item.UnitListPrice;

            var lstProduct = new List<ProductModel>{
                    new ProductModel {
                        Id = item.MFRNumber,   // always pass mfg part # bug # 240973
                        Type = "MANUFACTURER", // always pass "MANUFACTURER" # bug # 240973 ,
                        Manufacturer = item.Manufacturer,
                        Name = !string.IsNullOrWhiteSpace(item.ShortDescription) ?  item.ShortDescription : item.MFRNumber,
                    }
                };
            List<AttributeDto> lstAttributes = BuildLineAttibutes(item, id);

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
                Product = lstProduct,
                PurchaseCost = item.PurchaseCost,
                Attributes = lstAttributes,

            };
            return requestItem;
        }

        private List<AttributeDto> BuildLineAttibutes(Line item, string id)
        {
            List<AttributeDto> lstAttributes = new List<AttributeDto>();

            var vendorAtribue = BuildAttribute(id, "vendorquoteid");
            lstAttributes.Add(vendorAtribue);

            if (item?.Contract?.Duration != null)
            {
                var dealDuration = BuildAttribute(item.Contract.Duration, "DEALDURATION");
                lstAttributes.Add(dealDuration);
            }

            return lstAttributes;
        }

        private AttributeDto BuildAttribute(string id, string attributeName = "vendorquoteid")
        {
            if (string.IsNullOrWhiteSpace(id)) return new AttributeDto();

            return new AttributeDto { Name = attributeName, Value = id };
        }


        private Models.Quote.Quote.Internal.AddressModel MapAddress(List<Address> addressList, string companyName = "")
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
                    PostalCode = requestAddress.PostalCode,
                    Company = companyName
                };
                return address;
            }
            else
                return new Models.Quote.Quote.Internal.AddressModel();
        }

        public async Task<CreateModelResponse> CreateQuoteFromActiveCart(CreateQuoteFrom.Request request)
        {
            try
            {
                CreateQuoteRequest(request.CreateModelFrom);
                ActiveCartModel activeCart = await _cartService.GetActiveCartAsync();
                if (activeCart == null)
                {
                    throw new UIServiceException("Invalid Active Cart" + request.CreateModelFrom.CreateFromId, (int)UIServiceExceptionCode.GenericBadRequestError);
                }
                if (activeCart.Items != null)
                {
                    try
                    {
                        List<Common.Cart.Models.Cart.SavedCartLineModel> items = _helperService.PopulateSavedCartLinesForQuoteRequest(activeCart.Items);
                        request.CreateModelFrom.Items = _helperService.PopulateQuoteRequestLinesForAsync(items, request.CreateModelFrom.Type).Result;
                    }
                    catch (UIServiceException e)
                    {
                        var error = e.Message ?? "";
                        if (error.StartsWith("This create quote request contains", StringComparison.CurrentCultureIgnoreCase))
                            throw new UIServiceException(error, 11000);
                        else
                            throw new UIServiceException(e.Message, (int)UIServiceExceptionCode.GenericBadRequestError);
                    }
                    catch (Exception ex)
                    {
                        throw new UIServiceException(ex.Message, (int)UIServiceExceptionCode.GenericBadRequestError);
                    }
                }
                request.CreateModelFrom.TargetSystem = "R3";
                request.CreateModelFrom.System = "Q";
                var response = await CallCreateQuote(request.CreateModelFrom);
                return response;
            }
            catch (Exception ex)
            {
                //_logger.LogInformation("Error while creating Quote from Active Cart" + ex.Message);
                throw ex;
            }

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
                // call product service to get product details
                try
                {
                    createQuoteFrom.Items = _helperService.PopulateQuoteRequestLinesForAsync(savedCart.Items, request.CreateModelFrom.Type).Result;
                }
                catch (UIServiceException uiEx)
                {
                    if (uiEx.Message.StartsWith("This create quote request contains obsolete"))
                        throw new UIServiceException(uiEx.Message, 11000);
                    else
                        throw new UIServiceException(uiEx.Message, (int)UIServiceExceptionCode.GenericBadRequestError);
                }
                catch (Exception ex)
                {
                    throw ex;
                }

            }
            //get order LEVEL and Type
            createQuoteFrom.TargetSystem = "R3";
            createQuoteFrom.System = "Q";
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
            string _appQuoteServiceUrl = _appSettings.GetSetting("App.Quote.Url");
            var url = _appQuoteServiceUrl + "/Update";
            var result = await _middleTierHttpClient.PostAsync<QuoteModel>(url, null, request.QuoteToUpdate);
            var response = new UpdateQuote.Response(result);
            return await Task.FromResult(response);
        }

        #region Private Methods

        private async Task<QuotePreviewModel> CreateResponseUsingEstimateId(GetQuotePreviewDetails.Request request)
        {
            string _appConfigServiceURL = _appSettings.GetSetting("App.Configuration.Url");

            if (request.ConfigurationType == null)
                request.ConfigurationType = "Deal";
            else if(request.ConfigurationType.ToLower()=="deal")
                request.ConfigurationType = "Deal";
            else if (request.ConfigurationType.ToLower() == "estimate")
                request.ConfigurationType = "Estimate";

            try
            {

                var url = _appConfigServiceURL.AppendPathSegment(request.Id)
                     .SetQueryParams(new
                     {
                         Details = request.Details,
                         vendor = request.Vendor,
                         type = request.ConfigurationType
                     });

                var configurationFindResponse = await _middleTierHttpClient
                        .GetAsync<FindResponse<IEnumerable<DetailedDto>>>(url);

                var quotePreview = _mapper.Map<QuotePreview>(configurationFindResponse?.Data?.FirstOrDefault());
                if (quotePreview == null)
                {
                    QuotePreviewModel result = new QuotePreviewModel
                    {
                        QuoteDetails = new QuotePreview()
                    };
                    return result;
                }

                MapEndUserAndResellerForQuotePreview(configurationFindResponse, quotePreview);
                quotePreview.Items = await _helperService.PopulateLinesFor(quotePreview.Items, configurationFindResponse?.Data?.FirstOrDefault()?.Vendor.Name, string.Empty);

                var customerBuyMethod = _helperService.GetCustomerAccountDetails().Result.BuyMethod;
                quotePreview.CustomerBuyMethod = customerBuyMethod;
                quotePreview.BuyMethod = customerBuyMethod.Equals("TD") ? "sap46" : "tdavnet67";
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

        private bool MapEndUserAndResellerForQuotePreview(FindResponse<IEnumerable<DetailedDto>> configurationFindResponse, QuotePreview quotePreview)
        {
            if (configurationFindResponse?.Data?.FirstOrDefault()?.EndUser != null)
            {
                var objEndUser = configurationFindResponse.Data?.FirstOrDefault().EndUser;
                Address endUser = new()
                {
                    Line1 = objEndUser?.Address.Address1,
                    Line2 = objEndUser?.Address.Address2,
                    Line3 = objEndUser?.Address.Address3,
                    City = objEndUser?.Address.City,
                    State = objEndUser?.Address.State,
                    Country = objEndUser?.Address.Country,
                    PostalCode = objEndUser?.Address.PostalCode,
                    Email = objEndUser?.Contact?.EmailAddress,
                    Name = objEndUser?.Contact?.FirstName + " " + objEndUser?.Contact?.LastName,
                    CompanyName = objEndUser?.Name,
                };
                quotePreview.EndUser = new List<Address> { endUser };
            }
            Address reseller = new Address();
            if (configurationFindResponse?.Data?.FirstOrDefault().Reseller?.Address?.Address1 != null)
            {
                var objReseller = configurationFindResponse.Data?.FirstOrDefault().Reseller;
                reseller = new()
                {
                    Line1 = objReseller?.Address?.Address1,
                    Line2 = objReseller?.Address?.Address2,
                    Line3 = objReseller?.Address?.Address3,
                    City = objReseller?.Address?.City,
                    State = objReseller?.Address?.State,
                    Country = objReseller?.Address?.Country,
                    PostalCode = objReseller?.Address?.PostalCode,
                    Email = objReseller?.ContactModel?.EmailAddress,
                    Id = objReseller?.Id,
                    CompanyName = objReseller?.Name,
                    Name = objReseller?.ContactModel?.FirstName + " " + objReseller?.ContactModel?.LastName,
                };
            }
            else
            {
                var address = GetAddress("CUS", false).Result;
                if (address != null && address.Any())
                {
                    var addresses = address.ToList();
                    reseller = new()
                    {
                        Line1 = addresses.First().addresses.First().AddressLine1,
                        Line2 = addresses.First().addresses.First().AddressLine2,
                        Line3 = addresses.First().addresses.First().AddressLine3,
                        City = addresses.First().addresses.First().City,
                        State = addresses.First().addresses.First().State,
                        Country = addresses.First().addresses.First().Country,
                        PostalCode = addresses.First().addresses.First().Zip,
                        Email = addresses.First().addresses.First().Email,
                        Id = _uiContext.User?.ActiveCustomer == null ? _uiContext.User?.CustomerList?.First().CustomerNumber : _uiContext.User?.ActiveCustomer?.CustomerNumber,
                        CompanyName = addresses.First().Name,
                    };
                }
            }
            quotePreview.Reseller = new List<Address> { reseller };

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
                    Name = _uiContext.User.ActiveCustomer == null ? _uiContext.User.CustomerList.FirstOrDefault().CustomerName : _uiContext.User.ActiveCustomer.CustomerName,
                    Id = _uiContext.User.ActiveCustomer == null ? _uiContext.User.CustomerList.FirstOrDefault().CustomerNumber : _uiContext.User.ActiveCustomer.CustomerNumber,
                    Contact = contactList
                };
                createModelFrom.EndUser = new EndUserModel
                {
                    Address = createModelFrom.ShipTo.Address,
                    Contact = contactList,
                    Name = _uiContext.User.ActiveCustomer == null ? _uiContext.User.CustomerList.FirstOrDefault().CustomerName : _uiContext.User.ActiveCustomer.CustomerName,
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
            try
            {
                string _appQuoteServiceUrl = _appSettings.GetSetting("App.Quote.Url");
                var createQuoteUrl = _appQuoteServiceUrl + "/CreateAsync";
                _logger.LogInformation("Calling App-Quote to create a quote \r\n" + JsonConvert.SerializeObject(createQuoteFrom, Formatting.Indented));
                var response = await _middleTierHttpClient.PostAsync<CreateModelResponse>(createQuoteUrl, null, createQuoteFrom);
                return response;
            }
            catch (RemoteServerHttpException ex)
            {
                if (ex.Message.Contains("Error"))
                {
                    throw new UIServiceException(_helperService.RenderErrorMessage(ex, "quote"), 11000);
                }
                else
                {
                    _logger.LogError(ex, "Exception at : " + nameof(Commerce));
                    throw new UIServiceException(ex.Message, (int)UIServiceExceptionCode.GenericBadRequestError);
                }

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        private async Task<IEnumerable<AccountAddressDetails>> GetAddress(string criteria, bool ignoreSalesOrganization)
        {
            var customerId = _uiContext.User?.Customers?.FirstOrDefault();
            string _customerServiceURL = _appSettings.GetSetting("App.Customer.Url");
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
