using DigitalCommercePlatform.UIServices.Account.Actions.GetUser;
using DigitalCommercePlatform.UIServices.Account.Actions.ValidateUser;
using DigitalCommercePlatform.UIServices.Account.Controllers;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using FluentAssertions;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Account.Tests.Controller
{
    public class SeciurityControllerTests
    {
        private readonly Mock<IContext> _context;
        private readonly Mock<IMediator> _mediator;
        private readonly Mock<ILogger<SecurityController>> _logger;
        private readonly Mock<IOptions<AppSettings>> _optionsMock;
        private readonly Mock<ISiteSettings> _siteSettings;
        public SeciurityControllerTests()
        {
            var appSettingsDict = new Dictionary<string, string>()
            {
                { "localizationlist", "en-US" },
                { "SalesOrg", "WW_ORG" }
            };
            var appSettings = new AppSettings();
            appSettings.Configure(appSettingsDict);
            _context = new Mock<IContext>();
            _mediator = new Mock<IMediator>();
            _logger = new Mock<ILogger<SecurityController>>();
            _optionsMock = new Mock<IOptions<AppSettings>>();
            _optionsMock.Setup(s => s.Value).Returns(appSettings);
            _siteSettings = new Mock<ISiteSettings>();
        }

        private SecurityController GetController()
        {
            return new SecurityController(_mediator.Object, _optionsMock.Object, _logger.Object, _context.Object, _siteSettings.Object);
        }

        [Theory]
        [AutoMoqData]
        public async Task GetUser(GetUser.Response expected)
        {

            _mediator.Setup(x => x.Send(
                       It.IsAny<GetUser.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetUserAsync("DCP", "555000sq");

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoMoqData]
        public async Task AuthenticateUser(AuthenticateUser.Response expected)
        {
            var criteria = new Authenticate
            {
                Code = "testCode-1234",
                RedirectUri = "Http://TestSiteURL",
                SessionId = "2131231-324234234-45343",
                WithUserData = true
            };
            _mediator.Setup(x => x.Send(
                       It.IsAny<AuthenticateUser.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.Authenticate(criteria);

            result.Should().NotBeNull();
        }
    }
}
