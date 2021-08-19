using GRD = DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Actions.GetDeals.Validator
{
    public abstract class GetDealsValidatorTestsBase
    {
        protected static GRD.GetDeals.Validator GetValidator()
        {
            return new GRD.GetDeals.Validator();
        }

        protected static GRD.GetDeals.Request GetValidModel()
        {
            return new GRD.GetDeals.Request();
        }
    }
}
