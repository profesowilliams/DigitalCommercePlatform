using DigitalCommercePlatform.UIServices.Account.Actions.ConfigurationsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.DealsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.DetailsOfSavedCart;
using DigitalCommercePlatform.UIServices.Account.Actions.GetUser;
using DigitalCommercePlatform.UIServices.Account.Actions.ValidateUser;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalCommercePlatform.UIServices.Account.Models.Carts;
using DigitalCommercePlatform.UIServices.Account.Models.Configurations;
using DigitalCommercePlatform.UIServices.Account.Models.Deals;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Net.Http;
using System.Threading.Tasks;


namespace DigitalCommercePlatform.UIServices.Account.Services
{
    [ExcludeFromCodeCoverage]
    public class AccountService : IAccountService
    {
        private readonly IHttpClientFactory _clientFactory;
#pragma warning disable CS0414 // The field is assigned but its value is never used
        private readonly string _coreSecurityServiceUrl;
        private readonly string _configurationsServiceUrl;
        private readonly string _dealsServiceUrl;
        private static readonly Random getrandom = new Random();
#pragma warning restore CS0414
        public AccountService(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
            _coreSecurityServiceUrl = "https://eastus-dit-service.dc.tdebusiness.cloud/core-security/v1/";
            _configurationsServiceUrl = "https://eastus-dit-service.dc.tdebusiness.cloud/app_configurations/v1/";
            _dealsServiceUrl = "https://eastus-dit-service.dc.tdebusiness.cloud/app-order/v1/";
        }

        /// <summary>
        /// Call core service once DF is done
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public async Task<AuthenticateModel> AuthenticateUserAsync(AuthenticateUser.Request request)
        {
            

            var result = new AuthenticateModel
            {
                IsValidUser = true,
                Message = "Login successful",
                User = new Models.User
                {
                    ID = "531517",
                    FirstName = "RODNEY",
                    LastName = "GICKER",
                    Name = "RODNEY GICKER",
                    Email = "RODNEY.GICKER@TECHDATA.COM",
                    Phone = "727-539-7429",
                    Customers = new List<string>()
                    {
                        "0038048612",
                        "0038066560",
                        "0038066556",
                        "0038054253"
                    },
                    Roles = new List<string>()
                    {
                        "Administrator",
                        "Customer Service Representative",
                        "Marketer",
                        "Website owner"
                    }
                }
            };
            return await Task.FromResult(result);
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

        /// <summary>
        /// return dummy data, call core service once core security service is ready
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public async Task<User> GetUserAsync(GetUser.Request request)
        {
            var userResponse = new User
            {
                ID = "531517",
                FirstName = "RODNEY",
                LastName = "GICKER",
                Name = "RODNEY GICKER",
                Email = "RODNEY.GICKER@TECHDATA.COM",
                Phone = "727-539-7429",
                Customers = new List<string>()
                    {
                        "0038048612",
                        "0038066560",
                        "0038066556",
                        "0038054253"
                    },
                Roles = new List<string>()
                    {
                        "Administrator",
                        "Customer Service Representative",
                        "Marketer",
                        "Website owner"
                    }

            };
            return await Task.FromResult(userResponse);
        }
        public async Task<CartModel> GetCartDetails(GetCartDetails.GetCartRequest request)
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
    }
}
