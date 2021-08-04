using DigitalCommercePlatform.UIServices.Config.Actions.EstimationValidate;
using DigitalCommercePlatform.UIServices.Config.Actions.FindSPA;
using DigitalCommercePlatform.UIServices.Config.Actions.GetDealDetail;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalCommercePlatform.UIServices.Config.Models.Deals;
using DigitalCommercePlatform.UIServices.Config.Models.SPA;
using DigitalFoundation.Common.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Services
{
    public interface IConfigService
    {
        Task<List<Configuration>> FindConfigurations(GetConfigurations.Request request);
        Task<List<Deal>> GetDeals(GetDeals.Request request);
        Task<DealsDetailModel> GetDealDetails(GetDeal.Request request);
        Task<bool> EstimationValidate(EstimationValidate.Request request);
        Task<string> GetPunchOutUrlAsync(PunchInModel request);
        Task<FindResponse<SpaBase>> GetSPADetails(GetSPA.Request request);
    }
}
