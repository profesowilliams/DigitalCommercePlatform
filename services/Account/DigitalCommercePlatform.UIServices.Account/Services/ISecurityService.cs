//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Account.Models.Accounts;
using DigitalFoundation.Common.Security.Messages;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Services
{
    public interface ISecurityService
    {
        Task<ClientLoginCodeTokenResponseModel> GetToken(string code,string redirectUri);
        Task<ValidateUserResponseModel> GetUser(string applicationName);
        Task<ClientRevokeTokenResponseModel> RevokePingTokenAsync(string sessionId);
    }
}
