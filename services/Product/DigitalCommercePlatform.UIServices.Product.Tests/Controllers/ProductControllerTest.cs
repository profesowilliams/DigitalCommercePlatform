using DigitalCommercePlatform.UIServices.Product.Controllers;
using Xunit;
using Microsoft.AspNetCore.Authorization;
using System.Reflection;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Controllers
{
    public class ProductControllerTest
    {
        [Theory]
        [InlineData("GetSummary")]
        [InlineData("GetSummaryMultiple")]
        [InlineData("Get")]
        [InlineData("GetMultiple")]
        [InlineData("Find")]
        public void Method_Request_AuthCheck(string methodName)
        {
            //Arrange
            var methodInfo = typeof(ProductController).GetTypeInfo().GetMethod(methodName);

            //Act
            _ = methodInfo.GetCustomAttribute<AuthorizeAttribute>();
            _ = typeof(ProductController).GetTypeInfo().GetCustomAttribute<AuthorizeAttribute>();
            _ = methodInfo.GetCustomAttribute<AllowAnonymousAttribute>();
        }
        //[Fact]
        //public void GetTest()
        //{
        //    // Arrange
        //    var mockMediator = new Mock<IMediator>();
        //    //var mockHttpContextAccessor = new Mock<IHttpContextAccessor>();
        //    var mockOptions = new Mock<IOptions<AppSettings>>();
        //    var mockLoggerFactory = new Mock<ILoggerFactory>();
        //    var mockContext = new Mock<IContext>();
        //    //var mockUserIdentity = new Mock<IUserIdentity>();
        //    var mockSiteSettings = new Mock<ISiteSettings>();

        //    var _sut = new ProductController(mockMediator.Object,
        //       // mockHttpContextAccessor.Object,
        //        mockOptions.Object,
        //        mockLoggerFactory.Object,
        //        mockContext.Object,
        //       // mockUserIdentity.Object,
        //        mockSiteSettings.Object);
        //    var nameToTest = "John";
        //    // Act
        //    var result = _sut.Test(nameToTest);
        //    // Assert
        //    Assert.Contains(nameToTest, result);
        //}

        //[Fact(Skip = "It's not ready yet")]
        //public void GetQuotesTests()
        //{
        //    // TODO
        //}
    }
}
