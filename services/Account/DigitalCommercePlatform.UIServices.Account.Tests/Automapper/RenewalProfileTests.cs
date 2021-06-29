using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Account.Tests.Automapper
{
    public class RenewalProfileTests
    {
        [Fact]
        public void AutoMapper_Renewal()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<RenewalProfile>());
            config.AssertConfigurationIsValid();
        }
    }
}
