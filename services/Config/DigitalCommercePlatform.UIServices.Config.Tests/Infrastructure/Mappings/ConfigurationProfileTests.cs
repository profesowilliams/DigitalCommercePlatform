using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Configurations;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Infrastructure.Mappings
{
    public class ConfigurationProfileTests
    {
        [Fact]
        public void ConfigurationProfileConfigurationShouldBeValid()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<ConfigurationProfile>());
            config.AssertConfigurationIsValid();
        }
    }
}
