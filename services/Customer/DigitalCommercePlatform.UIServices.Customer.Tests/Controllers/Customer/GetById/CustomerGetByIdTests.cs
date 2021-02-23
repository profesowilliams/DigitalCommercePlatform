using DigitalCommercePlatform.UIServices.Customer.Controllers;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System.Collections.Generic;
using System.Net.Http;
using System.Reflection;
using Xunit;



namespace DigitalCommercePlatform.UIServices.Customer.Tests.Controllers.Customer.GetById
{
    public class CustomerGetByIdTests
    {
        private readonly Mock<IMediator> _mockMediator;
        private readonly Mock<IOptions<AppSettings>> _mockOptions;
        private readonly Mock<ILogger<BaseUIServiceController>> _mockLoggerFactory;
        private readonly Mock<IContext> _mockContext;
        private readonly Mock<ISiteSettings> _mockSiteSettings;
        private readonly Mock<IHttpClientFactory> _mockHttpClient;
        public CustomerGetByIdTests()
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
            _mockHttpClient = new Mock<IHttpClientFactory>();
        }


        [Fact]
        public void CustomerController_AuthCheck()
        {
            //Acc
            var controllerInfo = typeof(CustomerController).GetTypeInfo();
            //Act
            var authorizeAttribute = controllerInfo.GetCustomAttribute<AuthorizeAttribute>();
            var annonymousAttribute = controllerInfo.GetCustomAttribute<AllowAnonymousAttribute>();

            //Assert
            authorizeAttribute.Should().NotBeNull();
            annonymousAttribute.Should().BeNull();
        }
        [Fact]
        public void AllMethods_AuthCheck()
        {
            //Acc
            var methods = typeof(CustomerController).GetTypeInfo().GetMethods();

            foreach (var m in methods)
            {
                //Act
                var annonymousAttribute = m.GetCustomAttribute<AllowAnonymousAttribute>();
                //Assert
                annonymousAttribute.Should().BeNull();
            }
        }
        //[Theory]
        //[AutoDomainData]
        //public async Task GetByIds_ReturnsData(GetCustomersHandler.Response expected)
        //{
        //    //arrange
        //    _mockMediator.Setup(x => x.Send(It.IsAny<GetCustomersHandler.Request>(), It.IsAny<CancellationToken>()))
        //        .ReturnsAsync(expected);

        //    using var sut = GetController();

        //    var ids = new List<string> { "1", "2", "3" };

        //    //act
        //    _= await sut.GetByIds(ids).ConfigureAwait(false);

        //    //assert
        //    _mockMediator.Verify(x => x.Send(It.Is<GetCustomersHandler.Request>(x => x.Ids.Count == ids.Intersect(x.Ids).Count()), It.IsAny<CancellationToken>()), Times.Once);
        //}

        //[Theory]
        //[AutoDomainData]
        //public async Task Get_ReturnsData(CustomerGet.Response expected)
        //{
        ////arrange
        //_mockMediator.Setup(x => x.Send(It.IsAny<GetCustomerHandler.Request>(), It.IsAny<CancellationToken>()))
        //    .ReturnsAsync(expected);

        //using var sut = GetController();

        ////act
        //_= await sut.Get("1", false).ConfigureAwait(false);

        ////assert
        //_mockMediator.Verify(x => x.Send(It.IsAny<GetCustomerHandler.Request>(), It.IsAny<CancellationToken>()), Times.Once);
        //}

        private CustomerController GetController()
        {
            return null;
            //return new CustomerController(_mockMediator.Object,_mockLoggerFactory.Object,_mockContext.Object, 
            //    _mockOptions.Object,_mockSiteSettings.Object,_mockHttpClient.Object);
        }
    }
}
