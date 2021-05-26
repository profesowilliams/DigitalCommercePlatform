using DigitalCommercePlatform.UIServices.Account.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Account.Actions.VendorReference;
using DigitalCommercePlatform.UIServices.Account.Actions.VendorRefreshToken;
using DigitalCommercePlatform.UIServices.Account.Controllers;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using MediatR;
using Microsoft.Extensions.Logging;
using Moq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Account.Tests.Controller
{
    public class VendorControllerTests
    {
        private readonly Mock<IUIContext> _context;
        private readonly Mock<IMediator> _mediator;
        private readonly Mock<ILogger<SecurityController>> _logger;
        private readonly Mock<IAppSettings> _appSettingsMock;
        private readonly Mock<ISiteSettings> _siteSettings;

        public VendorControllerTests()
        {
            _appSettingsMock = new Mock<IAppSettings>();
            _appSettingsMock.Setup(s => s.GetSetting("LocalizationList")).Returns("en-US");

            _context = new Mock<IUIContext>();
            _mediator = new Mock<IMediator>();
            _logger = new Mock<ILogger<SecurityController>>();
            _siteSettings = new Mock<ISiteSettings>();
        }

        private VendorController GetController()
        {
            return new VendorController(_mediator.Object, _appSettingsMock.Object, _logger.Object, _context.Object, _siteSettings.Object);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetVendorReference(ResponseBase<GetVendorReference.Response> expected)
        {
            _mediator.Setup(x => x.Send(
                      It.IsAny<GetVendorReference.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetVendorReference().ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.BadRequest);
        }

        [Theory]
        [AutoDomainData]
        public async Task VendorRefreshToken(ResponseBase<VendorRefreshToken.Response> expected)
        {
            _mediator.Setup(x => x.Send(
                      It.IsAny<VendorRefreshToken.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.VendorRefreshToken("HP").ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.BadRequest);
        }

    }
}