using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Account.Tests.Automapper
{
    public class ConfigurationProfileTests
    {
        [Fact]
        public void AutoMapper_Configuration()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<ConfigurationProfile>());
            config.AssertConfigurationIsValid();
        }
    }
}
