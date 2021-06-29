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
using DigitalCommercePlatform.UIServices.Account.Actions.TopQuotes;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalCommercePlatform.UIServices.Account.Models.Carts;
using DigitalCommercePlatform.UIServices.Account.Models.Configurations;
using DigitalCommercePlatform.UIServices.Account.Models.Deals;
using DigitalCommercePlatform.UIServices.Account.Models.Orders;
using DigitalCommercePlatform.UIServices.Account.Models.Quotes;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using Flurl;
using Microsoft.Extensions.Logging;
using RenewalsService;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Services
{
    [ExcludeFromCodeCoverage]
    public class AccountService : IAccountService
    {
        private readonly string _configurationsServiceUrl;
        private readonly string _dealsServiceUrl;
        private readonly string _quoteServiceURL;
        private readonly string _cartServiceURL;
        private readonly string _customerServiceURL;
        private readonly IUIContext _uiContext;
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly ILogger<AccountService> _logger;
        private static readonly Random getrandom = new Random();
        private readonly IRenewalsService _renewalsService;
        private readonly IMapper _mapper;


        public AccountService(IMiddleTierHttpClient middleTierHttpClient, IAppSettings appSettings,
            ILogger<AccountService> logger, IMapper mapper, IRenewalsService renewalsService, IUIContext uiContext)
        {
            _uiContext = uiContext;
            _middleTierHttpClient = middleTierHttpClient;
            _logger = logger;
            _mapper = mapper;
            _configurationsServiceUrl = appSettings.GetSetting("App.Quote.Url");
            _dealsServiceUrl = appSettings.GetSetting("App.Order.Url");
            _quoteServiceURL = appSettings.GetSetting("App.Quote.Url");
            _cartServiceURL = appSettings.GetSetting("App.Cart.Url");
            _renewalsService = renewalsService ?? throw new ArgumentNullException(nameof(renewalsService));
            _customerServiceURL = appSettings.GetSetting("App.Customer.Url");
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
            var response = new ConfigurationsSummaryModel
            {
                Quoted = 14,
                UnQuoted = 30,
                OldConfigurations = 25,
                CurrencyCode = "USD"
            };
            return await Task.FromResult(response);
        }

        public async Task<List<DealsSummaryModel>> GetDealsSummaryAsync(GetDealsSummary.Request request)
        {
            var response = new List<DealsSummaryModel>();
            var objDeal = new DealsSummaryModel();

            for (int i = 1; i < 4; i++)
            {
                objDeal = new DealsSummaryModel
                {
                    Value = i * GetRandomNumber(1, 3)
                };
                response.Add(objDeal);
            }
            return await Task.FromResult(response);
        }

        public async Task<DealModel> GetTopDealsAsync(GetTopDeals.Request request)
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
                deal.FormattedAmount = string.Format(deal.Amount % 1 == 0 ? "{0:N2}" : "{0:N2}", deal.Amount);
                deals.Add(deal);
            }

            deals = AddSequenceNumber(deals);
            var response = new DealModel
            {
                Items = deals
            };
            return await Task.FromResult(response);
        }

        public async Task<List<SavedCartDetailsModel>> GetSavedCartListAsync(GetCartsList.Request request)
        {
            var savedCartURL = _cartServiceURL.AppendPathSegment("listsavedcarts");
            var response = await _middleTierHttpClient.GetAsync<List<SavedCartDetailsModel>>(savedCartURL);
            return response;
        }

        public async Task<GetConfigurationsForModel> GetConfigurationsForAsync(GetConfigurationsFor.Request request)
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

            return await Task.FromResult(result);
        }

        public static int GetRandomNumber(int min, int max)
        {
            return getrandom.Next(min, max);
        }

        public async Task<ActionItemsModel> GetActionItemsSummaryAsync(GetActionItems.Request request)
        {
            var actionItems = new ActionItemsModel
            {
                ExpiringDeals = GetRandomNumber(0, 4),
                NewOpportunities = GetRandomNumber(1, 8),
                OrdersBlocked = GetRandomNumber(10, 20)
            };
            return await Task.FromResult(actionItems);
        }

        public async Task<ActiveOpenConfigurationsModel> GetTopConfigurationsAsync(GetTopConfigurations.Request request)
        {
            var openItems = new List<OpenResellerItems>();
            for (int i = 0; i < 5; i++)
            {
                OpenResellerItems openItem = new OpenResellerItems();
                var randomNumber = GetRandomNumber(100, 600);
                openItem.EndUserName = "End User " + randomNumber.ToString();
                openItem.Amount = (randomNumber * 100);
                openItem.CurrencyCode = "USD";
                openItem.CurrencySymbol = "$";
                openItem.FormattedAmount = string.Format(openItem.Amount % 1 == 0 ? "{0:N2}" : "{0:N2}", openItem.Amount);
                openItems.Add(openItem);
            }

            openItems = AddSequenceNumber(openItems);

            var response = new ActiveOpenConfigurationsModel
            {
                Items = openItems
            };
            return await Task.FromResult(response);
        }

        public async Task<FindResponse<IEnumerable<QuoteModel>>> GetTopQuotesAsync(GetTopQuotes.Request request)
        {
            var customerId = _uiContext.User?.ActiveCustomer.CustomerNumber;
            TextInfo setTextCase = CultureInfo.CurrentCulture.TextInfo;

            request.Sortby = string.IsNullOrWhiteSpace(request.Sortby) ? "Price" : request.Sortby;
            request.SortDirection = string.IsNullOrWhiteSpace(request.SortDirection) ? "desc" : request.SortDirection;
            bool sortDirection = request.SortDirection.ToLower() == "asc" ? true : false;

            var quoteURL = _quoteServiceURL.AppendPathSegment("find").SetQueryParams("CustomerNumber=" + customerId+ "&SortBy="+ setTextCase.ToTitleCase(request.Sortby)+ "&SortAscending=" + sortDirection+ "&pageSize=" +request.Top);
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

        public async Task<MyOrdersDashboard> GetMyOrdersSummaryAsync(GetMyOrders.Request request)
        {
            int maxForTotalOrders = 43_000;
            var randomGenerator = new Random();

            var totalAmount = randomGenerator.Next(maxForTotalOrders);
            var processedAmount = randomGenerator.Next(totalAmount);
            var shippedAmount = randomGenerator.Next(processedAmount);

            var processedPercentage = ((processedAmount / (float)totalAmount) * 100).ToString("F") + "%";
            var shippedPercentage = ((shippedAmount / (float)totalAmount) * 100).ToString("F") + "%";

            var myOrders = new MyOrdersDashboard
            {
                CurrencyCode = "USD",
                CurrencySymbol = "$",
                IsMonthly = request.IsMonthly,
                Total = new OrderData { Amount = totalAmount, FormattedAmount = string.Format("{0:N2}", totalAmount), Percentage = "100%" },
                Processed = new OrderData { Amount = processedAmount, FormattedAmount = string.Format("{0:N2}", processedAmount), Percentage = processedPercentage },
                Shipped = new OrderData { Amount = shippedAmount, FormattedAmount = string.Format("{0:N2}", shippedAmount), Percentage = shippedPercentage }
            };
            return await Task.FromResult(myOrders);
        }

        public async Task<IEnumerable<AddressDetails>> GetAddress(GetAddress.Request request)
        {
            var customerId = _uiContext.User.ActiveCustomer?.CustomerNumber;
            var customerURL = _customerServiceURL.BuildQuery("Id=" + customerId);
            var response = await _middleTierHttpClient.GetAsync<IEnumerable<AddressDetails>>(customerURL);
            if (response.Any())
            {
                // Current requirement is if system is 2 to take the 0100 as sales org
                var salesOrg = _uiContext.User.ActiveCustomer?.System == "2" ? "0100" : string.Empty;

                if (response.FirstOrDefault().addresses.Any() && request.Criteria != "ALL" && request.IgnoreSalesOrganization == false)
                    response.FirstOrDefault().addresses = response.FirstOrDefault().addresses.Where(t => t.AddressType.ToUpper() == request.Criteria & t.SalesOrganization == salesOrg).ToList(); 
                else if (response.FirstOrDefault().addresses.Any() && request.Criteria != "ALL" && request.IgnoreSalesOrganization == true)
                    response.FirstOrDefault().addresses = response.FirstOrDefault().addresses.Where(t => t.AddressType.ToUpper() == request.Criteria).ToList(); 
                else if (response.FirstOrDefault().addresses.Any() && request.IgnoreSalesOrganization == false)
                    response.FirstOrDefault().addresses = response.FirstOrDefault().addresses.Where(t => t.SalesOrganization == salesOrg).ToList(); 
                else
                    return response;
            }
            return response;
        }




    }
}