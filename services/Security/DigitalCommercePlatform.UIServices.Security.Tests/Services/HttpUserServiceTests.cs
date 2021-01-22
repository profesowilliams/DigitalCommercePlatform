using DigitalCommercePlatform.UIServices.Security.Infrastructure;
using DigitalFoundation.Common.Settings;
using Microsoft.Extensions.Options;
using Moq;
using Moq.Protected;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Security.Tests.AppServices
{
    public class HttpUserServiceTests
    {
        private Mock<IHttpClientFactory> _clientFactoryMock;
        private Mock<IOptions<AppSettings>> _appSettingsOptionMock;
        private Mock<IOptions<CoreSecurityEndpointsOptions>> _coreSecurityEndpointsOptionsMock;
        private Mock<HttpMessageHandler> _httpMessageHandlerMock;

        public HttpUserServiceTests()
        {
            _clientFactoryMock = new Mock<IHttpClientFactory>();
            _appSettingsOptionMock = new Mock<IOptions<AppSettings>>();
            _coreSecurityEndpointsOptionsMock = new Mock<IOptions<CoreSecurityEndpointsOptions>>();
            _httpMessageHandlerMock = new Mock<HttpMessageHandler>();
        }

        //[Fact]
        //public void GetUserAsync_ReturnSuccess()
        //{
        //    SetupAppSettings();
        //    SetupSeciurityEndpoints();
        //    SetupClientFactory();

        //    var httpUserService = new HttpUserService(_appSettingsOptionMock.Object, _coreSecurityEndpointsOptionsMock.Object, _clientFactoryMock.Object);

        //    var result = httpUserService.GetUserAsync("test", "test");

        //    _clientFactoryMock.Verify(x => x.CreateClient(It.IsAny<string>()),
        //        Times.Exactly(1));

        //    Assert.Equal(200, result.Result.StatusCode);
        //}

        //[Fact]
        //public void GetUserAsync_PassNullForAppSetting_ExpectedException()
        //{
        //    Assert.Throws<ArgumentNullException>(() => new HttpUserService(null, _coreSecurityEndpointsOptionsMock.Object, _clientFactoryMock.Object));
        //}

        //[Fact]
        //public void GetUserAsync_PassNullForCoreSeciurityEndpoints_ExpectedException()
        //{
        //    Assert.Throws<ArgumentNullException>(() => new HttpUserService(_appSettingsOptionMock.Object, null, _clientFactoryMock.Object));
        //}

        //[Fact]
        //public void GetUserAsync_PassNullForClientFactory_ExpectedException()
        //{
        //    Assert.Throws<ArgumentNullException>(() => new HttpUserService(_appSettingsOptionMock.Object, _coreSecurityEndpointsOptionsMock.Object, null));
        //}

        private void SetupClientFactory()
        {
            var response = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(@"{ ""StatusCode"": 1 }"),
            };

            _httpMessageHandlerMock.Protected()
               .Setup<Task<HttpResponseMessage>>(
                   "SendAsync",
                   ItExpr.IsAny<HttpRequestMessage>(),
                   ItExpr.IsAny<CancellationToken>())
               .Returns(Task.FromResult(response));

            var client = new HttpClient(_httpMessageHandlerMock.Object);

            _clientFactoryMock.Setup(x => x.CreateClient(It.IsAny<string>()))
                .Returns(client);
        }

        private void SetupAppSettings()
        {
            var appSettings = new AppSettings();

            appSettings.Configure(new Dictionary<string, string>()
            {
                {"Core.Security.Url","http://ExampplePath" }
            });

            _appSettingsOptionMock.Setup(x => x.Value)
                .Returns(appSettings);
        }

        private void SetupSeciurityEndpoints()
        {
            var coreSecurityEndpoints = new CoreSecurityEndpointsOptions();

            coreSecurityEndpoints.Validate = "true";

            _coreSecurityEndpointsOptionsMock.Setup(x => x.Value)
                .Returns(coreSecurityEndpoints);
        }
    }
}