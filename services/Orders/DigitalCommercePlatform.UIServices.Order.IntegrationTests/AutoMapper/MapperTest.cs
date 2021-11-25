using AutoMapper;
using DigitalCommercePlatform.UIServices.Order.AutoMapper;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Order.IntegrationTests.AutoMapper
{
    public class MapperTest
    {
        [Fact]
        public void NuanceProfile_ValidConfiguration()
        {
            var configuration = new MapperConfiguration(config =>
            {
                config.AddProfile(new NuanceWebChatProfile());
            });

            configuration.AssertConfigurationIsValid();
        }
        [Fact]
        public void OrderProfile_ValidConfiguration()
        {
            var configuration = new MapperConfiguration(config =>
            {
                config.AddProfile(new OrderProfile());
            });

            configuration.AssertConfigurationIsValid();
        }
    }
}
