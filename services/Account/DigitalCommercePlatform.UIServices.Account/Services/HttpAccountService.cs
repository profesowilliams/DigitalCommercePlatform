using DigitalCommercePlatform.UIServices.Account.Actions.GetUser;
using DigitalCommercePlatform.UIServices.Account.Actions.ValidateUser;
using DigitalCommercePlatform.UIServices.Account.Models;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Net.Http;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Services
{
    [ExcludeFromCodeCoverage]
    public class HttpAccountService : IAccountService
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly string _coreSecurityServiceUrl;
        public HttpAccountService(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
            _coreSecurityServiceUrl = "https://eastus-dit-service.dc.tdebusiness.cloud/core-security/v1/";
        }

        /// <summary>
        /// Call core service once DF is done
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public async Task<AuthenticateModel> AuthenticateUserAsync(AuthenticateUser.Request request)
        {
            if (!request.Criteria.WithUserData.HasValue || !request.Criteria.WithUserData.Value)
            {
                return await Task.FromResult(new AuthenticateModel()
                {
                    Message = "Login successful",
                    IsValidUser = true
                }); ;
            }

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
    }
}
