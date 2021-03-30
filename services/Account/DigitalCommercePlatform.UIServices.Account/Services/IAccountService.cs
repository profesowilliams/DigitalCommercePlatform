using DigitalCommercePlatform.UIServices.Account.Actions.ActionItemsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.ConfigurationsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.DealsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.SavedCartsList;
using DigitalCommercePlatform.UIServices.Account.Actions.RenewalsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.TopConfigurations;
using DigitalCommercePlatform.UIServices.Account.Actions.TopQuotes;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalCommercePlatform.UIServices.Account.Models.Carts;
using DigitalCommercePlatform.UIServices.Account.Models.Configurations;
using DigitalCommercePlatform.UIServices.Account.Models.Deals;
using DigitalCommercePlatform.UIServices.Account.Models.Quotes;
using DigitalCommercePlatform.UIServices.Account.Models.Renewals;
using System.Threading.Tasks;


namespace DigitalCommercePlatform.UIServices.Account.Services
{
    public interface IAccountService
    {
        Task<ConfigurationsSummaryModel> GetConfigurationsSummaryAsync(GetConfigurationsSummary.Request request);
        Task<DealsSummaryModel> GetDealsSummaryAsync(GetDealsSummary.Request request);
        Task<CartModel> GetSavedCartListAsync(GetCartsList.Request request);
        Task <ActionItemsModel>GetActionItemsSummaryAsync(GetActionItems.Request request);
        Task <ActiveOpenConfigurationsModel> GetTopConfigurationsAsync(GetTopConfigurations.Request request);
        Task <ActiveOpenQuotesModel> GetTopQuotesAsync(GetTopQuotes.Request request);
        Task<RenewalsSummaryModel> GetRenewalsSummaryAsync(GetRenewalsSummary.Request criteria);
    }
}
