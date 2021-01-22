using DigitalCommercePlatform.UIServices.Security.AppServices;
using DigitalCommercePlatform.UIServices.Security.Controllers;
using DigitalCommercePlatform.UIServices.Security.Requests;
using DigitalCommercePlatform.UIServices.Security.Responses;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Security.Tests.Controller
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
            _context = new Mock<IContext>();
            _mediator = new Mock<IMediator>();
            _logger = new Mock<ILogger<SecurityController>>();
            _optionsMock = new Mock<IOptions<AppSettings>>();
            _siteSettings = new Mock<ISiteSettings>();
        }

        [Fact]
        public async Task GetUserAsync_CorrectInput_ResturnSuccess()
        {
            var model = GetUserAndTokeRequestModel();
            var response = GetUserData();

            _mediator.Setup(x => x.Send(It.IsAny<GetUserQuery>(), It.IsAny<CancellationToken>()))
                           .ReturnsAsync(response);

            using (var controller = GetController())
            {
                //Act
                var result = await controller.GetUserAsync(model).ConfigureAwait(false);
                //Assert
                _mediator.Verify(x => x.Send(It.Is<GetUserQuery>(r => r.ApplicationName == "test"),
                    It.IsAny<CancellationToken>()),
                    Times.Once);
                result.Equals(response);
            }
        }

        private SecurityController GetController()
        {
            return new SecurityController(_mediator.Object, _optionsMock.Object, _logger.Object, _context.Object, _siteSettings.Object);
        }

        private UserAndTokenRequest GetUserAndTokeRequestModel()
        {
            return new UserAndTokenRequest()
            {
                ApplicationName = "test",
                SessionId = "test"
            };
        }

        private UserResponse GetUserData()
        {
            return new UserResponse()
            {
                User = new Models.User()
                {
                    Name = "TestUser"
                },
                HttpStatusCode = System.Net.HttpStatusCode.OK
            };
        }
    }
}