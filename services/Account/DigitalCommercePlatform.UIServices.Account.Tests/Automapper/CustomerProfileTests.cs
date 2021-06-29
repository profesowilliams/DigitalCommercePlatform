using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Account.Tests.Automapper
{
    public class CustomerProfileTests
    {
        [Fact]
        public void AutoMapper_Customer()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<CustomerProfile>());
            config.AssertConfigurationIsValid();
        }
    }
}
