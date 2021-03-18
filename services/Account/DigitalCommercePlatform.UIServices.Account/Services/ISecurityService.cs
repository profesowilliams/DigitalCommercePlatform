using DigitalFoundation.Common.Models;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Services
{
    public interface ISecurityService
    {
        Task<string> GetToken(string code,string redirectUri,string traceId,string language,string consumer);
        Task<User> GetUser(string accessToken,string applicationName, string traceId, string language, string consumer);
    }
}
