using DigitalCommercePlatform.UIServices.Account.Actions.ActionItemsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.ConfigurationsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.DealsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.GetMyQuotes;
using DigitalCommercePlatform.UIServices.Account.Actions.MyOrders;
using DigitalCommercePlatform.UIServices.Account.Actions.RenewalsSummary;
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
using DigitalCommercePlatform.UIServices.Account.Models.Renewals;
using DigitalFoundation.Common.Settings;
using Flurl;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
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
        private readonly ILogger<AccountService> _logger;
        private static readonly Random getrandom = new Random();

        public AccountService(IOptions<AppSettings> options, ILogger<AccountService> logger)
        {
            _logger = logger;
            _configurationsServiceUrl = options?.Value.GetSetting("App.Quote.Url");
            _dealsServiceUrl = options?.Value.GetSetting("App.Order.Url");
            _quoteServiceURL = options?.Value.GetSetting("App.Quote.Url");
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
                    CurrencyCode = a.CurrencyCode
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

        public async Task<List<DealModel>> GetTopDealsAsync(GetTopDeals.Request request)
        {
            var deals = new List<DealModel>();
            var top = (int)request.Top;

            for (int i = top; i >= 0; i--)
            {
                var dealValue = i + 1 * 100001.89m;
                var deal = new DealModel
                {
                    Sequence = 5 - i,
                    UserName = "End User " + i,
                    DealValue = dealValue,
                    CurrencyCode = "USD",
                    FormattedAmount = string.Format("{0:N2}", dealValue)
                };

                deals.Add(deal);
            }

            return await Task.FromResult(deals);
        }

        public async Task<CartModel> GetSavedCartListAsync(GetCartsList.Request request)
        {
            var carts = new List<SavedCart>();
            for (int i = 0; i < 20; i++)
            {
                SavedCart cart = new SavedCart();
                var randomNumber = GetRandomNumber(1000, 6000);
                cart.Id = randomNumber;
                cart.Name = "CartId : " + randomNumber.ToString();                    
                carts.Add(cart);
            }
            UserSavedCartsModel savedCarts = new UserSavedCartsModel
            {
                Items = carts,
                TotalNumberOfSavedCarts = carts.Count 
            };
            var savedCartResponse = new CartModel
            {
                UserSavedCarts = savedCarts                
            };
            return await Task.FromResult(savedCartResponse);
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
            for (int i = 0; i < 4; i++)
            {
                OpenResellerItems openItem = new OpenResellerItems();
                var randomNumber = GetRandomNumber(100, 600);
                openItem.EndUserName = "End User " + randomNumber.ToString();
                openItem.Amount = (randomNumber * 100);
                openItem.CurrencyCode = "USD";
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
            try
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


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Exception at getting {nameof(GetTopQuotesAsync)}: {nameof(AccountService)}");
                throw ex;
            }

            
            var openItems = new List<OpenResellerItems>();
            for (int i = 0; i < 4; i++)
            {
                OpenResellerItems openItem = new OpenResellerItems();
                var randomNumber = GetRandomNumber(100, 600);
                openItem.EndUserName = "End User " + randomNumber.ToString();
                openItem.Amount = (randomNumber * 100);
                openItem.CurrencyCode = "USD";
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
            try
            {
                var MyQuotes = new MyQuotes();
                {
                    var randomNumber = GetRandomNumber(100, 600);
                    MyQuotes.QuoteToOrder = "5:2";
                    MyQuotes.Open = GetRandomNumber(10, 60);
                    MyQuotes.Converted = string.Format("{0:N2}", (randomNumber/100))+" %";
                    MyQuotes.ActiveQuoteValue = (randomNumber * 350);
                    MyQuotes.CurrencyCode = "USD";
                    MyQuotes.FormattedAmount = string.Format("{0:N2}", MyQuotes.ActiveQuoteValue);
                }
                return await Task.FromResult(MyQuotes);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, $"Exception at getting {nameof(GetTopQuotesAsync)}: {nameof(AccountService)}");
                throw ex;
            }
            
        }
        public async Task<List<RenewalsSummaryModel>> GetRenewalsSummaryAsync(GetRenewalsSummary.Request criteria)
        {
            var renewals = new List<RenewalsSummaryModel>();
            var objDeal = new RenewalsSummaryModel();

            for (int i = 1; i < 5; i++)
            {
                objDeal = new RenewalsSummaryModel
                {
                    Value = i * GetRandomNumber(1, 3)
                };
                renewals.Add(objDeal);
            }
            return await Task.FromResult(renewals);
        }

        public async Task<MyOrdersDashboard> GetMyOrdersSummaryAsync(GetMyOrders.Request request)
        {
            var totalAmount = GetRandomNumber(500, 700);
            var processedAmount = GetRandomNumber(100, 500);
            var percentage = (totalAmount - processedAmount) *10/100;
            var formatedTotalAmount = string.Format(totalAmount % 1 == 0 ? "{0:N2}" : "{0:N2}", totalAmount);
            var formatedProcessced = string.Format(processedAmount % 1 == 0 ? "{0:N2}" : "{0:N2}", processedAmount);
            var myOrders = new MyOrdersDashboard
            {
               CurrencyCode="USD",
               IsMonthly=request.IsMonthly,
               ProcessedOrderPercentage= percentage.ToString(),
               ProcessedOrdersAmount= processedAmount,
               TotalOrderAmount = totalAmount,
               TotalFormattedAmount = formatedTotalAmount,
               ProcessedFormattedAmount = formatedProcessced,
            };
            return await Task.FromResult(myOrders);
        }
    }
}
