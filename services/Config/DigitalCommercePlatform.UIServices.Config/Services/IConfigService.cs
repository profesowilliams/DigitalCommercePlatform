using DigitalCommercePlatform.UIServices.Config.Actions.GetDealDetail;
using DigitalCommercePlatform.UIServices.Config.Models.Deals;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Services
{
    public interface IConfigService
    {
        Task<Models.Configurations.RecentConfigurationsModel> GetConfigurations(Models.Configurations.FindModel request);
        Task<Models.Deals.RecentDealsModel> GetDeals(FindModel request);
        Task<DealsDetailModel> GetDealDetails(GetDeal.Request request);
    }
}
