using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Account.Tests.Automapper
{
    public class CartProfileTests
    {
        [Fact]
        public void AutoMapper_Cart()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<CartProfile>());
            config.AssertConfigurationIsValid();
        }
    }
}
