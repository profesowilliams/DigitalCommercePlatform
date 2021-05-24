using DigitalCommercePlatform.UIServices.Config.Actions.EstimationValidate;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations;
using DigitalCommercePlatform.UIServices.Config.Actions.GetDealDetail;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalCommercePlatform.UIServices.Config.Models.Deals;
using System.Collections.Generic;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIServices.Config.Actions.GetEstimations;
using DigitalCommercePlatform.UIServices.Config.Models.Estimations;

namespace DigitalCommercePlatform.UIServices.Config.Services
{
    public interface IConfigService
    {
        Task<List<Configuration>> FindConfigurations(GetConfigurations.Request request);
        Task<List<Estimation>> FindEstimations(GetEstimations.Request request);
        Task<List<Deal>> GetDeals(GetDeals.Request request);
        Task<DealsDetailModel> GetDealDetails(GetDeal.Request request);
        Task<bool> EstimationValidate(EstimationValidate.Request request);
    }
}
