using AutoMapper;
using DigitalCommercePlatform.UIService.Product.Infrastructure.Mappings;
using Xunit;

namespace DigitalCommercePlatform.UIService.Product.Tests.Automapper
{
    public class ProfilesTests
    {
        [Fact]
        public void ProfilesTests_MapperConfiguration_Valid()
        {
            //Arrange
            var configuration = new MapperConfiguration(config =>
            {
                config.AddProfile(new ProductProfile());
                config.AddProfile(new ProductSummaryProfile());
                config.AddProfile(new StockProfile());
            });

            //Act - Assert
            configuration.AssertConfigurationIsValid();
        }
    }
}