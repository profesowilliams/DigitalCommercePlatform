//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Dto.Profile;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Features.Contexts.Models;
using DigitalFoundation.Common.Services.Providers.Profile;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Services
{
    public class ProfileServiceTests
    {
        private readonly Mock<IContext> _contextMock;
        private readonly Mock<IProfileProvider> _profileProviderMock;
        private readonly IProfileService<CultureDto> _sut;

        public ProfileServiceTests()
        {
            _contextMock = new Mock<IContext>();
            _profileProviderMock = new Mock<IProfileProvider>();
            _sut = new ProfileService(_contextMock.Object, _profileProviderMock.Object);
        }

        [Theory]
        [AutoDomainData]
        public void Get_ReturnData(User user, string providerName, CultureDto cultureDto)
        {
            //arange
            _contextMock.SetupGet(c => c.User).Returns(user);

            _profileProviderMock.Setup(p => p.GetProfile<CultureDto>(
                    It.Is<string>(a => a == user.ActiveCustomer.CustomerNumber),
                    It.Is<string>(a => a == user.ID),
                    It.Is<string>(p => p == providerName)))
                .Returns(cultureDto)
                .Verifiable();

            //act
            var result = _sut.Get(providerName);

            //assert
            _profileProviderMock.Verify();
            result.Should().Be(cultureDto);
        }
    }
}