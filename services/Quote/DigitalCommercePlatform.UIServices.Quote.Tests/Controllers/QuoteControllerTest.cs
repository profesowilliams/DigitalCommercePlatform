using DigitalCommercePlatform.UIServices.Quote.Controllers;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Security.Identity;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Quote.Tests.Controllers
{
    public class QuoteControllerTest
    {
        [Fact]
        public void GetTest()
        {
            // Arrange
            var mockMediator = new Mock<IMediator>();
            var mockOptions = new Mock<IOptions<AppSettings>>();
            var mockLoggerFactory = new Mock<ILogger<BaseUIServiceController>> ();
            var mockContext = new Mock<IContext>();
            var mockSiteSettings = new Mock<ISiteSettings>();
            
            var _sut = new QuoteController(mockMediator.Object,
                mockLoggerFactory.Object,
                mockContext.Object,
                mockOptions.Object,
                mockSiteSettings.Object);
            var nameToTest = "John";
            // Act
            var result = _sut.Test(nameToTest);
            // Assert
            Assert.Contains(nameToTest, result);
        }

        [Fact(Skip = "It's not ready yet")]
        public void GetQuotesTests()
        {
            // TODO
        }
    }
}
