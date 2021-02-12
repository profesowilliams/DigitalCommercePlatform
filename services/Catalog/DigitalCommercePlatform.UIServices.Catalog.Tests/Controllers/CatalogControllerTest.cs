using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Catalog.Tests.Controllers
{
    public class CatalogControllerTest
    {
        [Fact]
        public void TestTestMethod()
        {
            // Arrange
            var mockMediator = new Mock<IMediator>();
            var mockOptions = new Mock<IOptions<AppSettings>>();
            var mockLoggerFactory = new Mock<ILogger<BaseUIServiceController>>();
            var mockContext = new Mock<IContext>();
            var mockSiteSettings = new Mock<ISiteSettings>();

            //var _sut = new CatalogController(mockMediator.Object,
            //    mockOptions.Object,
            //    mockLoggerFactory.Object,
            //    mockContext.Object,
                
            //    mockSiteSettings.Object);
           // var nameToTest = "YourName";
            //// Act
           // var result = _sut.Test(nameToTest);
           // // Assert
            //Assert.Contains(nameToTest, result);
        }
    }
}
