//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.AutoMapperProfiles;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Features.Image;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System.Collections.Generic;
using System.Linq;
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

        [Fact]
        public void GetFlagsReturnsTrueTestData()
        {
            //Arrange 
            var item = new ElasticItemDto()
            {
                Indicators = new List<IndicatorDto>() {
                    new IndicatorDto{ Type = "Orderable", Value = "Y" },
                    new IndicatorDto{ Type = "AuthRequiredPrice", Value = "false" }
                }
            };
            // Act
            var (resultOrderable, resultAuthrequiredprice) = SearchProfile.GetFlags(item);
            // Assert
            resultOrderable.Equals(true);
            resultAuthrequiredprice.Equals(true);
        }

        [Fact]
        public void GetFlagsReturnsFalseTestData()
        {
            //Arrange 
            var item = new ElasticItemDto()
            {
                Indicators = new List<IndicatorDto>() {
                    new IndicatorDto{ Type = "Orderable", Value = "N" },
                    new IndicatorDto{ Type = "AuthRequiredPrice", Value = "true" }
                }
            };
            // Act
            var (resultOrderable, resultAuthrequiredprice) = SearchProfile.GetFlags(item);
            // Assert
            resultOrderable.Equals(true);
            resultAuthrequiredprice.Equals(true);
        }

        [Theory]
        [AutoDomainData]
        public void ProductPriceIgnoredInMapping(SearchResponseDto appSearchResponse)
        {
            //arrange
            var siteSettings = new Mock<ISiteSettings>();
            var imageResolutionService = new Mock<IImageResolutionService>(); 

            var config = new MapperConfiguration(cfg => 
            {
                cfg.AddProfile<SearchProfile>();
                cfg.ConstructServicesUsing(s => new ImageResolutionValueResolver(siteSettings.Object, imageResolutionService.Object));
            });
            var mapper = config.CreateMapper();

            //act
            var result = mapper.Map<FullSearchResponseModel>(appSearchResponse);

            //assert
            result.Products.Select(p => p.Price).Should().OnlyContain(p => p == null);
        }
    }
}