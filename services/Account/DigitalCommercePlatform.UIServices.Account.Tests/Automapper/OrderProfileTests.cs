//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Account.Tests.Automapper
{
    public class OrderProfileTests
    {
        [Fact]
        public void AutoMapper_Order()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<OrderProfile>());
            config.AssertConfigurationIsValid();
        }
    }
}
