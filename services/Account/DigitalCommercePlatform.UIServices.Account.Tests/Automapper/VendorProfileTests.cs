using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Account.Tests.Automapper
{
    public class VendorProfileTests
    {
        [Fact]
        public void AutoMapper_Vendor()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<VendorProfile>());
            config.AssertConfigurationIsValid();
        }
    }
}
