using DigitalCommercePlatform.UIServices.Account.Actions.ActionItemsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.ConfigurationsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.DealsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.GetConfigurationsFor;
using DigitalCommercePlatform.UIServices.Account.Actions.GetMyQuotes;
using DigitalCommercePlatform.UIServices.Account.Actions.MyOrders;
using DigitalCommercePlatform.UIServices.Account.Actions.SavedCartsList;
using DigitalCommercePlatform.UIServices.Account.Actions.ShipToAddress;
using DigitalCommercePlatform.UIServices.Account.Actions.TopConfigurations;
using DigitalCommercePlatform.UIServices.Account.Actions.TopDeals;
using DigitalCommercePlatform.UIServices.Account.Actions.TopQuotes;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalCommercePlatform.UIServices.Account.Models.Carts;
using DigitalCommercePlatform.UIServices.Account.Models.Configurations;
using DigitalCommercePlatform.UIServices.Account.Models.Deals;
using DigitalCommercePlatform.UIServices.Account.Models.Orders;
using DigitalCommercePlatform.UIServices.Account.Models.Quotes;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Services
{
    public interface IAccountService
    {
        Task<ConfigurationsSummaryModel> GetConfigurationsSummaryAsync(GetConfigurationsSummary.Request request);
        Task<List<DealsSummaryModel>> GetDealsSummaryAsync(GetDealsSummary.Request request);
        Task<DealModel> GetTopDealsAsync(GetTopDeals.Request request);
        Task<List<SavedCartDetailsModel>> GetSavedCartListAsync(GetCartsList.Request request);
        Task <ActionItemsModel>GetActionItemsSummaryAsync(GetActionItems.Request request);
        Task <ActiveOpenConfigurationsModel> GetTopConfigurationsAsync(GetTopConfigurations.Request request);
        Task<MyQuotes> MyQuotesSummaryAsync(MyQuoteDashboard.Request request);
        Task <ActiveOpenQuotesModel> GetTopQuotesAsync(GetTopQuotes.Request request);
        Task<List<string>> GetRenewalsExpirationDatesAsync(string customerNumber, string salesOrganization, int numberOfDaysToSubtract);
        Task<MyOrdersDashboard> GetMyOrdersSummaryAsync(GetMyOrders.Request request);
        Task<GetConfigurationsForModel> GetConfigurationsForAsync(GetConfigurationsFor.Request request);
        Task<IEnumerable<AddressDetails>> GetShipToAdress(GetShipToAddress.Request request);
    }
}
