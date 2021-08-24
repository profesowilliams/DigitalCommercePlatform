//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Config.Tests.Common.Factories;
using GRC = DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Actions.GetConfigurations.Validator
{
    public abstract class GetConfigurationsValidatorTestsBase
    {
        protected static GRC.GetConfigurations.Validator GetValidator()
        {
            return new GRC.GetConfigurations.Validator();
        }

        protected static GRC.GetConfigurations.Request GetValidRequest()
        {
            return new GRC.GetConfigurations.Request
            {
                Criteria = FindModelFactory.CreateValid()
            };
        }
    }
}
