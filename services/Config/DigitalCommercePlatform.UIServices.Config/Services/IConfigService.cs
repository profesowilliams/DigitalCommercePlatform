using DigitalCommercePlatform.UIServices.Config.Models.Configuration;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Services
{
    public interface IConfigService
    {
        Task<RecentConfigurationsModel> GetConfigurations(FindModel request);
    }
}
