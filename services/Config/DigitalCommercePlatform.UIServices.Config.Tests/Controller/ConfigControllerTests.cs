using DigitalCommercePlatform.UIServices.Config.Actions.GetConfigurations;
using DigitalCommercePlatform.UIServices.Config.Actions.GetDeal;
using DigitalCommercePlatform.UIServices.Config.Controllers;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using FluentAssertions;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Controller
{
    public class ConfigControllerTests
    {
        private readonly Mock<IMediator> _mockMediator;
        private readonly Mock<IOptions<AppSettings>> _mockOptions;
        private readonly Mock<ILogger<BaseUIServiceController>> _mockLoggerFactory;
        private readonly Mock<IContext> _mockContext;
        private readonly Mock<ISiteSettings> _mockSiteSettings;
        private readonly Mock<IHttpClientFactory> _mockHttpClient;
        public ConfigControllerTests()
        {
            var appSettingsDict = new Dictionary<string, string>()
            {
                { "localizationlist", "en-US" },
                { "SalesOrg", "WW_ORG" }
            };
            var appSettings = new AppSettings();
            appSettings.Configure(appSettingsDict);
            _mockMediator = new Mock<IMediator>();
            _mockOptions = new Mock<IOptions<AppSettings>>();
            _mockOptions.Setup(s => s.Value).Returns(appSettings);

            _mockLoggerFactory = new Mock<ILogger<BaseUIServiceController>>();
            _mockContext = new Mock<IContext>();
            _mockContext.SetupGet(x => x.Language).Returns("en-us");
            _mockSiteSettings = new Mock<ISiteSettings>();
        }

        [Theory]
        [AutoMoqData]
        public async Task GetConfigurations(GetConfigurations.Response expected)
        {

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetConfigurations.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();
            var criteria = new Models.Configurations.FindModel
            {
                CustomerId = "00380000",
                UserId = "50546",
                SortBy = "createdOn",
                //SortDirection = "createdOn",
            };

            var result = await controller.GetConfigurations(criteria).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoMoqData]
        public async Task GetDeals(GetDeals.Response expected)
        {

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetDeals.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();
            var criteria = new Models.Deals.FindModel
            {
                CustomerId = "00380000",
                UserId = "50546",
                SortBy = "createdOn",
                //SortDirection = "createdOn",
            };

            var result = await controller.GetDeals(criteria).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        private ConfigController GetController()
        {
            return new ConfigController(_mockMediator.Object, _mockLoggerFactory.Object, _mockContext.Object,
                _mockOptions.Object, _mockSiteSettings.Object);
        }
    }
}
