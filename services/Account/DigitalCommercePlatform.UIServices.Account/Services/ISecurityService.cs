using DigitalFoundation.Common.Security.Messages;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Services
{
    public interface ISecurityService
    {
        Task<ClientLoginCodeTokenResponseModel> GetToken(string code,string redirectUri,string traceId,string language,string consumer);
        Task<ValidateUserResponseModel> GetUser(string accessToken,string applicationName, string traceId, string language, string consumer);
    }
}
