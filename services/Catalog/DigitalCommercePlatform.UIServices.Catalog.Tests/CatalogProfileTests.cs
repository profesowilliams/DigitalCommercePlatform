using AutoMapper;
using DigitalCommercePlatform.UIService.Catalog.Automapper;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Catalog.Tests
{
    public class CatalogProfileTests
    {
        [Fact]
        public void CatalogProfile_ValidConfiguration()
        {
            // arrange
            var configuration = new MapperConfiguration(config =>
            {
                config.AddProfile(new CatalogProfile());
            });

            // act - assert
            // it checks that every map configuration is valid
            // Make sure that every single destination type member has a corresponding type member on the source type
            configuration.AssertConfigurationIsValid();
        }
    }
}