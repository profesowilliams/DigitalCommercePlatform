//2022 (c) Tech Data Corporation - All Rights Reserved.

using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Models.Profile;
using DigitalCommercePlatform.UIServices.Search.Services;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Search.Tests.Services
{
    public class SortServiceTests
    {
        private readonly Mock<ISiteSettings> _siteSettingsMock;
        private readonly Mock<ITranslationService> _translationServiceMock;
        private readonly Mock<IProfileService> _profileServiceMock;
        private readonly SortService _sut;

        private const string key = "Search.UI.SortingOptions";

        public SortServiceTests()
        {
            _siteSettingsMock = new Mock<ISiteSettings>();
            _translationServiceMock = new Mock<ITranslationService>();
            _profileServiceMock = new Mock<IProfileService>();
        }

        private SortService GetSut => new SortService(_siteSettingsMock.Object, _translationServiceMock.Object, _profileServiceMock.Object);

        private delegate void FetchTranslationsCallback(string key, ref Dictionary<string, string> dict);

        [Fact]
        public void GetDefaultSortingOptions_ReturnSortingOptions()
        {
            //arrange
            _siteSettingsMock.Setup(x => x.GetSetting<List<DropdownElementModel<string>>>(key)).Returns(GetDefaultSortOptions);

            _translationServiceMock.Setup(x => x.Translate(It.IsAny<Dictionary<string, string>>(), It.IsAny<string>(), null))
                .Returns((Dictionary<string, string> dict, string key, string fallback) => $"{key}Translated");

            //act
            var actual = GetSut.GetDefaultSortingOptions(null);

            //assert
            actual.Should().BeEquivalentTo(GetDefaultTranslatedSortOptions);
            _translationServiceMock.Verify(x => x.FetchTranslations(key, ref It.Ref<Dictionary<string, string>>.IsAny), Times.Once);
        }

        [Theory]
        [AutoDomainData(nameof(GetDefaultSortDto_ReturnsExpected_Data))]
        public void GetDefaultSortDto_ReturnsExpected(List<DropdownElementModel<string>> sortOptions, SortRequestDto expected)
        {
            //arrange
            _siteSettingsMock.Setup(x => x.GetSetting<List<DropdownElementModel<string>>>(key)).Returns(sortOptions);

            //act
            var actual = GetSut.GetDefaultSortDto(null);

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
        public void GetSortingOptionsBasedOnRequest_ReturnExpected(SortRequestModel sortRequestModel, IEnumerable<DropdownElementModel<string>> expectedValue)
        {
            //arrange
            _siteSettingsMock.Setup(x => x.GetSetting<List<DropdownElementModel<string>>>(key)).Returns(GetDefaultSortOptions);

            //act
            var actual = GetSut.GetSortingOptionsBasedOnRequest(sortRequestModel, null);

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

        [Theory]
        [AutoDomainData(nameof(SetSortingOptionsBasedOnProfile_UseProfileProperly_Data))]
        public void SetSortingOptionsBasedOnProfile_UseProfileProperly(SearchProfileId profileId, SearchProfileModel searchProfileModel, int expectedProfileServiceInvoke, List<DropdownElementModel<string>> expectedResult)
        {
            //arrange
            _profileServiceMock.Setup(x => x.GetSearchProfile(profileId)).Returns(searchProfileModel);

            _siteSettingsMock.Setup(x => x.GetSetting<List<DropdownElementModel<string>>>(key)).Returns(GetDefaultSortOptions);

            _translationServiceMock.Setup(x => x.Translate(It.IsAny<Dictionary<string, string>>(), It.IsAny<string>(), null))
                .Returns((Dictionary<string, string> dict, string key, string fallback) => $"{key}Translated");

            var method = typeof(SortService).GetMethod("SetSortingOptionsBasedOnprofile", System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic);

            var sut = GetSut;

            var sortingOptionsProperty = typeof(SortService).GetField("_sortingOptions", System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic);

            //act
            method.Invoke(sut, new[] { profileId });

            var actual = sortingOptionsProperty.GetValue(sut) as List<DropdownElementModel<string>>;

            //assert
            actual.Should().BeEquivalentTo(expectedResult);
            _profileServiceMock.Verify(x => x.GetSearchProfile(profileId), Times.Exactly(expectedProfileServiceInvoke));
        }

        public static IEnumerable<object> SetSortingOptionsBasedOnProfile_UseProfileProperly_Data()
        {
            return new[]
            {
                new object[]
                {
                    null,
                    null,
                    0,
                    GetDefaultTranslatedSortOptions
                },
                new object[]
                {
                    new SearchProfileId(null,null),
                    null,
                    0,
                    GetDefaultTranslatedSortOptions
                },
                new object[]
                {
                    new SearchProfileId("1","2"),
                    null,
                    1,
                    GetDefaultTranslatedSortOptions
                },
                new object[]
                {
                    new SearchProfileId("1","2"),
                    new SearchProfileModel{ DefaultSortOption=Guid.NewGuid().ToString()},
                    1,
                    GetDefaultTranslatedSortOptions
                },
                new object[]
                {
                    new SearchProfileId("1","2"),
                    new SearchProfileModel{ DefaultSortOption="Stock"},
                    1,
                    new List<DropdownElementModel<string>>
                    {
                        new DropdownElementModel<string>{ Id="Relevance", Selected=false, Name="RelevanceTranslated"},
                        new DropdownElementModel<string>{ Id="Stock", Selected=true, Name="StockTranslated"},
                        new DropdownElementModel<string>{ Id="Price.True", Selected=false, Name="Price.TrueTranslated"},
                        new DropdownElementModel<string>{ Id="Price.False", Selected=false, Name="Price.FalseTranslated"}
                    }
                }
            };
        }

        private static List<DropdownElementModel<string>> GetDefaultSortOptions =>
            new List<DropdownElementModel<string>>
            {
                new DropdownElementModel<string>{ Id="Relevance", Selected=false},
                new DropdownElementModel<string>{ Id="Stock", Selected=false},
                new DropdownElementModel<string>{ Id="Price.True", Selected=true},
                new DropdownElementModel<string>{ Id="Price.False", Selected=false}
            };

        private static List<DropdownElementModel<string>> GetDefaultTranslatedSortOptions =>
            new List<DropdownElementModel<string>>
            {
                new DropdownElementModel<string>{ Id="Relevance", Selected=false, Name="RelevanceTranslated"},
                new DropdownElementModel<string>{ Id="Stock", Selected=false, Name="StockTranslated"},
                new DropdownElementModel<string>{ Id="Price.True", Selected=true, Name="Price.TrueTranslated"},
                new DropdownElementModel<string>{ Id="Price.False", Selected=false, Name="Price.FalseTranslated"}
            };
    }
}