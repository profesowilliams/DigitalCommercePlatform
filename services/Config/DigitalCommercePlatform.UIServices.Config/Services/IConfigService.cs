//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Config.Actions.EstimationValidate;
using DigitalCommercePlatform.UIServices.Config.Actions.FindDealsFor;
using DigitalCommercePlatform.UIServices.Config.Actions.GetDealDetail;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals;
using DigitalCommercePlatform.UIServices.Config.Actions.ProductPrice;
using DigitalCommercePlatform.UIServices.Config.Actions.Refresh;
using DigitalCommercePlatform.UIServices.Config.Actions.Spa;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalCommercePlatform.UIServices.Config.Models.Deals;
using DigitalCommercePlatform.UIServices.Config.Models.SPA;
using DigitalFoundation.Common.Features.Contexts.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Services
{
    public interface IConfigService
    {
        Task<FindResponse<Configuration>> FindConfigurations(GetConfigurations.Request request);
        Task<FindResponse<Deal>> GetDeals(GetDeals.Request request);
        Task<FindResponse<DealsBase>> GetDealsFor(GetDealsFor.Request request);
        Task<SpaDetailModel> GetDealDetails(GetDeal.Request request);
        Task<bool> EstimationValidate(EstimationValidate.Request request);
        Task<string> GetPunchOutUrlAsync(PunchInModel request);
        Task<RefreshData.Response> RefreshVendor(RefreshData.Request request);
        Task<SpaDetails.Response> GetSpaDetails(SpaDetails.Request request);
        Task<GetProductPrice.Response> GetProductPrice(GetProductPrice.Request request);

    }
}
