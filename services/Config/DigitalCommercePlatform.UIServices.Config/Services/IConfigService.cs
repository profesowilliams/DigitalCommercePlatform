using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Services
{
    public interface IConfigService
    {
        Task<Models.Configurations.RecentConfigurationsModel> GetConfigurations(Models.Configurations.FindModel request);
        Task<Models.Deals.RecentDealsModel> GetDeals(Models.Deals.FindModel request);
    }
}
