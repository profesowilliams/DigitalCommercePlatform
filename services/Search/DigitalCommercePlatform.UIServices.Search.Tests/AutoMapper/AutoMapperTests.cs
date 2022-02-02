//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.AutoMapperProfiles;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
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
            var config = new MapperConfiguration(cfg => cfg.AddProfile<SearchProfile>());
            var mapper = config.CreateMapper();

            var result = mapper.Map<FullSearchResponseModel>(appSearchResponse);

            result.Products.Select(p => p.Price).Should().OnlyContain(p => p == null);
        }

    }
}