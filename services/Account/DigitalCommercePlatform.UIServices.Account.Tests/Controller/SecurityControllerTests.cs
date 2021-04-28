using AutoFixture.Xunit2;
using DigitalCommercePlatform.UIServices.Account.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Account.Actions.GetUser;
using DigitalCommercePlatform.UIServices.Account.Actions.Logout;
using DigitalCommercePlatform.UIServices.Account.Actions.ValidateUser;
using DigitalCommercePlatform.UIServices.Account.Controllers;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using MediatR;
using Moq;
using System.Collections.Generic;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Account.Tests.Controller
{
    public class SecurityControllerTests
    {
        public static AppSettings GetAppSettings()
        {
            var appSettingsDict = new Dictionary<string, string>()
                {
                    { "localizationlist", "en-US" },
                    { "SalesOrg", "WW_ORG" }
                };

            var appSettings = new AppSettings();
            appSettings.Configure(appSettingsDict);
            return appSettings;
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

            var result = await controller.Authenticate(bodyRequest,headerRequest);

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
            var result = await controller.Authenticate(null,null).ConfigureAwait(false);

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
    }
}