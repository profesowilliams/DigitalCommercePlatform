//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Config.Actions.EstimationValidate;
using DigitalCommercePlatform.UIServices.Config.Actions.FindDealsFor;
using DigitalCommercePlatform.UIServices.Config.Actions.GetDealDetail;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals;
using DigitalCommercePlatform.UIServices.Config.Actions.Refresh;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalCommercePlatform.UIServices.Config.Models.Deals;
using DigitalFoundation.Common.Models;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Services
{
    public interface IConfigService
    {
        Task<FindResponse<Configuration>> FindConfigurations(GetConfigurations.Request request);
        Task<FindResponse<Deal>> GetDeals(GetDeals.Request request);
        Task<FindResponse<DealsBase>> GetDealsFor(GetDealsFor.Request request);
        Task<DealsDetailModel> GetDealDetails(GetDeal.Request request);
        Task<bool> EstimationValidate(EstimationValidate.Request request);
        Task<string> GetPunchOutUrlAsync(PunchInModel request);
        Task Refresh(Refresh.Request request);
    }
}
