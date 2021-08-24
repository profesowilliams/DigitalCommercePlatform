//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Account.Actions.ConnectToVendor;
using DigitalCommercePlatform.UIServices.Account.Actions.VendorAuthorizedURL;
using DigitalCommercePlatform.UIServices.Account.Actions.VendorDisconnect;
using DigitalCommercePlatform.UIServices.Account.Actions.VendorRefreshToken;
using DigitalCommercePlatform.UIServices.Account.Controllers;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Services.Actions.Abstract;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
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
        public async Task GetVendorReference(ResponseBase<SetVendorConnection.Response> expected)
        {
            _mediator.Setup(x => x.Send(
                      It.IsAny<SetVendorConnection.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var controller = GetController();
            var result = await controller.SetVendorConnections("72TAdk1yNvHjXBJlQoEkrLmRHvOZvSvD470AAABr", "Cisco", "https://dit.dc.tdebusiness.cloud/content/techdata/us/vendorlogin.html").ConfigureAwait(false);

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
            // Act
            var actionResult = await controller.VendorRefreshToken("HP").ConfigureAwait(false);
            // Assert
            Assert.IsType<OkObjectResult>(actionResult);
        }

        [Fact]
        public async Task VendorRefreshTokenInvalidVendor()
        {
            // Arrange
            var validator = new VendorRefreshToken.Validator();
            var cmd = new VendorRefreshToken.Request("InvalidVendor");
            // Act
            var validationResult = await validator.ValidateAsync(cmd);
            // Assert
            Assert.False(validationResult.IsValid);
        }

        [Theory]
        [AutoDomainData]
        public async Task VendorDisconnect(ResponseBase<GetVendorDisconnect.Response> expected)
        {
            _mediator.Setup(x => x.Send(
                      It.IsAny<GetVendorDisconnect.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var controller = GetController();
            var result = await controller.VendorDisconnect("Cisco").ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.BadRequest);
        }

        [Theory]
        [AutoDomainData]
        public async Task VendorAuthorizeURL(ResponseBase<getVendorAuthorizeURL.Response> expected)
        {
            _mediator.Setup(x => x.Send(
                      It.IsAny<getVendorAuthorizeURL.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var controller = GetController();
            var result = await controller.VendorAuthorizeURL("Cisco").ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.BadRequest);
        }
    }
}
