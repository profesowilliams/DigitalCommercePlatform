using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Account.Tests.Automapper
{
    public class DealProfileTests
    {
        [Fact]
        public void AutoMapper_Deals()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<DealProfile>());
            config.AssertConfigurationIsValid();
        }
    }
}
