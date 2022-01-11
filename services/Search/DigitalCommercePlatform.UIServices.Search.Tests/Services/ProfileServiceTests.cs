//2022 (c) Tech Data Corporation - All Rights Reserved.

using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Dto.Profile;
using DigitalCommercePlatform.UIServices.Search.Models.Profile;
using DigitalCommercePlatform.UIServices.Search.Services;
using DigitalFoundation.Common.Features.Client.Exceptions;
using DigitalFoundation.Common.Services.Providers.Profile;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Search.Tests.Services
{
    public class ProfileServiceTests
    {
        private readonly Mock<IProfileProvider> _profileProviderMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly ProfileService _sut;

        public ProfileServiceTests()
        {
            _profileProviderMock = new Mock<IProfileProvider>();
            _mapperMock = new Mock<IMapper>();

            _sut = new ProfileService(_profileProviderMock.Object, _mapperMock.Object);
        }

        [Theory]
        [AutoDomainData]
        public void SaveSearchProfile(SearchProfileModel profile, SearchProfileId profileId, SearchProfileDto searchProfileDto)
        {
            //arrange
            _mapperMock.Setup(x => x.Map<SearchProfileDto>(profile)).Returns(searchProfileDto)
                .Verifiable();

            //act
            _sut.SaveSearchProfile(profile, profileId);

            //assert
            _profileProviderMock.Verify(x => x.CreateUserProfile(profileId.Account, profileId.UserId, "UI.Search.Profile", searchProfileDto), Times.Once);
            _mapperMock.VerifyAll();
        }

        [Theory]
        [AutoDomainData]
        public void GetSearchProfile_CallOncePerRequest(SearchProfileId searchProfileId, SearchProfileDto searchProfileDto, SearchProfileModel searchProfileModel)
        {
            //arrange
            _profileProviderMock.Setup(x => x.GetProfile<SearchProfileDto>(searchProfileId.Account, searchProfileId.UserId, "UI.Search.Profile"))
                .Returns(searchProfileDto)
                .Verifiable();

            _mapperMock.Setup(x => x.Map<SearchProfileModel>(searchProfileDto)).Returns(searchProfileModel);

            //act
            var result1 = _sut.GetSearchProfile(searchProfileId);
            var result2 = _sut.GetSearchProfile(searchProfileId);

            //assert
            result1.Should().Be(result2);
            result1.Should().Be(searchProfileModel);

            _mapperMock.Verify(x => x.Map<SearchProfileModel>(searchProfileDto), Times.Once);
            _profileProviderMock.Verify(x => x.GetProfile<SearchProfileDto>(searchProfileId.Account, searchProfileId.UserId, "UI.Search.Profile"), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public void GetSearchProfile_ReturnNullWhenNotFound(SearchProfileId searchProfileId)
        {
            //arrange
            _profileProviderMock.Setup(x => x.GetProfile<SearchProfileDto>(searchProfileId.Account, searchProfileId.UserId, "UI.Search.Profile"))
                .Throws(new RemoteServerHttpException("Test message", System.Net.HttpStatusCode.NotFound, (object)null));

            //act
            var result1 = _sut.GetSearchProfile(searchProfileId);

            //assert
            result1.Should().BeNull();
        }
    }
}