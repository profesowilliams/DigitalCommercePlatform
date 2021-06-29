using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Account.Tests.Automapper
{
    public class QuoteProfileTests
    {
        [Fact]
        public void AutoMapper_Quote()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<QuoteProfile>());
            config.AssertConfigurationIsValid();
        }
    }
}
