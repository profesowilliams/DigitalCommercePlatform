//2022 (c) Tech Data Corporation - All Rights Reserved.

using DigitalCommercePlatform.UIServices.Search.Models.Profile;
using DigitalCommercePlatform.UIServices.Search.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System.Collections.Generic;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Search.Tests.Services
{
    public class MarketServiceTests
    {
        private readonly Mock<IProfileService> _profileServiceMock;
        private readonly MarketService _sut;

        public MarketServiceTests()
        {
            _profileServiceMock = new Mock<IProfileService>();
            _sut = new MarketService(_profileServiceMock.Object);
        }

        [Theory]
        [AutoDomainData(nameof(GetMarkets_ReturnProperData_Data))]
        public void GetMarkets_ReturnProperData(SearchProfileId searchProfileId, SearchProfileModel searchProfileModel, int expectedProfileServiceCalls, string[] expectedResults)
        {
            //arrange
            _profileServiceMock.Setup(x => x.GetSearchProfile(searchProfileId)).Returns(searchProfileModel);

            //act
            var actual = _sut.GetMarkets(searchProfileId);

            //assert
            _profileServiceMock.Verify(x => x.GetSearchProfile(searchProfileId), Times.Exactly(expectedProfileServiceCalls));

            actual.Should().BeEquivalentTo(expectedResults);
        }

        public static IEnumerable<object> GetMarkets_ReturnProperData_Data =>
            new[]
            {
                new object[]
                {
                    null,
                    null,
                    0,
                    new string[]{"ALL"}
                },
                new object[]
                {
                    new SearchProfileId(null,null),
                    null,
                    0,
                    new string[]{"ALL"}
                },
                new object[]
                {
                    new SearchProfileId("1","2"),
                    null,
                    1,
                    new string[]{"ALL"}
                },
                new object[]
                {
                    new SearchProfileId("1","2"),
                    new SearchProfileModel(),
                    1,
                    new string[]{"ALL"}
                },
                new object[]
                {
                    new SearchProfileId("1","2"),
                    new SearchProfileModel{ DefaultMarketOption="ALL"},
                    1,
                    new string[]{"ALL"}
                },
                new object[]
                {
                    new SearchProfileId("1","2"),
                    new SearchProfileModel{ DefaultMarketOption="MARKET1,MARKET2"},
                    1,
                    new string[]{ "MARKET1" ,"MARKET2" }
                }
            };
    }
}