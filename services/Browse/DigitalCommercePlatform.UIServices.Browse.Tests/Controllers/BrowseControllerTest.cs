using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Controllers
{
    public class BrowseControllerTest
    {
        [Fact]
        public void GetTest()
        {
            // Arrange
            var mockMediator = new Mock<IMediator>();
            var mockHttpContextAccessor = new Mock<IHttpContextAccessor>();
            var mockOptions = new Mock<IOptions<AppSettings>>();
            var mockLoggerFactory = new Mock<ILoggerFactory>();
            var mockContext = new Mock<IContext>();
            // var mockUserIdentity = new Mock<IUserIdentity>();
            var mockSiteSettings = new Mock<ISiteSettings>();

            //var _sut = new BrowseController(mockMediator.Object,
            //    mockHttpContextAccessor.Object,
            //    mockOptions.Object,
            //    mockLoggerFactory.Object,
            //    mockContext.Object,
            //  //  mockUserIdentity.Object,
            //    mockSiteSettings.Object);
            //var nameToTest = "John";
            //// Act
            //var result = _sut.Test(nameToTest);
            //// Assert
            //Assert.Contains(nameToTest, result);
        }

        [Fact(Skip = "It's not ready yet")]
        public void GetQuotesTests()
        {
            // TODO
        }
    }
}