//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoFixture.Xunit2;
using DigitalCommercePlatform.UIServices.Account.Actions.GetUser;
using DigitalCommercePlatform.UIServices.Account.Actions.InHouseAccount;
using DigitalCommercePlatform.UIServices.Account.Actions.Logout;
using DigitalCommercePlatform.UIServices.Account.Actions.UserActiveCustomer;
using DigitalCommercePlatform.UIServices.Account.Actions.ValidateUser;
using DigitalCommercePlatform.UIServices.Account.Controllers;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
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
    public class SecurityControllerTests
    {
        private readonly Mock<IUIContext> _context;
        private readonly Mock<IMediator> _mediator;
        private readonly Mock<ILogger<SecurityController>> _logger;
        private readonly Mock<IAppSettings> _appSettingsMock;
        private readonly Mock<ISiteSettings> _siteSettings;

        public SecurityControllerTests()
        {
            _appSettingsMock = new Mock<IAppSettings>();
            _appSettingsMock.Setup(s => s.GetSetting("LocalizationList")).Returns("en-US");

            _context = new Mock<IUIContext>();
            _mediator = new Mock<IMediator>();
            _logger = new Mock<ILogger<SecurityController>>();
            _siteSettings = new Mock<ISiteSettings>();
        }

        private SecurityController GetController()
        {
            return new SecurityController(_mediator.Object, _appSettingsMock.Object, _logger.Object, _context.Object, _siteSettings.Object);
        }

        public static IAppSettings GetAppSettings()
        {
            var appSettingsMock = new Mock<IAppSettings>();
            appSettingsMock.Setup(s => s.GetSetting("LocalizationList")).Returns("en-US");
            return appSettingsMock.Object;
        }

        [Theory]
        [AutoDomainData]
        public async Task GetUser(
            ResponseBase<GetUser.Response> expected,
            [Frozen] Mock<IMediator> mediator,
            [Set(nameof(GetAppSettings))]
            [Greedy] SecurityController controller)
        {
            mediator.Setup(x => x.Send(
                       It.IsAny<GetUser.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var result = await controller.GetUserAsync("DCP").ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task AuthenticateUser(
            [Frozen] Mock<IMediator> mediator,
            [Greedy] SecurityController controller,
            ResponseBase<AuthenticateUser.Response> expected)
        {
            var bodyRequest = new AuthenticateBodyRequest
            {
                Code = "testCode-1234",
                RedirectUri = "Http://TestSiteURL",
                ApplicationName = "AEM"
            };

            var headerRequest = new AuthenticateHeaderRequest
            {
                Consumer = "",
                Language = "",
                SessionId = "",
                Site = "",
                TraceId = ""
            };

            mediator.Setup(x => x.Send(
                       It.IsAny<AuthenticateUser.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var result = await controller.Authenticate(bodyRequest, headerRequest);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task AuthenticateUser_BadRequest([Frozen] Mock<IMediator> mediator,
            [Greedy] SecurityController controller,
            ResponseBase<AuthenticateUser.Response> expected)
        {
            mediator.Setup(x => x.Send(
                      It.IsAny<AuthenticateUser.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);
            var result = await controller.Authenticate(null, null).ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.BadRequest);
        }

        [Theory]
        [AutoDomainData]
        public async Task AuthenticateUser_OkRequest([Frozen] Mock<IMediator> mediator,
            [Greedy] SecurityController controller,
            ResponseBase<AuthenticateUser.Response> expected)
        {
            expected.Error.IsError = false;

            mediator.Setup(x => x.Send(
                      It.IsAny<AuthenticateUser.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);
            var result = await controller.Authenticate(null, null).ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.OK);
        }

        [Theory]
        [AutoDomainData]
        public async Task LogoutUser_BadRequest([Frozen] Mock<IMediator> mediator,
            [Greedy] SecurityController controller,
            ResponseBase<LogoutUser.Response> expected)
        {
            mediator.Setup(x => x.Send(
                      It.IsAny<LogoutUser.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);
            var result = await controller.Logout(null).ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.BadRequest);
        }

        [Theory]
        [AutoDomainData]
        public async Task LogoutUser_OkRequest([Frozen] Mock<IMediator> mediator,
            [Greedy] SecurityController controller,
            ResponseBase<LogoutUser.Response> expected)
        {
            expected.Error.IsError = false;

            mediator.Setup(x => x.Send(
                      It.IsAny<LogoutUser.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);
            var result = await controller.Logout(null).ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.OK);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetUser_BadRequest(ResponseBase<GetUser.Response> expected,
            [Frozen] Mock<IMediator> mediator,
            [Set(nameof(GetAppSettings))]
            [Greedy] SecurityController controller)
        {
            mediator.Setup(x => x.Send(
                      It.IsAny<GetUser.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var result = await controller.GetUserAsync(null).ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.BadRequest);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetUser_OkRequest(ResponseBase<GetUser.Response> expected,
            [Frozen] Mock<IMediator> mediator,
            [Set(nameof(GetAppSettings))]
            [Greedy] SecurityController controller)
        {
            expected.Error.IsError = false;

            mediator.Setup(x => x.Send(
                      It.IsAny<GetUser.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var result = await controller.GetUserAsync(null).ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.OK);
        }

        [Theory]
        [AutoDomainData]
        public async Task ActiveCustomer_BadRequest(ResponseBase<ActiveCustomer.Response> expected,
            [Frozen] Mock<IMediator> mediator,
            [Set(nameof(GetAppSettings))]
            [Greedy] SecurityController controller)
        {
            mediator.Setup(x => x.Send(
                      It.IsAny<ActiveCustomer.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var result = await controller.ActiveCustomer(new ActiveCustomerRequest { CustomerNumber = "" }).ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.BadRequest);
        }

        [Theory]
        [AutoDomainData]
        public async Task ActiveCustomer_OkRequest(ResponseBase<ActiveCustomer.Response> expected,
            [Frozen] Mock<IMediator> mediator,
            [Set(nameof(GetAppSettings))]
            [Greedy] SecurityController controller)
        {
            expected.Error.IsError = false;

            mediator.Setup(x => x.Send(
                      It.IsAny<ActiveCustomer.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var result = await controller.ActiveCustomer(new ActiveCustomerRequest { CustomerNumber = "" }).ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.OK);
        }

        //[Fact]
        //public void SecurityController_HasAuthorizeAttribute()
        //{
        //    //Arrange
        //    var controllerInfo = typeof(SecurityController).GetTypeInfo();

        //    //Act
        //    var authorizeAttribute = controllerInfo.GetCustomAttribute<AuthorizeAttribute>();
        //    var anonymousAttribute = controllerInfo.GetCustomAttribute<AllowAnonymousAttribute>();

        //    //Assert
        //    authorizeAttribute.Should().NotBeNull();
        //    authorizeAttribute.AuthenticationSchemes.Should().Be("SessionIdHeaderScheme");
        //    anonymousAttribute.Should().BeNull();
        //}

        //[Fact]
        //public void AllMethodsAuthCheck()
        //{
        //    //Arrange
        //    var methods = typeof(SecurityController).GetTypeInfo().GetMethods();

        //    foreach (var m in methods)
        //    {
        //        //Act
        //        var anonymousAttribute = m.GetCustomAttribute<AllowAnonymousAttribute>();
        //        //Assert
        //        anonymousAttribute.Should().BeNull();
        //    }
        //}

        [Theory]
        [AutoDomainData]
        public async Task GetInHouseAccount(
           ResponseBase<GetInHouseAccount.Response> expected,
           [Frozen] Mock<IMediator> mediator,
           [Set(nameof(GetAppSettings))]
            [Greedy] SecurityController controller)
        {
            mediator.Setup(x => x.Send(
                       It.IsAny<GetInHouseAccount.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var result = await controller.GetUserAsync("DCP").ConfigureAwait(false);

            result.Should().NotBeNull();
        }
    }
}
