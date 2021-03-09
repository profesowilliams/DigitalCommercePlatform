using DigitalCommercePlatform.UIServices.Account.Actions.ConfigurationsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.DealsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.GetUser;
using DigitalCommercePlatform.UIServices.Account.Actions.ValidateUser;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalCommercePlatform.UIServices.Account.Models.Carts;
using DigitalCommercePlatform.UIServices.Account.Models.Configurations;
using DigitalCommercePlatform.UIServices.Account.Models.Deals;
using System.Threading.Tasks;
using static DigitalCommercePlatform.UIServices.Account.Actions.DetailsOfSavedCart.GetCartDetails;

namespace DigitalCommercePlatform.UIServices.Account.Services
{
    public interface IAccountService
    {
        Task<User> GetUserAsync(GetUser.Request request);
        Task<AuthenticateModel> AuthenticateUserAsync(AuthenticateUser.Request request);
        Task<ConfigurationsSummaryModel> GetConfigurationsSummaryAsync(GetConfigurationsSummary.Request request);
        Task<DealsSummaryModel> GetDealsSummaryAsync(GetDealsSummary.Request request);
        public Task<CartModel> GetCartDetails(GetCartRequest request);

    }
}
