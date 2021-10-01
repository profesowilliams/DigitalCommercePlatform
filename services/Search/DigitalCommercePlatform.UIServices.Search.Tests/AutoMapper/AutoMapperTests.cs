//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.AutoMapperProfiles;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Search.Tests.AutoMapper
{
    public class AutoMapperTests
    {
        [Fact]
        public void MappingConfigurationGetIsValid()
        {
            // arrange
            var configuration = new MapperConfiguration(config =>
            {
                config.AddProfile(new SearchProfile());
            });

            // act - assert
            // it checks that every map configuration is valid
            // Make sure that every single destination type member has a corresponding type member on the source type
            configuration.AssertConfigurationIsValid();
        }
    }
}