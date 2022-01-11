//2022 (c) Tech Data Corporation - All Rights Reserved.

using DigitalCommercePlatform.UIServices.Search.Actions.Profile;
using DigitalCommercePlatform.UIServices.Search.Models.Profile;
using DigitalCommercePlatform.UIServices.Search.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Search.Tests.Actions.Profile
{
    public class GetTests
    {
        private readonly Mock<IProfileService> _profileServiceMock;
        private readonly Get.Handler _sut;

        public GetTests()
        {
            _profileServiceMock = new Mock<IProfileService>();
            _sut = new Get.Handler(_profileServiceMock.Object);
        }

        [Theory]
        [AutoDomainData]
        public async Task Handle_CallService_ReturnResult(Get.Request request, SearchProfileModel searchProfileModel)
        {
            //arrange
            _profileServiceMock.Setup(x => x.GetSearchProfile(request.ProfileId))
                .Returns(searchProfileModel)
                .Verifiable();

            //act
            var actual = await _sut.Handle(request, default).ConfigureAwait(false);

            //assert
            _profileServiceMock.VerifyAll();
            actual.Should().Be(searchProfileModel);
        }
    }
}