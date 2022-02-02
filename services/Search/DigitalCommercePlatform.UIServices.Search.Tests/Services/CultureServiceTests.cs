//2022 (c) Tech Data Corporation -. All Rights Reserved.

using DigitalCommercePlatform.UIServices.Search.Models.Profile;
using DigitalCommercePlatform.UIServices.Search.Services;
using DigitalFoundation.Common.Providers.Settings;
using FluentAssertions;
using Moq;
using System.Collections.Generic;
using System.Globalization;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Search.Tests.Services
{
    public class CultureServiceTests
    {
        private readonly Mock<IProfileService> _profileServiceMock;
        private readonly Mock<ISiteSettings> _siteSettingsMock;
        private readonly ICultureService _sut;

        public CultureServiceTests()
        {
            _profileServiceMock = new Mock<IProfileService>();
            _siteSettingsMock = new Mock<ISiteSettings>();
            _sut = new CultureService(_profileServiceMock.Object, _siteSettingsMock.Object);
        }


        [Fact]
        public void Use_culture_from_profile_when_available()
        {
            //arange
            const string culture = "pl-PL";
            const string expectedCulture = "fi-FI";
            var searchProfileId = new SearchProfileId("111", "222");
            
            var cultureProfileModel = new CultureProfileModel { Culture = expectedCulture };
            _profileServiceMock.Setup(p => p.GetCultureProfile(searchProfileId)).Returns(cultureProfileModel).Verifiable();

            //act
            _sut.SetCurrentCultureFor(searchProfileId, culture);

            //assert
            CultureInfo.CurrentCulture.Name.Should().Be(expectedCulture);
            _profileServiceMock.Verify();
        }

        [Fact]
        public void Use_culture_from_settings_when_profile_is_not_available()
        {
            //arange
            const string culture = "pl-PL";
            const string expectedCulture = "fi-FI";
            var searchProfileId = new SearchProfileId("111", "222");

            var cultureProfileModel = new CultureProfileModel { Culture = null };
            _profileServiceMock.Setup(p => p.GetCultureProfile(searchProfileId)).Returns(cultureProfileModel).Verifiable();

            _siteSettingsMock.Setup(p => p.TryGetSetting(It.IsAny<string>())).Returns(expectedCulture).Verifiable();


            //act
            _sut.SetCurrentCultureFor(searchProfileId, culture);

            //assert
            CultureInfo.CurrentCulture.Name.Should().Be(expectedCulture);
            _profileServiceMock.Verify();
            _siteSettingsMock.Verify();
        }



        [Fact]
        public void Use_culture_from_parameter_when_user_is_anonymous_and_settings_are_not_available()
        {
            //arange
            const string culture = "pl-PL";
            var searchProfileId = new SearchProfileId(null,null);

            //act
            _sut.SetCurrentCultureFor(searchProfileId, culture);

            //assert
            CultureInfo.CurrentCulture.Name.Should().Be(culture);
        }

        [Theory]
        [MemberData(nameof(CultureData))]
        public void Use_culture_from_parameter_when_culture_from_profile_and_settings_are_not_available(string siteSettingsCulture, CultureProfileModel cultureProfileModel)
        {
            //arange
            const string culture = "pl-PL";
            var searchProfileId = new SearchProfileId("111", "222");
            
            _profileServiceMock.Setup(p => p.GetCultureProfile(searchProfileId)).Returns(cultureProfileModel).Verifiable();
            _siteSettingsMock.Setup(p => p.TryGetSetting(It.IsAny<string>())).Returns(siteSettingsCulture).Verifiable();


            //act
            _sut.SetCurrentCultureFor(searchProfileId, culture);

            //assert
            CultureInfo.CurrentCulture.Name.Should().Be(culture);
            _profileServiceMock.Verify();
            _siteSettingsMock.Verify();
        }

        public static IEnumerable<object[]> CultureData()
        {
            const string WhiteSpaceString = "       ";

            return new List<object[]>
            {
                new object[] {null, null},
                new object[] {null, new CultureProfileModel { Culture = null }},
                new object[] {null, new CultureProfileModel { Culture = string.Empty } },
                new object[] {null, new CultureProfileModel { Culture = WhiteSpaceString } },

                new object[] {string.Empty, null},
                new object[] {string.Empty, new CultureProfileModel { Culture = null }},
                new object[] {string.Empty, new CultureProfileModel { Culture = string.Empty } },
                new object[] {string.Empty, new CultureProfileModel { Culture = WhiteSpaceString } },

                new object[] { WhiteSpaceString, null},
                new object[] { WhiteSpaceString, new CultureProfileModel { Culture = null }},
                new object[] { WhiteSpaceString, new CultureProfileModel { Culture = string.Empty }},
                new object[] { WhiteSpaceString, new CultureProfileModel { Culture = WhiteSpaceString }},
            };
        }
            
    }
}
