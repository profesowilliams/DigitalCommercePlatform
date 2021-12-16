//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Product.Infrastructure.Mappings;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Product.Tests.Infrastructure.Mapping
{
    public class ProductProfileTests
    {
        [Fact]
        public void ProfileTests_MapperConfiguration_Valid()
        {
            //Arrange
            var configuration = new MapperConfiguration(config =>
            {
                config.AddProfile(new ProductProfile());
            });

            //Act - Assert
            configuration.AssertConfigurationIsValid();
        }
    }
}