//2022 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Account.Tests.Automapper
{
    public class RegisterCustomerProfileTests
    {
        [Fact]
        public void AutoMapper_ActionItems()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<RegisterCustomerProfile>());
            config.AssertConfigurationIsValid();
        }
    }
}