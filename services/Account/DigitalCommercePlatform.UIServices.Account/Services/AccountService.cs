//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.ActionItemsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.ConfigurationsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.CustomerAddress;
using DigitalCommercePlatform.UIServices.Account.Actions.DealsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.GetConfigurationsFor;
using DigitalCommercePlatform.UIServices.Account.Actions.GetMyQuotes;
using DigitalCommercePlatform.UIServices.Account.Actions.MyOrders;
using DigitalCommercePlatform.UIServices.Account.Actions.SavedCartsList;
using DigitalCommercePlatform.UIServices.Account.Actions.TopConfigurations;
using DigitalCommercePlatform.UIServices.Account.Actions.TopDeals;
using DigitalCommercePlatform.UIServices.Account.Actions.TopOrders;
using DigitalCommercePlatform.UIServices.Account.Actions.TopQuotes;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalCommercePlatform.UIServices.Account.Models.Carts;
using DigitalCommercePlatform.UIServices.Account.Models.Configurations;
using DigitalCommercePlatform.UIServices.Account.Models.Deals;
using DigitalCommercePlatform.UIServices.Account.Models.Orders;
using DigitalCommercePlatform.UIServices.Account.Models.Quotes;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Client.Exceptions;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI.ExceptionHandling;
using Flurl;
using Microsoft.Extensions.Logging;
using RenewalsService;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Services
{
    public class AccountService : IAccountService
    {
        private readonly string _configurationsServiceUrl;
        private readonly string _ordersServiceUrl;
        private readonly string _quoteServiceURL;
        private readonly string _cartServiceURL;
        private readonly string _customerServiceURL;
        private readonly string _spaServiceURL;
        private readonly IUIContext _uiContext;
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly ILogger<AccountService> _logger;
        private static readonly Random getrandom = new Random();
        private readonly IRenewalsService _renewalsService;
        private readonly IMapper _mapper;

        public record AccountServiceArgs(
            IMiddleTierHttpClient middleTierHttpClient,
            IAppSettings appSettings,
            ILogger<AccountService> logger,
            IMapper mapper,
            IRenewalsService renewalsService,
            IUIContext uiContext
            );

        public AccountService(AccountServiceArgs args)
        {
            _uiContext = args.uiContext;
            _middleTierHttpClient = args.middleTierHttpClient;
            _logger = args.logger;
            _mapper = args.mapper;
            _configurationsServiceUrl = args.appSettings.GetSetting("App.Configuration.Url");
            _ordersServiceUrl = args.appSettings.GetSetting("App.Order.Url");
            _quoteServiceURL = args.appSettings.GetSetting("App.Quote.Url");
            _cartServiceURL = args.appSettings.GetSetting("App.Cart.Url");
            _spaServiceURL = args.appSettings.GetSetting("App.Spa.Url");
            _renewalsService = args.renewalsService ?? throw new ArgumentNullException(nameof(args.renewalsService));
            _customerServiceURL = args.appSettings.GetSetting("App.Customer.Url");
        }

        private static List<OpenResellerItems> AddSequenceNumber(List<OpenResellerItems> openItems)
        {
            openItems = openItems.OrderByDescending(a => a.Amount)
                .Select((a, index) => new OpenResellerItems
                {
                    Sequence = index + 1,
                    EndUserName = a.EndUserName,
                    Amount = a?.Amount,
                    FormattedAmount = a.FormattedAmount,
                    CurrencyCode = a.CurrencyCode,
                    CurrencySymbol = a.CurrencySymbol
                }).ToList();
            return openItems;
        }

        public async Task<ConfigurationsSummaryModel> GetConfigurationsSummaryAsync(GetConfigurationsSummary.Request request)
        {
            ConfigurationsSummaryModel response = new();
            try
            {
                var url = _configurationsServiceUrl.AppendPathSegment("GetConfigurationQuotes");

                var quotesSummary = await _middleTierHttpClient.GetAsync<Response>(url);

                response = new ConfigurationsSummaryModel
                {
                    Quoted = quotesSummary.Quoted,
                    UnQuoted = quotesSummary.Unquoted,
                    OldConfigurations = quotesSummary.Inactive,
                    CurrencyCode = "USD"
                };
                return response;
            }
            catch (RemoteServerHttpException ex)
            {
                if (ex.Code == HttpStatusCode.BadRequest && ex.InnerException is RemoteServerHttpException innerException)
                {
                    object exceptionDetails = innerException?.Details;
                    object body = exceptionDetails?.GetType().GetProperty("Body")?.GetValue(exceptionDetails, null);
                    throw new UIServiceException("Bad Request GetConfigurationsSummary for user id : " + _uiContext.User.ID, (int)UIServiceExceptionCode.GenericBadRequestError);
                }
                else if (ex.Code == HttpStatusCode.NotFound)
                {
                    _logger.LogError(ex, "No records Found GetConfigurationsSummaryAsync : " + nameof(AccountService));
                    return new ConfigurationsSummaryModel
                    {
                        Quoted = 0,
                        UnQuoted = 0,
                        OldConfigurations = 0,
                        CurrencyCode = "USD"
                    };
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, "error while calling GetConfigurationsSummaryAsync : " + nameof(AccountService));
                throw new UIServiceException("error while calling GetConfigurationsSummaryAsync for user id : " + _uiContext.User.ID, (int)UIServiceExceptionCode.GenericBadRequestError);
            }
            return response;
        }

        public async Task<List<DealsSummaryModel>> GetDealsSummaryAsync(GetDealsSummary.Request request)
        {
            var url = _spaServiceURL.AppendPathSegments("Find")
                         .SetQueryParams(new
                         {
                             ValidTo = DateTime.Now.AddYears(1).ToString("yyyy-MM-dd"),
                             TotalCount = false,
                             Details = false,
                             WithPaginationInfo = false,
                             SortBy = "expirationDate"
                         });

            var dealsSummary = await _middleTierHttpClient.GetAsync<DigitalFoundation.Common.Features.Contexts.Models.FindResponse<DealsBase>>(url);

            var response = new List<DealsSummaryModel>();

            for (int i = 1; i < 4; i++)
            {
                DealsSummaryModel objDeal = new DealsSummaryModel
                {
                    Value = i == 1 ? dealsSummary?.Data?.Where(t => t.ExpirationDate <= DateTime.Now.AddDays(2)).Count() :
                            i == 2 ? dealsSummary?.Data?.Where(t => t.ExpirationDate <= DateTime.Now.AddDays(7)).Count() :
                            dealsSummary?.Data?.Where(t => t.ExpirationDate > DateTime.Now.AddDays(7)).Count()
                };
                response.Add(objDeal);
            }
            return response;
        }

        public DealModel GetTopDeals(GetTopDeals.Request request)
        {
            var deals = new List<OpenResellerItems>();
            for (int i = 0; i < 5; i++)
            {
                OpenResellerItems deal = new OpenResellerItems();
                var randomNumber = GetRandomNumber(100, 600);
                deal.EndUserName = "End User " + randomNumber.ToString();
                deal.Amount = (randomNumber * 100);
                deal.CurrencyCode = "USD";
                deal.CurrencySymbol = "$";
                deal.FormattedAmount = String.Format(deal.Amount % 1 == 0 ? "{0:0}" : "{0:0.00}", deal.Amount);
                deals.Add(deal);
            }

            deals = AddSequenceNumber(deals);
            var response = new DealModel
            {
                Items = deals
            };
            return response;
        }

        public async Task<List<SavedCartDetailsModel>> GetSavedCartListAsync(GetCartsList.Request request)
        {
            var savedCartURL = _cartServiceURL.AppendPathSegment("listsavedcarts");
            var response = await _middleTierHttpClient.GetAsync<List<SavedCartDetailsModel>>(savedCartURL);
            return response;
        }

        public GetConfigurationsForModel GetConfigurationsFor(GetConfigurationsFor.Request request)
        {
            var items = new List<GetConfigurationsForItem>();
            var randomNumber = GetRandomNumber(100, 600);
            for (int i = 0; i < 20; i++)
            {
                var item = new GetConfigurationsForItem
                {
                    Id = randomNumber + i
                };
                item.Name = $"{request.RequestType} : {item.Id}";
                items.Add(item);
            }

            var result = new GetConfigurationsForModel
            {
                Items = items,
                TotalNumberOfConfigurationsItems = items.Count
            };

            return result;
        }

        public static int GetRandomNumber(int min, int max)
        {
            return getrandom.Next(min, max);
        }

        public async Task<ActionItemsModel> GetActionItemsSummaryAsync(GetActionItems.Request request)
        {
            var numberOfExpiringDeals = await GetExpiringDeals();
            var numberOfBlockedOrders = await GetBlockedOrders();

            var actionItems = new ActionItemsModel
            {
                ExpiringDeals = numberOfExpiringDeals,
                NewOpportunities = GetRandomNumber(0, 4),
                OrdersBlocked = numberOfBlockedOrders
            };

            return actionItems;
        }

        private async Task<int> GetBlockedOrders()
        {
            var url = _ordersServiceUrl.AppendPathSegment("Find")
                        .SetQueryParams(new
                        {
                            Status = "ON_HOLD",
                            WithPaginationInfo = true,
                        });

            try
            {
                var orderNumberDto = await _middleTierHttpClient.GetAsync<OrderNumberDto>(url);
                return orderNumberDto.Count;
            }
            catch (RemoteServerHttpException ex) when (ex.Code == HttpStatusCode.NotFound)
            {
                return 0;
            }
        }

        private async Task<int> GetExpiringDeals()
        {
            var url = _spaServiceURL.AppendPathSegments("Find")
                        .SetQueryParams(new
                        {
                            ValidTo = DateTime.Now.AddDays(1).ToString("yyyy-MM-dd"),
                            TotalCount = true,
                            Details = false,
                        });

            var dealsExpiringDto = await _middleTierHttpClient.GetAsync<DealsExpiringDto>(url);
            return dealsExpiringDto.Count;
        }

        public async Task<TopConfigurationDto> GetTopConfigurationsAsync(GetTopConfigurations.Request request)
        {
            var url = _configurationsServiceUrl.AppendPathSegment("find")
                        .SetQueryParams(new
                        {
                            Details = false,
                            SortBy = string.IsNullOrWhiteSpace(request.SortBy) ? "TotalListPrice" : request.SortBy,
                            SortByAscending = request.SortDirection?.ToLower() == "asc",
                            Page = 1,
                            PageSize = request.Top
                        });

            var topConfigurationDto = await _middleTierHttpClient.GetAsync<TopConfigurationDto>(url);
            return topConfigurationDto;
        }

        public async Task<FindResponse<IEnumerable<QuoteModel>>> GetTopQuotesAsync(GetTopQuotes.Request request)
        {
            TextInfo setTextCase = CultureInfo.CurrentCulture.TextInfo;

            request.Sortby = string.IsNullOrWhiteSpace(request.Sortby) ? "Price" : request.Sortby;
            request.SortDirection = string.IsNullOrWhiteSpace(request.SortDirection) ? "desc" : request.SortDirection;
            bool sortDirection = request.SortDirection.ToLower() == "asc" ? true : false;

            var quoteURL = _quoteServiceURL.AppendPathSegment("find").SetQueryParams("&SortBy=" + setTextCase.ToTitleCase(request.Sortby) + "&SortAscending=" + sortDirection + "&pageSize=" + request.Top);
            var topQuotes = await _middleTierHttpClient.GetAsync<FindResponse<IEnumerable<QuoteModel>>>(quoteURL);
            return topQuotes;
        }

        public async Task<QuoteStatistics> MyQuotesSummaryAsync(MyQuoteDashboard.Request request)
        {
            var quoteURL = _quoteServiceURL.AppendPathSegment("/GetQuoteStatistics");
            var MyQuotes = await _middleTierHttpClient.GetAsync<QuoteStatistics>(quoteURL);
            return MyQuotes;
        }

        public async Task<List<string>> GetRenewalsExpirationDatesAsync(string customerNumber, string salesOrganization, int numberOfDaysToSubtract)
        {
            var renewalSearchDto = new RenewalSearchDto
            {
                CustomerNumber = customerNumber,
                SalesOrganization = salesOrganization,
                ExpirationSearchFrom = DateTime.Today.AddDays(numberOfDaysToSubtract * -1)
            };

            var renewalResponseDto = await _renewalsService.RenewalSearchAsync(renewalSearchDto);

            var renewalSearchResult = renewalResponseDto?.Select(s => s.ExpirationDate.ToShortDateString()).ToList();

            return renewalSearchResult;
        }

        public async Task<MyOrdersStatusDashboard> GetMyOrdersStatusAsync(GetMyOrdersStatus.Request request)
        {
            var url = _ordersServiceUrl.AppendPathSegment("stats")
                        .SetQueryParams(new
                        {
                            key = "status",
                            createdFrom = request.FromDate.Value.ToString("yyyy-MM-dd"),
                            createdTo = request.ToDate.Value.ToString("yyyy-MM-dd")
                        });

            var orderStatsDto = await _middleTierHttpClient.GetAsync<OrderStatsDto>(url);

            if (orderStatsDto?.Data == null)
            {
                return new MyOrdersStatusDashboard();
            }

            var orderStatsUsdOnlyDto = orderStatsDto.Data.Where(i => "USD".Equals(i.Currency, StringComparison.OrdinalIgnoreCase)).ToList();

            if (orderStatsUsdOnlyDto == null || !orderStatsUsdOnlyDto.Any())
            {
                return new MyOrdersStatusDashboard();
            }

            var inProcess = GetCountFor(orderStatsUsdOnlyDto, "IN_PROCESS");
            var onHold = GetCountFor(orderStatsUsdOnlyDto, "ON_HOLD");
            var shipped = GetCountFor(orderStatsUsdOnlyDto, "SHIPPED");

            var myOrders = new MyOrdersStatusDashboard
            {
                InProcess = inProcess.ToString(),
                OnHold = onHold.ToString(),
                Shipped = shipped.ToString()
            };
            return myOrders;
        }

        public async Task<MyOrdersDashboard> GetMyOrdersSummaryAsync(GetMyOrders.Request request)
        {
            var (createdFrom, createdTo) = GetDateRanges(request.IsMonthly);

            var url = _ordersServiceUrl.AppendPathSegment("stats")
                        .SetQueryParams(new
                        {
                            key = "status",
                            createdFrom = createdFrom.ToString("yyyy-MM-dd"),
                            createdTo = createdTo.ToString("yyyy-MM-dd")
                        });

            OrderStatsDto orderStatsDto = new();
            try
            {
                orderStatsDto = await _middleTierHttpClient.GetAsync<OrderStatsDto>(url);
            }
            catch (Exception ex)
            {
                if (((HttpException)ex).Code == HttpStatusCode.NotFound)
                {
                    var myOrderData = new MyOrdersDashboard
                    {
                        CurrencyCode = "USD",
                        CurrencySymbol = "$",
                        IsMonthly = request.IsMonthly,
                        Total = new OrderData { Amount = 0, FormattedAmount = string.Format("{0:N2}", 0), Percentage = "100%" },
                        Processed = new OrderData { Amount = 0, FormattedAmount = string.Format("{0:N2}", 0), Percentage = string.Empty },
                        Shipped = new OrderData { Amount = 0, FormattedAmount = string.Format("{0:N2}", 0), Percentage = string.Empty }
                    };
                    return myOrderData;
                }
            }

            if (orderStatsDto?.Data == null)
            {
                return new MyOrdersDashboard();
            }

            var orderStatsUsdOnlyDto = orderStatsDto.Data.Where(i => "USD".Equals(i.Currency, StringComparison.OrdinalIgnoreCase)).ToList();

            if (orderStatsUsdOnlyDto == null || !orderStatsUsdOnlyDto.Any())
            {
                return new MyOrdersDashboard();
            }

            var inProcess = GetAmmountFor(orderStatsUsdOnlyDto, "IN_PROCESS");
            var onHold = GetAmmountFor(orderStatsUsdOnlyDto, "ON_HOLD");
            var shipped = GetAmmountFor(orderStatsUsdOnlyDto, "SHIPPED");
            var open = GetAmmountFor(orderStatsUsdOnlyDto, "OPEN");

            var total = inProcess + onHold + shipped + open;
            var processed = inProcess + onHold + shipped;

            var processedPercentage = ((processed / total) * 100).ToString("F") + "%";
            var shippedPercentage = ((shipped / total) * 100).ToString("F") + "%";

            var myOrders = new MyOrdersDashboard
            {
                CurrencyCode = "USD",
                CurrencySymbol = "$",
                IsMonthly = request.IsMonthly,
                Total = new OrderData { Amount = total, FormattedAmount = string.Format("{0:N2}", total), Percentage = "100%" },
                Processed = new OrderData { Amount = processed, FormattedAmount = string.Format("{0:N2}", processed), Percentage = processedPercentage },
                Shipped = new OrderData { Amount = shipped, FormattedAmount = string.Format("{0:N2}", shipped), Percentage = shippedPercentage }
            };
            return myOrders;
        }

        private (DateTime createdFrom, DateTime createdTo) GetDateRanges(bool isMonthly)
        {
            var currentDate = DateTime.Now.Date;
            var beginDate = isMonthly ? currentDate.AddDays(-30) : currentDate.AddDays(-90);

            currentDate = currentDate.AddHours(23).AddMinutes(59).AddSeconds(59);
            return (beginDate, currentDate);
        }

        private decimal GetAmmountFor(List<OrderStatsDataDto> orderStatsDataDtos, string orderStatus)
        {
            var ammount = orderStatsDataDtos.Where(i => orderStatus.Equals(i.Value, StringComparison.OrdinalIgnoreCase)).SingleOrDefault()?.TotalValue;
            if (ammount == null)
            {
                return 0;
            }
            return decimal.Parse(ammount);
            // If some of values are null we are returning zero. If IN_PROCESS is null it means zero orders in process
            // SingleOrDefault here is to break execution if more than one item is present - we can't have two  IN_PROCESS elements
        }

        private int GetCountFor(List<OrderStatsDataDto> orderStatsDataDtos, string orderStatus)
        {
            var count = orderStatsDataDtos.Where(i => orderStatus.Equals(i.Value, StringComparison.OrdinalIgnoreCase)).SingleOrDefault()?.Count;
            if (count == null)
            {
                return 0;
            }
            return int.Parse(count);
            // If some of values are null we are returning zero. If IN_PROCESS is null it means zero orders in process
            // SingleOrDefault here is to break execution if more than one item is present - we can't have two  IN_PROCESS elements
        }

        public async Task<IEnumerable<AddressDetails>> GetAddress(GetAddress.Request request)
        {
            var customerId = _uiContext.User.ActiveCustomer?.CustomerNumber;
            var customerURL = _customerServiceURL.BuildQuery("Id=" + customerId);
            var response = await _middleTierHttpClient.GetAsync<IEnumerable<AddressDetails>>(customerURL);

            if (!response.Any())
                return response;

            var addressesDetails = response.First();

            if (!(bool)addressesDetails.addresses.Any())
                return response;

            if (request.IgnoreSalesOrganization == false)
            {
                // Current requirement is if system is 2 to take the 0100 as sales org
                var salesOrg = _uiContext.User.ActiveCustomer?.System == "2" ? "0100" : string.Empty;
                addressesDetails.addresses = addressesDetails.addresses.Where(t => t.SalesOrganization == salesOrg).ToList();
            }

            if (request.Criteria != "ALL")
            {
                addressesDetails.addresses = addressesDetails.addresses
                    .Where(t => t.AddressType.Equals(request.Criteria, StringComparison.InvariantCultureIgnoreCase)).ToList();
            }

            return response;
        }

        public async Task<List<OrderModel>> GetTopOrdersAsync(GetTopOrders.Request request)
        {
            TextInfo setTextCase = CultureInfo.CurrentCulture.TextInfo;

            request.Sortby = string.IsNullOrWhiteSpace(request.Sortby) ? "Price" : request.Sortby;
            request.SortDirection = string.IsNullOrWhiteSpace(request.SortDirection) ? "desc" : request.SortDirection;

            bool sortDirection = request.SortDirection.ToLower() == "asc" ? true : false;

            var url = _quoteServiceURL.AppendPathSegment("Find").SetQueryParams("&SortBy=" + setTextCase.ToTitleCase(request.Sortby) + "&SortAscending=" + sortDirection + "&pageSize=" + request.Top + "&WithPaginationInfo=false");

            var orderNumberDto = await _middleTierHttpClient.GetAsync<OrdersContainer>(url);
            return orderNumberDto.Data.ToList();
        }
    }
}