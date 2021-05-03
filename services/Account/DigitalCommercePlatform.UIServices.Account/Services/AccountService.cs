using DigitalCommercePlatform.UIServices.Account.Actions.ActionItemsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.ConfigurationsSummary;
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
using DigitalFoundation.Common.Settings;
using Flurl;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RenewalsService;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIServices.Account.Actions.ShipToAddress;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Extensions;

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


        public AccountService(IMiddleTierHttpClient middleTierHttpClient, IOptions<AppSettings> options, 
            ILogger<AccountService> logger, IRenewalsService renewalsService, IUIContext uiContext)
        {
            _uiContext = uiContext;
            _middleTierHttpClient = middleTierHttpClient;
            _logger = logger;
            _configurationsServiceUrl = options?.Value.GetSetting("App.Quote.Url");
            _dealsServiceUrl = options?.Value.GetSetting("App.Order.Url");
            _quoteServiceURL = options?.Value.GetSetting("App.Quote.Url");
            _cartServiceURL = options?.Value.GetSetting("App.Cart.Url");
            _renewalsService = renewalsService ?? throw new ArgumentNullException(nameof(renewalsService));
            _customerServiceURL= options?.Value.GetSetting("App.Customer.Url");
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
                OldConfigurations = 25
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
            try
            {
                var response = await _middleTierHttpClient.GetAsync<List<SavedCartDetailsModel>>(savedCartURL);
                return response;
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, $"Exception at getting {nameof(GetSavedCartListAsync)}: {nameof(AccountService)}");
                return null;
            }
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

        public async Task<ActiveOpenQuotesModel> GetTopQuotesAsync(GetTopQuotes.Request request)
        {
            //Returning dummy data for now as App-Service is not yet ready 
            var url = _quoteServiceURL
                    .AppendPathSegment("find")  //Change the actuall method when the App-Service is ready 
                    .SetQueryParams(new
                    {

                    });

            //using var getQuoteRequestMessage = new HttpRequestMessage(HttpMethod.Get, url);

            //var apiQuoteSummaryClient = _clientFactory.CreateClient("apiServiceClient");

            //var response = await apiProductSummaryClient.SendAsync(getQuoteRequestMessage).ConfigureAwait(false);
            //response.EnsureSuccessStatusCode();

            //var getQuoteResponse = await response.Content.ReadAsAsync<IEnumerable<OpenResellerItems>>().ConfigureAwait(false);
            // return getQuoteResponse;

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

            var response = new ActiveOpenQuotesModel
            {
                Items = openItems
            };
            return await Task.FromResult(response);
        }
        public async Task<MyQuotes> MyQuotesSummaryAsync(MyQuoteDashboard.Request request)
        {
            var MyQuotes = new MyQuotes();
            {
                var randomNumber = GetRandomNumber(100, 600);
                MyQuotes.QuoteToOrder = "5:2";
                MyQuotes.Open = GetRandomNumber(10, 60);
                MyQuotes.Converted = string.Format("{0:N2}", (randomNumber / 100)) + " %";
                MyQuotes.ActiveQuoteValue = (randomNumber * 350);
                MyQuotes.CurrencyCode = "USD";
                MyQuotes.CurrencySymbol = "$";
                MyQuotes.FormattedAmount = string.Format("{0:N2}", MyQuotes.ActiveQuoteValue);
            }
            return await Task.FromResult(MyQuotes);
        }

        public async Task<List<string>> GetRenewalsExpirationDatesAsync(string customerNumber,string salesOrganization, int numberOfDaysToSubtract)
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
            var totalAmount = GetRandomNumber(500, 700);
            var processedAmount = GetRandomNumber(100, 500);
            var percentage = (totalAmount - processedAmount) * 10 / 100;
            var formatedTotalAmount = string.Format(totalAmount % 1 == 0 ? "{0:N2}" : "{0:N2}", totalAmount);
            var formatedProcessced = string.Format(processedAmount % 1 == 0 ? "{0:N2}" : "{0:N2}", processedAmount);
            var myOrders = new MyOrdersDashboard
            {
                CurrencyCode = "USD",
                CurrencySymbol = "$",
                IsMonthly = request.IsMonthly,
                ProcessedOrderPercentage = percentage.ToString(),
                ProcessedOrdersAmount = processedAmount,
                TotalOrderAmount = totalAmount,
                TotalFormattedAmount = formatedTotalAmount,
                ProcessedFormattedAmount = formatedProcessced,
            };
            return await Task.FromResult(myOrders);
        }

        public async Task<IEnumerable<AddressDetails>> GetShipToAdress(GetShipToAddress.Request request)
        {
            var customerId = _uiContext.User.Customers.FirstOrDefault();
            var customerURL = _customerServiceURL.BuildQuery("Id=" + customerId);
            try
            {
                var response = await _middleTierHttpClient.GetAsync<IEnumerable<AddressDetails>>(customerURL);
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Exception at getting {nameof(GetSavedCartListAsync)}: {nameof(AccountService)}");
                return null;
            }
        }
    }
}
