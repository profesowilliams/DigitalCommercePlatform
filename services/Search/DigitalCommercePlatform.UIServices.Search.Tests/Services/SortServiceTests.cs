//2021 (c) Tech Data Corporation -. All Rights Reserved.

using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Services;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Search.Tests.Services
{
    public class SortServiceTests
    {
        private readonly Mock<ISiteSettings> _siteSettingsMock;
        private readonly Mock<ITranslationService> _translationServiceMock;
        private readonly SortService _sut;

        private const string key = "Search.UI.SortingOptions";

        public SortServiceTests()
        {
            _siteSettingsMock = new Mock<ISiteSettings>();
            _translationServiceMock = new Mock<ITranslationService>();
        }

        private SortService GetSut => new SortService(_siteSettingsMock.Object, _translationServiceMock.Object);

        private delegate void FetchTranslationsCallback(string key, ref Dictionary<string, string> dict);

        [Fact]
        public void GetDefaultSortingOptions_ReturnSortingOptions()
        {
            //arrange
            _siteSettingsMock.Setup(x => x.GetSetting<List<DropdownElementModel>>(key)).Returns(GetDefaultSortOptions);

            _translationServiceMock.Setup(x => x.Translate(It.IsAny<Dictionary<string, string>>(), It.IsAny<string>(), null))
                .Returns((Dictionary<string, string> dict, string key, string fallback) => $"{key}Translated");

            //act
            var actual = GetSut.GetDefaultSortingOptions();

            //assert
            actual.Should().BeEquivalentTo(GetDefaultTranslatedSortOptions);
            _translationServiceMock.Verify(x => x.FetchTranslations(key, ref It.Ref<Dictionary<string, string>>.IsAny), Times.Once);
        }

        [Theory]
        [AutoDomainData(nameof(GetDefaultSortDto_ReturnsExpected_Data))]
        public void GetDefaultSortDto_ReturnsExpected(List<DropdownElementModel> sortOptions, SortRequestDto expected)
        {
            //arrange
            _siteSettingsMock.Setup(x => x.GetSetting<List<DropdownElementModel>>(key)).Returns(sortOptions);

            //act
            var actual = GetSut.GetDefaultSortDto();

            //assert
            actual.Should().BeEquivalentTo(expected);
        }

        public static IEnumerable<object> GetDefaultSortDto_ReturnsExpected_Data()
        {
            return new[]
            {
                new object[]
                {
                    GetDefaultSortOptions.Select(x=>{x.Selected=false;return x; }).ToList(),
                    null
                },
                new object[]
                {
                    GetDefaultSortOptions,
                    new SortRequestDto
                    {
                        Type="Price",
                        Direction=true
                    }
                },
                new object[]
                {
                    GetDefaultSortOptions.Select(x=>{x.Selected=x.Id=="Relevance";return x; }).ToList(),
                    new SortRequestDto
                    {
                        Type="Relevance",
                        Direction=false
                    }
                }
            };
        }

        [Theory]
        [AutoDomainData(nameof(GetSortingOptionsBasedOnRequest_ReturnExpected_Data))]
        public void GetSortingOptionsBasedOnRequest_ReturnExpected(SortRequestModel sortRequestModel, IEnumerable<DropdownElementModel> expectedValue)
        {
            //arrange
            _siteSettingsMock.Setup(x => x.GetSetting<List<DropdownElementModel>>(key)).Returns(GetDefaultSortOptions);

            //act
            var actual = GetSut.GetSortingOptionsBasedOnRequest(sortRequestModel);

            //assert
            actual.Should().BeEquivalentTo(expectedValue);
        }

        public static IEnumerable<object> GetSortingOptionsBasedOnRequest_ReturnExpected_Data()
        {
            return new[]
            {
                new object[]
                {
                    null,
                    GetDefaultSortOptions
                },
                new object[]
                {
                    new SortRequestModel{ Type="Another", Direction=true},
                    GetDefaultSortOptions.Select(x=>{ x.Selected=false; return x; })
                },
                new object[]
                {
                    new SortRequestModel{ Type="Stock"},
                    GetDefaultSortOptions.Select(x=>{x.Selected=x.Id=="Stock"; return x; })
                },
                new object[]
                {
                    new SortRequestModel{ Type="Price", Direction=true},
                    GetDefaultSortOptions.Select(x=>{x.Selected=x.Id=="Price.True"; return x; })
                },
                new object[]
                {
                    new SortRequestModel{ Type="Price", Direction=false},
                    GetDefaultSortOptions.Select(x=>{x.Selected=x.Id=="Price.False"; return x; })
                }
            };
        }

        private static List<DropdownElementModel> GetDefaultSortOptions =>
            new List<DropdownElementModel>
            {
                new DropdownElementModel{ Id="Relevance", Selected=false},
                new DropdownElementModel{ Id="Stock", Selected=false},
                new DropdownElementModel{ Id="Price.True", Selected=true},
                new DropdownElementModel{ Id="Price.False", Selected=false}
            };

        private static List<DropdownElementModel> GetDefaultTranslatedSortOptions =>
            new List<DropdownElementModel>
            {
                new DropdownElementModel{ Id="Relevance", Selected=false, Name="RelevanceTranslated"},
                new DropdownElementModel{ Id="Stock", Selected=false, Name="StockTranslated"},
                new DropdownElementModel{ Id="Price.True", Selected=true, Name="Price.TrueTranslated"},
                new DropdownElementModel{ Id="Price.False", Selected=false, Name="Price.FalseTranslated"}
            };
    }
}