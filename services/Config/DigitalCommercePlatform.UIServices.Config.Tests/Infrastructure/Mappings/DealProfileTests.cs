using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Deals;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Infrastructure.Mappings
{
    public class DealProfileTests
    {
        [Fact]
        public void DealProfileConfigurationShouldBeValid()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<DealProfile>());
            config.AssertConfigurationIsValid();
        }
    }
}
