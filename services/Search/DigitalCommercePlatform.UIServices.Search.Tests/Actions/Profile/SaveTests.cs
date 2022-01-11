//2022 (c) Tech Data Corporation - All Rights Reserved.

using DigitalCommercePlatform.UIServices.Search.Actions.Profile;
using DigitalCommercePlatform.UIServices.Search.Services;
using DigitalFoundation.Common.TestUtilities;
using Moq;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Search.Tests.Actions.Profile
{
    public class SaveTests
    {
        private readonly Mock<IProfileService> _profileServiceMock;
        private readonly Save.Handler _sut;

        public SaveTests()
        {
            _profileServiceMock = new Mock<IProfileService>();
            _sut = new Save.Handler(_profileServiceMock.Object);
        }

        [Theory]
        [AutoDomainData]
        public async Task Handle_CallService(Save.Request request)
        {
            //arrange

            //act
            await _sut.Handle(request, default).ConfigureAwait(false);

            //assert
            _profileServiceMock.Verify(x => x.SaveSearchProfile(request.Profile, request.ProfileId),
                Times.Once);
        }
    }
}