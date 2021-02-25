using DigitalCommercePlatform.UIServices.Account.Actions.GetUser;
using DigitalCommercePlatform.UIServices.Account.Actions.ValidateUser;
using DigitalCommercePlatform.UIServices.Account.Models;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Services
{
    public interface IAccountService
    {
        Task<User> GetUserAsync(GetUser.Request request);
        Task<AuthenticateModel> AuthenticateUserAsync(AuthenticateUser.Request request);
    }
}
