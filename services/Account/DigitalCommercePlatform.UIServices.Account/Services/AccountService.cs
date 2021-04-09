using DigitalCommercePlatform.UIServices.Account.Actions.ActionItemsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.ConfigurationsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.DealsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.DetailsOfSavedCart;
using DigitalCommercePlatform.UIServices.Account.Actions.RenewalsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.TopConfigurations;
using DigitalCommercePlatform.UIServices.Account.Actions.TopQuotes;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalCommercePlatform.UIServices.Account.Models.Carts;
using DigitalCommercePlatform.UIServices.Account.Models.Configurations;
using DigitalCommercePlatform.UIServices.Account.Models.Deals;
using DigitalCommercePlatform.UIServices.Account.Models.Quotes;
using DigitalCommercePlatform.UIServices.Account.Models.Renewals;
using DigitalFoundation.Common.Settings;
using Flurl;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
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
        public async Task<DealsSummaryModel> GetDealsSummaryAsync(GetDealsSummary.Request request)
        {
            var response = new DealsSummaryModel
            {
                TwoDays = 5,
                SevenDays = 10,
                FourteenDays = 25
            };
            return await Task.FromResult(response);
        }

        public async Task<CartModel> GetCartDetailsAsync(GetCartDetails.GetCartRequest request)
        {
            var SaveCartDetails = new List<SavedCartLine>();
            for (int i = 0; i < 30; i++)
            {
                SavedCartLine newSavedCart = new SavedCartLine();
                var randomNumber = GetRandomNumber(10, 60);
                var quantity = GetRandomNumber(1, 10);
                newSavedCart.Id = 531517;
                newSavedCart.LineNumber = randomNumber;
                newSavedCart.MaterialId = "Deatils of Material ID";
                newSavedCart.ParentLineNumber = randomNumber;
                newSavedCart.Quantity = quantity;
                newSavedCart.BestPrice = "Best price in quantity";
                newSavedCart.MSRP = "MSRP";
                newSavedCart.MaterialNumber = randomNumber.ToString();
                SaveCartDetails.Add(newSavedCart);
            }

            var savedCartResponse = new CartModel
            {

                SavedCarts = new Models.Carts.SavedCarts
                {
                    Id = 531517,
                    Name = "RODNEY",
                    LineCount = 2,
                    details = SaveCartDetails
                }
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
                openItem.Sequence = i + 1;
                openItem.EndUserName = "End User " + randomNumber.ToString();
                openItem.Amount = "$" + randomNumber * 100;
                openItems.Add(openItem);
            }

            var response = new ActiveOpenConfigurationsModel
            {
                TopOpenQuotes = openItems

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
                openItem.Sequence = i + 1;
                openItem.EndUserName = "End User " + randomNumber.ToString();
                openItem.Amount = "$" + randomNumber * 100;
                openItems.Add(openItem);
            }

            var response = new ActiveOpenQuotesModel
            {
                TopOpenQuotes = openItems

            };
            return await Task.FromResult(response);
        }

        public async Task<RenewalsSummaryModel> GetRenewalsSummaryAsync(GetRenewalsSummary.Request criteria)
        {
            var renewals = new RenewalsSummaryModel
            {
                NinetyDays = GetRandomNumber(0, 4),
                SixtyDays = GetRandomNumber(1, 8),
                ThirtyDays = GetRandomNumber(10, 20),
                Today = GetRandomNumber(0, 15),
            };
            return await Task.FromResult(renewals);
        }
    }
}
