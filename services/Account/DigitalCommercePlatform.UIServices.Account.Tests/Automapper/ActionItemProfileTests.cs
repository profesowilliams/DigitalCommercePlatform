using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Account.Tests.Automapper
{
    public class ActionItemProfileTests
    {
        [Fact]
        public void AutoMapper_ActionItems()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<ActionItemProfile>());
            config.AssertConfigurationIsValid();
        }
    }
}
