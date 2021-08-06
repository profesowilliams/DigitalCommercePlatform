using DigitalCommercePlatform.UIServices.Config.Actions.EstimationValidate;
using DigitalCommercePlatform.UIServices.Config.Actions.GetDealDetail;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalCommercePlatform.UIServices.Config.Models.Deals;
using DigitalFoundation.Common.Models;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Services
{
    public interface IConfigService
    {
        Task<FindResponse<Configuration>> FindConfigurations(GetConfigurations.Request request);
        Task<FindResponse<DealsBase>> GetDeals(GetDeals.Request request);
        Task<DealsDetailModel> GetDealDetails(GetDeal.Request request);
        Task<bool> EstimationValidate(EstimationValidate.Request request);
        Task<string> GetPunchOutUrlAsync(PunchInModel request);
    }
}
