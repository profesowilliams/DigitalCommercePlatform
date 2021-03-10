using DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderQoute;
using DigitalCommercePlatform.UIServices.Commerce.Controllers;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Commerce.Tests.Controller
{
   public class QuoteControllerTests
    {
        private readonly Mock<IContext> _context;
        private readonly Mock<IMediator> _mediator;
        private readonly Mock<ILogger<QuoteController>> _logger;
        private readonly Mock<IOptions<AppSettings>> _optionsMock;
        private readonly Mock<ISiteSettings> _siteSettings;

        public QuoteControllerTests()
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
            _logger = new Mock<ILogger<QuoteController>>();
            _optionsMock = new Mock<IOptions<AppSettings>>();
            _optionsMock.Setup(s => s.Value).Returns(appSettings);
            _siteSettings = new Mock<ISiteSettings>();
        }

        private QuoteController GetController()
        {
            return new QuoteController(_mediator.Object, _optionsMock.Object, _logger.Object, _context.Object, _siteSettings.Object);
        }

        [Fact]
        public void GetQuote()
        {

            //_mediator.Setup(x => x.Send(
            //           It.IsAny<GetQuote.Request>(),
            //           It.IsAny<CancellationToken>()))
            //       .ReturnsAsync(expected);

            var controller = GetController();

            var result = controller.GetQuote("645665656565");

            result.Should().NotBeNull();
        }



        [Theory]
        [AutoDomainData]
        public async Task GetOrderDetailsInQuoteAsync(DetailsOfOrderQuote.Response expected)
        {

            _mediator.Setup(x => x.Send(
                      It.IsAny<DetailsOfOrderQuote.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetOrderDetailsInQuoteAsync("1234","1234").ConfigureAwait(false);

            result.Should().NotBeNull();
        }
    }
}
