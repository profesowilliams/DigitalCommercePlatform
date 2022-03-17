//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Dto.Profile;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System.Globalization;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Services
{
    public class CultureServiceTests
    {
        private readonly Mock<IProfileService<CultureDto>> _profileServiceMock;
        private readonly Mock<ISiteSettings> _siteSettingsMock;
        private readonly ICultureService _sut;

        public CultureServiceTests()
        {
            _profileServiceMock = new Mock<IProfileService<CultureDto>>();
            _siteSettingsMock = new Mock<ISiteSettings>();
            _sut = new CultureService(_profileServiceMock.Object, _siteSettingsMock.Object);
        }

        [Theory]
        [InlineData("en-US", null, null)]
        [InlineData("en-US", "", "")]
        [InlineData("en-US", " ", " ")]
        public void GetCulture_ProfileAndDefaultCultureNullOrWhiteSpace(string culture, string defaultCulture, string cultureForDto)
        {
            //arrange
            var cultureDto = new CultureDto { Culture = cultureForDto };
            _profileServiceMock.Setup(p => p.Get(It.Is<string>(n => n == CultureService.ProfileName)))
                .Returns(cultureDto)
                .Verifiable();
            _siteSettingsMock.Setup(s => s.TryGetSetting(It.Is<string>(n => n == CultureService.DefaultCultureSiteSettingName)))
                .Returns(defaultCulture)
                .Verifiable();

            //act
            _sut.Process(culture);

            //assert
            var expectedCulture = CultureInfo.CurrentCulture.Name;
            _profileServiceMock.Verify();
            _siteSettingsMock.Verify();
            expectedCulture.Should().Be(culture);
        }

        [Theory]
        [AutoDomainData]
        public void GetCulture_ProfileExists(CultureDto cultureDto, string culture)
        {
            //arrange
            cultureDto.Culture = "pl-PL";
            _profileServiceMock.Setup(p => p.Get(It.Is<string>(n => n == CultureService.ProfileName)))
                .Returns(cultureDto)
                .Verifiable();

            //act
            _sut.Process(culture);

            //assert
            var expectedCulture = CultureInfo.CurrentCulture.Name;
            _profileServiceMock.Verify();
            _siteSettingsMock.Verify(s => s.GetSetting(It.IsAny<string>()), Times.Never);
            expectedCulture.Should().Be(cultureDto.Culture);
            expectedCulture.Should().NotBe(culture);
        }

        [Theory]
        [AutoDomainData]
        public void Process_NoProfileAndDefaultCultureExists(string culture)
        {
            //arrange
            const string defaultCulture = "pl-PL";
            _profileServiceMock.Setup(p => p.Get(It.Is<string>(n => n == CultureService.ProfileName)))
                .Returns(default(CultureDto))
                .Verifiable();
            _siteSettingsMock.Setup(s => s.TryGetSetting(It.Is<string>(n => n == CultureService.DefaultCultureSiteSettingName)))
                .Returns(defaultCulture)
                .Verifiable();

            //act
            _sut.Process(culture);

            //assert
            var expectedCulture = CultureInfo.CurrentCulture.Name;
            _profileServiceMock.Verify();
            _siteSettingsMock.Verify();
            expectedCulture.Should().Be(defaultCulture);
            expectedCulture.Should().NotBe(culture);
        }

        [Fact]
        public void ProcessTest()
        {
            //arange
            const string culture = "pl-PL";

            //act
            _sut.Process(culture);

            //assert
            CultureInfo.CurrentCulture.Name.Should().Be(culture);
        }
    }
}