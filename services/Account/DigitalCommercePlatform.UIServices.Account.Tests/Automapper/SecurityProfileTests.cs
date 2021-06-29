using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Account.Tests.Automapper
{
    public class SecurityProfileTests
    {
        [Fact]
        public void AutoMapper_Security()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<SecurityProfile>());
            config.AssertConfigurationIsValid();
        }
    }
}
