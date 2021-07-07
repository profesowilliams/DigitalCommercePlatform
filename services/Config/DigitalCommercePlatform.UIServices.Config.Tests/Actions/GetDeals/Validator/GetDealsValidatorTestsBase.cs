using MD = DigitalCommercePlatform.UIServices.Config.Models.Deals;
using GRD = DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Actions.GetDeals.Validator
{
    public abstract class GetDealsValidatorTestsBase
    {
        protected static GRD.GetDeals.Validator GetValidator()
        {
            return new GRD.GetDeals.Validator();
        }

        protected static MD.FindModel GetValidModel()
        {
            return new MD.FindModel();
        }
    }
}
