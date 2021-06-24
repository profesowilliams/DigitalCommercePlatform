using GRC = DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Actions.GetConfigurations.Validator
{
    public abstract class GetConfigurationsValidatorTestsBase
    {
        protected static GRC.GetConfigurations.Validator GetValidator()
        {
            return new GRC.GetConfigurations.Validator();
        }
    }
}
